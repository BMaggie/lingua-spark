import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BarChart3, LogOut, Trash2, UserCheck, UserX, Award, BookOpen, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AdminDashboardProps {
  user: { name: string; role: 'admin' | 'user' };
  onLogout: () => void;
}

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  role: string;
  created_at: string;
  avatar_url?: string;
  userStats?: {
    words_learned: number;
    streak: number;
    points: number;
    level: number;
    base_language?: string;
    target_language?: string;
  };
}

interface UserStats {
  totalUsers: number;
  adminUsers: number;
  regularUsers: number;
  recentSignups: number;
  totalWordsLearned: number;
  averageLevel: number;
  activeLanguagePairs: number;
}

const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    recentSignups: 0,
    totalWordsLearned: 0,
    averageLevel: 0,
    activeLanguagePairs: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch profiles with their associated user stats
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_stats (
            words_learned,
            streak,
            points,
            level,
            base_language,
            target_language
          )
        `)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Transform the data to match our interface
      const transformedUsers: UserProfile[] = (profiles || []).map(profile => ({
        ...profile,
        userStats: profile.user_stats?.[0] || undefined
      }));

      setUsers(transformedUsers);
      
      // Fetch comprehensive stats
      const { data: allUserStats, error: statsError } = await supabase
        .from('user_stats')
        .select('*');

      if (statsError) throw statsError;

      // Calculate comprehensive stats
      const total = profiles?.length || 0;
      const admins = profiles?.filter(p => p.role === 'admin').length || 0;
      const regular = total - admins;
      
      // Recent signups (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recent = profiles?.filter(p => new Date(p.created_at) > weekAgo).length || 0;

      // Calculate learning stats
      const totalWordsLearned = allUserStats?.reduce((sum, stat) => sum + (stat.words_learned || 0), 0) || 0;
      const averageLevel = allUserStats?.length > 0 
        ? Math.round(allUserStats.reduce((sum, stat) => sum + (stat.level || 1), 0) / allUserStats.length)
        : 0;
      
      // Count unique language pairs
      const languagePairs = new Set();
      allUserStats?.forEach(stat => {
        if (stat.base_language && stat.target_language) {
          languagePairs.add(`${stat.base_language}-${stat.target_language}`);
        }
      });

      setStats({
        totalUsers: total,
        adminUsers: admins,
        regularUsers: regular,
        recentSignups: recent,
        totalWordsLearned,
        averageLevel,
        activeLanguagePairs: languagePairs.size
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });
      
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold gradient-text">NorthLing Admin</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section with Admin Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Admin Dashboard Overview</h2>
                  <p className="text-blue-100 mb-6">
                    Manage your LinguaSpark platform, monitor user progress, and track learning analytics. 
                    Get insights into how your users are engaging with language learning content.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl font-bold">{stats.totalUsers}</div>
                      <div className="text-sm text-blue-100">Total Users</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <div className="text-2xl font-bold">{stats.totalWordsLearned.toLocaleString()}</div>
                      <div className="text-sm text-blue-100">Words Learned</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop"
                    alt="Team collaboration and data analytics"
                    className="rounded-lg shadow-lg max-w-full h-auto"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.adminUsers} admins, {stats.regularUsers} learners
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalWordsLearned.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total words learned</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Level</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageLevel}</div>
                <p className="text-xs text-muted-foreground">Across all users</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Language Pairs</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeLanguagePairs}</div>
                <p className="text-xs text-muted-foreground">Active combinations</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* User Engagement Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="order-2 lg:order-1">
                  <img 
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop"
                    alt="User engagement and learning analytics"
                    className="rounded-lg shadow-lg max-w-full h-auto"
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <h3 className="text-2xl font-bold mb-4">User Engagement Analytics</h3>
                  <p className="text-gray-600 mb-6">
                    Monitor how users interact with the platform. Track learning streaks, vocabulary retention, 
                    and identify trends in language learning preferences to optimize the user experience.
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">New Sign-ups (7 days)</span>
                      <Badge variant="secondary">{stats.recentSignups}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Active Language Pairs</span>
                      <Badge variant="secondary">{stats.activeLanguagePairs}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">User</th>
                      <th className="text-left p-4">Learning Progress</th>
                      <th className="text-left p-4">Languages</th>
                      <th className="text-left p-4">Role</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userProfile) => (
                      <tr key={userProfile.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {(userProfile.full_name || userProfile.username || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">
                                {userProfile.full_name || userProfile.username || 'No name'}
                              </div>
                              <div className="text-sm text-gray-500">{userProfile.username}</div>
                              <div className="text-xs text-gray-400">
                                Joined {new Date(userProfile.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {userProfile.userStats ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-3 w-3 text-blue-500" />
                                <span className="text-sm font-medium">{userProfile.userStats.words_learned} words</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Award className="h-3 w-3 text-yellow-500" />
                                <span className="text-sm">Level {userProfile.userStats.level}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Target className="h-3 w-3 text-green-500" />
                                <span className="text-sm">{userProfile.userStats.points} points</span>
                              </div>
                              {userProfile.userStats.streak > 0 && (
                                <div className="text-xs text-orange-600">
                                  🔥 {userProfile.userStats.streak} day streak
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">No progress data</div>
                          )}
                        </td>
                        <td className="p-4">
                          {userProfile.userStats?.base_language && userProfile.userStats?.target_language ? (
                            <div className="space-y-1">
                              <Badge variant="outline" className="text-xs">
                                {userProfile.userStats.base_language} → {userProfile.userStats.target_language}
                              </Badge>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">Not set</div>
                          )}
                        </td>
                        <td className="p-4">
                          <Badge variant={userProfile.role === 'admin' ? 'default' : 'secondary'}>
                            {userProfile.role}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRoleChange(
                                userProfile.id, 
                                userProfile.role === 'admin' ? 'user' : 'admin'
                              )}
                            >
                              {userProfile.role === 'admin' ? 'Make User' : 'Make Admin'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No users found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;