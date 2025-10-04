import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  Users, 
  TrendingUp, 
  Award, 
  Activity,
  UserPlus,
  Target,
  BookOpen
} from 'lucide-react';

interface UserActivity {
  id: string;
  user_id: string;
  type: 'registration' | 'lesson_completed' | 'achievement' | 'quiz_completed' | 'level_up';
  description: string;
  created_at: string;
}

const getActivityColor = (type: UserActivity['type']) => {
  const colors = {
    registration: 'bg-green-500',
    lesson_completed: 'bg-blue-500',
    achievement: 'bg-yellow-500',
    quiz_completed: 'bg-purple-500',
    level_up: 'bg-pink-500'
  };
  return colors[type] || 'bg-gray-500';
};

const formatTimeAgo = (date: string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalPoints: number;
    newUsersToday: number;
    totalLessonsCompleted: number;
    averageUserLevel: number;
    activeLanguages: number;
    topLanguage: string;
  }

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPoints: 0,
    newUsersToday: 0,
    totalLessonsCompleted: 0,
    averageUserLevel: 0,
    activeLanguages: 0,
    topLanguage: ''
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([]);
  const [platformHealth, setPlatformHealth] = useState({
    userEngagement: 0,
    contentCompletion: 0,
    dailyActiveUsers: 0,
    avgSessionTime: 0
  });

  useEffect(() => {
    loadDashboardStats();
    loadRecentActivities();
    loadPlatformHealth();
    // Set up real-time subscription for user updates
    const userSubscription = supabase
      .channel('user-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        loadDashboardStats(); // Reload stats when user data changes
      })
      .subscribe();

    return () => {
      userSubscription.unsubscribe();
    };
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Get basic user profiles
      const { data: users } = await supabase
        .from('profiles')
        .select(`
          *,
          user_stats (
            points,
            level,
            words_learned,
            lessons_completed,
            base_language,
            target_language
          )
        `);

      const today = new Date().toISOString().split('T')[0];
      
      // Calculate comprehensive stats
      const newUsersToday = users?.filter(user => 
        user.created_at?.startsWith(today)
      ).length || 0;

      // Calculate total lessons completed
      const totalLessonsCompleted = users?.reduce((sum, user) => 
        sum + (user.user_stats?.[0]?.lessons_completed || 0), 0) || 0;

      // Calculate average user level
      const totalLevels = users?.reduce((sum, user) => 
        sum + (user.user_stats?.[0]?.level || 0), 0) || 0;
      const averageUserLevel = users?.length ? Math.round(totalLevels / users.length) : 0;

      // Count unique active languages
      const uniqueLanguages = new Set();
      users?.forEach(user => {
        if (user.user_stats?.[0]?.target_language) {
          uniqueLanguages.add(user.user_stats[0].target_language);
        }
      });

      // Find the most popular language
      const languageCounts: { [key: string]: number } = {};
      users?.forEach(user => {
        const lang = user.user_stats?.[0]?.target_language;
        if (lang) {
          languageCounts[lang] = (languageCounts[lang] || 0) + 1;
        }
      });
      const topLanguage = Object.entries(languageCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

      setStats({
        totalUsers: users?.length || 0,
        activeUsers: users?.filter(user => user.role === 'user').length || 0,
        totalPoints: users?.reduce((sum, user) => 
          sum + (user.user_stats?.[0]?.points || 0), 0) || 0,
        newUsersToday,
        totalLessonsCompleted,
        averageUserLevel,
        activeLanguages: uniqueLanguages.size,
        topLanguage
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivities = async () => {
    try {
      const { data: activities, error } = await supabase
        .from('user_activities')
        .select(`
          id,
          user_id,
          type,
          description,
          created_at,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setRecentActivities(activities || []);

      // Set up real-time subscription for new activities
      const activitySubscription = supabase
        .channel('activities')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'user_activities' 
          }, 
          payload => {
            setRecentActivities(current => {
              const newActivity = payload.new as UserActivity;
              return [newActivity, ...current.slice(0, 9)];
            });
          }
        )
        .subscribe();

      return () => {
        activitySubscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error loading recent activities:', error);
    }
  };

  const loadPlatformHealth = async () => {
    try {
      // Calculate daily active users
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data: dailyActive } = await supabase
        .from('user_sessions')
        .select('user_id', { count: 'exact' })
        .gte('last_activity', today.toISOString());

      // Get average session time
      const { data: sessionStats } = await supabase
        .from('user_sessions')
        .select('duration')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // Get content completion stats
      const { data: contentStats } = await supabase
        .from('user_progress')
        .select('lessons_completed, total_lessons');

      // Calculate metrics
      const totalUsers = stats.totalUsers;
      const dailyActiveUsers = dailyActive?.length || 0;
      const dailyActivePercentage = Math.round((dailyActiveUsers / totalUsers) * 100) || 0;

      const avgSessionTime = sessionStats?.reduce((sum, session) => sum + (session.duration || 0), 0) || 0;
      const avgSessionMinutes = Math.round(avgSessionTime / (sessionStats?.length || 1) / 60);

      const completionRate = contentStats?.reduce((sum, stat) => {
        return sum + ((stat.lessons_completed / stat.total_lessons) * 100);
      }, 0) || 0;
      const avgCompletionRate = Math.round(completionRate / (contentStats?.length || 1));

      // Calculate user engagement based on multiple factors
      const engagement = Math.round(
        (dailyActivePercentage + avgCompletionRate) / 2
      );

      setPlatformHealth({
        userEngagement: engagement,
        contentCompletion: avgCompletionRate,
        dailyActiveUsers: dailyActivePercentage,
        avgSessionTime: avgSessionMinutes
      });
    } catch (error) {
      console.error('Error loading platform health metrics:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center justify-center gap-2 h-16"
            onClick={() => window.location.href = '/admin/users'}
          >
            <Users className="h-5 w-5" />
            <div className="flex flex-col items-start">
              <span className="font-semibold">User Management</span>
              <span className="text-sm text-gray-500">Manage users and roles</span>
            </div>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="flex items-center justify-center gap-2 h-16"
            onClick={() => window.location.href = '/admin/content'}
          >
            <BookOpen className="h-5 w-5" />
            <div className="flex flex-col items-start">
              <span className="font-semibold">Content Management</span>
              <span className="text-sm text-gray-500">Update learning materials</span>
            </div>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="flex items-center justify-center gap-2 h-16"
            onClick={() => window.location.href = '/admin/analytics'}
          >
            <Activity className="h-5 w-5" />
            <div className="flex flex-col items-start">
              <span className="font-semibold">Analytics</span>
              <span className="text-sm text-gray-500">View insights and reports</span>
            </div>
          </Button>
        </div>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="cursor-pointer transition-all hover:shadow-lg" 
          onClick={() => navigate('/admin/users')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                +{stats.newUsersToday} new today
              </p>
              <Badge variant="secondary" className="text-xs">View Details</Badge>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-lg" 
          onClick={() => navigate('/admin/users')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Regular learners
              </p>
              <Badge variant="secondary" className="text-xs">View Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-lg" 
          onClick={() => navigate('/admin/analytics')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Across all users
              </p>
              <Badge variant="secondary" className="text-xs">View Stats</Badge>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer transition-all hover:shadow-lg" 
          onClick={() => navigate('/admin/analytics')}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                From last month
              </p>
              <Badge variant="secondary" className="text-xs">View Trends</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div 
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(activity.created_at)}</p>
                  </div>
                </motion.div>
              ))}
              {recentActivities.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No recent activity
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Platform Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>User Engagement</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Content Completion</span>
                  <span>72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>System Performance</span>
                  <span>98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
