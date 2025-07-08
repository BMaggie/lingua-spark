
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, BookOpen, Star, TrendingUp, Search, Shield, Edit } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  full_name: string;
  role: string;
  created_at: string;
  email?: string;
}

interface UserStats {
  user_id: string;
  words_learned: number;
  streak: number;
  points: number;
  level: number;
  base_language: string;
  target_language: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalPoints: 0,
    avgWordsLearned: 0,
    activeUsers: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUsersAndStats();
  }, []);

  const fetchUsersAndStats = async () => {
    try {
      setIsLoading(true);
      
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*');

      if (usersError) throw usersError;

      // Fetch user stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*');

      if (statsError) throw statsError;

      setUsers(usersData || []);
      setUserStats(statsData || []);

      // Calculate analytics
      const totalUsers = usersData?.length || 0;
      const totalAdmins = usersData?.filter(user => user.role === 'admin').length || 0;
      const totalPoints = statsData?.reduce((sum, stat) => sum + (stat.points || 0), 0) || 0;
      const avgWordsLearned = totalUsers > 0 ? 
        Math.round((statsData?.reduce((sum, stat) => sum + (stat.words_learned || 0), 0) || 0) / totalUsers) : 0;
      const activeUsers = statsData?.filter(stat => stat.streak > 0).length || 0;

      setAnalytics({
        totalUsers,
        totalAdmins,
        totalPoints,
        avgWordsLearned,
        activeUsers
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
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

      fetchUsersAndStats();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserStats = (userId: string) => {
    return userStats.find(stat => stat.user_id === userId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users and view platform analytics</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalAdmins} admins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              With active streaks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPoints.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Words</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgWordsLearned}</div>
            <p className="text-xs text-muted-foreground">
              Per user
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => {
              const stats = getUserStats(user.id);
              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                      <span className="font-semibold text-blue-600">
                        {(user.full_name || user.username || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {user.full_name || user.username || 'Unknown User'}
                        </h3>
                        <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </p>
                      {stats && (
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">
                            {stats.points} points
                          </span>
                          <span className="text-xs text-gray-500">
                            {stats.words_learned} words
                          </span>
                          <span className="text-xs text-gray-500">
                            {stats.streak} day streak
                          </span>
                          {stats.base_language && stats.target_language && (
                            <span className="text-xs text-gray-500">
                              {stats.base_language} → {stats.target_language}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
