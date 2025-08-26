import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Activity,
  GraduationCap,
  Clock,
  Globe,
  Award,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboardOverview = () => {
  const kpiData = [
    {
      title: "Active Users",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "primary",
      description: "Users active in the last 30 days"
    },
    {
      title: "Lessons Completed",
      value: "18,492",
      change: "+8.3%", 
      trend: "up",
      icon: BookOpen,
      color: "success",
      description: "Total lessons completed this month"
    },
    {
      title: "Retention Rate",
      value: "84.2%",
      change: "+2.1%",
      trend: "up", 
      icon: TrendingUp,
      color: "accent",
      description: "7-day user retention rate"
    },
    {
      title: "Course Completion",
      value: "67.8%",
      change: "-1.4%",
      trend: "down",
      icon: GraduationCap,
      color: "warning",
      description: "Average course completion rate"
    }
  ];

  const languageStats = [
    { language: "Spanish", users: 1247, completion: 78 },
    { language: "French", users: 892, completion: 82 },
    { language: "German", users: 634, completion: 71 },
    { language: "Italian", users: 423, completion: 85 },
    { language: "Portuguese", users: 312, completion: 76 }
  ];

  const recentActivity = [
    { action: "New user registration", user: "Sarah Chen", time: "2 minutes ago", type: "user" },
    { action: "Course completed", user: "Mike Johnson", course: "Spanish Basics", time: "5 minutes ago", type: "completion" },
    { action: "Achievement unlocked", user: "Emma Davis", achievement: "30-day streak", time: "12 minutes ago", type: "achievement" },
    { action: "Lesson published", course: "French Intermediate", time: "1 hour ago", type: "content" },
    { action: "Bug report submitted", user: "Alex Rodriguez", time: "2 hours ago", type: "bug" }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary text-primary-foreground';
      case 'success': return 'bg-success text-success-foreground';
      case 'accent': return 'bg-accent text-accent-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-success' : 'text-destructive';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Monitor your language learning platform performance</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Activity className="h-4 w-4 mr-1" />
          Live Data
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${getColorClasses(kpi.color)}`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">{kpi.value}</div>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${getTrendColor(kpi.trend)}`}>
                    {kpi.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{kpi.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Popularity */}
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle>Language Popularity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {languageStats.map((lang, index) => (
              <motion.div
                key={lang.language}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{lang.language}</span>
                    <span className="text-sm text-muted-foreground">{lang.users} users</span>
                  </div>
                  <Progress value={lang.completion} className="h-2" />
                </div>
                <div className="ml-4 text-sm font-medium">{lang.completion}%</div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle>Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-1 rounded-full ${
                    activity.type === 'user' ? 'bg-primary/10 text-primary' :
                    activity.type === 'completion' ? 'bg-success/10 text-success' :
                    activity.type === 'achievement' ? 'bg-accent/10 text-accent' :
                    activity.type === 'content' ? 'bg-info/10 text-info' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {activity.type === 'user' && <Users className="h-3 w-3" />}
                    {activity.type === 'completion' && <BookOpen className="h-3 w-3" />}
                    {activity.type === 'achievement' && <Award className="h-3 w-3" />}
                    {activity.type === 'content' && <GraduationCap className="h-3 w-3" />}
                    {activity.type === 'bug' && <Activity className="h-3 w-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      {activity.user && <span>{activity.user}</span>}
                      {activity.course && <span>• {activity.course}</span>}
                      {activity.achievement && <span>• {activity.achievement}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium">View Analytics</p>
                <p className="text-sm text-muted-foreground">Detailed performance metrics</p>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <Users className="h-8 w-8 text-success" />
              <div>
                <p className="font-medium">Manage Users</p>
                <p className="text-sm text-muted-foreground">User accounts and permissions</p>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <BookOpen className="h-8 w-8 text-accent" />
              <div>
                <p className="font-medium">Content Library</p>
                <p className="text-sm text-muted-foreground">Add and edit lessons</p>
              </div>
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardOverview;