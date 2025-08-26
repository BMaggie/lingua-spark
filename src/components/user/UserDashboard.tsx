import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Clock, 
  Award, 
  Zap, 
  Target,
  Play,
  Star,
  Flame,
  Trophy,
  Calendar,
  TrendingUp,
  Users,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

const UserDashboard = () => {
  const userStats = {
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face",
    currentStreak: 15,
    totalXP: 2847,
    level: 12,
    nextLevelXP: 3200,
    coursesCompleted: 3,
    lessonsCompleted: 47,
    studyTimeToday: 45,
    weeklyGoal: 300,
    weeklyProgress: 180
  };

  const currentCourses = [
    {
      id: 1,
      title: "Spanish for Beginners",
      language: "Spanish",
      progress: 78,
      nextLesson: "Colors and Numbers",
      estimatedTime: "15 min",
      difficulty: "beginner",
      image: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: "French Conversation",
      language: "French", 
      progress: 45,
      nextLesson: "At the Restaurant",
      estimatedTime: "20 min",
      difficulty: "intermediate",
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Italian Grammar",
      language: "Italian",
      progress: 23,
      nextLesson: "Past Tense Verbs",
      estimatedTime: "25 min", 
      difficulty: "intermediate",
      image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=300&h=200&fit=crop"
    }
  ];

  const achievements = [
    { id: 1, title: "First Steps", description: "Complete your first lesson", icon: "🎯", unlocked: true },
    { id: 2, title: "Week Warrior", description: "7-day learning streak", icon: "🔥", unlocked: true },
    { id: 3, title: "Speed Learner", description: "Complete 5 lessons in one day", icon: "⚡", unlocked: true },
    { id: 4, title: "Polyglot", description: "Study 3 different languages", icon: "🌍", unlocked: false },
    { id: 5, title: "Master", description: "Complete an entire course", icon: "🏆", unlocked: false }
  ];

  const dailyGoals = [
    { task: "Complete 2 lessons", completed: 2, target: 2, icon: BookOpen },
    { task: "Study for 30 minutes", completed: 45, target: 30, icon: Clock },
    { task: "Practice speaking", completed: 1, target: 1, icon: Award },
    { task: "Review flashcards", completed: 15, target: 20, icon: Star }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'learning-beginner';
      case 'intermediate': return 'learning-intermediate'; 
      case 'advanced': return 'learning-advanced';
      default: return 'learning-beginner';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userStats.avatar} alt={userStats.name} />
              <AvatarFallback>{userStats.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {userStats.name}! 👋</h1>
              <p className="text-muted-foreground">Ready to continue your language journey?</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-gamification-streak">
                <Flame className="h-6 w-6" />
                <span>{userStats.currentStreak}</span>
              </div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gamification-xp">{userStats.totalXP}</div>
              <p className="text-xs text-muted-foreground">Total XP</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="hover-lift border-0 bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Level</p>
                    <p className="text-3xl font-bold text-primary">{userStats.level}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress to Level {userStats.level + 1}</span>
                    <span>{userStats.totalXP}/{userStats.nextLevelXP} XP</span>
                  </div>
                  <Progress value={(userStats.totalXP / userStats.nextLevelXP) * 100} className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="hover-lift border-0 bg-gradient-to-br from-success/10 to-success/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Lessons Today</p>
                    <p className="text-3xl font-bold text-success">{dailyGoals[0].completed}</p>
                  </div>
                  <div className="p-3 bg-success/10 rounded-full">
                    <BookOpen className="h-6 w-6 text-success" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Goal: {dailyGoals[0].target} lessons
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card className="hover-lift border-0 bg-gradient-to-br from-warning/10 to-warning/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Study Time</p>
                    <p className="text-3xl font-bold text-warning">{userStats.studyTimeToday}m</p>
                  </div>
                  <div className="p-3 bg-warning/10 rounded-full">
                    <Clock className="h-6 w-6 text-warning" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Daily goal: 30 minutes
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card className="hover-lift border-0 bg-gradient-to-br from-accent/10 to-accent/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Weekly Progress</p>
                    <p className="text-3xl font-bold text-accent">{Math.round((userStats.weeklyProgress / userStats.weeklyGoal) * 100)}%</p>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-full">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={(userStats.weeklyProgress / userStats.weeklyGoal) * 100} />
                  <p className="text-xs text-muted-foreground mt-2">
                    {userStats.weeklyProgress}/{userStats.weeklyGoal} minutes this week
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Courses */}
          <div className="lg:col-span-2">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>Continue Learning</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold">{course.title}</h3>
                        <Badge className={`bg-${getDifficultyColor(course.difficulty)} text-white`}>
                          {course.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Next: {course.nextLesson} • {course.estimatedTime}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Progress value={course.progress} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{course.progress}%</span>
                      </div>
                    </div>
                    <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-4 w-4 mr-1" />
                      Continue
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Daily Goals */}
            <Card className="hover-lift mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Daily Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dailyGoals.map((goal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-border"
                    >
                      <div className={`p-2 rounded-lg ${
                        goal.completed >= goal.target ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      }`}>
                        <goal.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{goal.task}</p>
                        <p className="text-xs text-muted-foreground">
                          {goal.completed}/{goal.target} {goal.completed >= goal.target ? '✓' : ''}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Recent Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.slice(0, 3).map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex items-center space-x-3 p-3 rounded-lg border ${
                      achievement.unlocked 
                        ? 'bg-success/5 border-success/20' 
                        : 'bg-muted/50 border-border'
                    }`}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{achievement.title}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <div className="text-success">
                        <Award className="h-4 w-4" />
                      </div>
                    )}
                  </motion.div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Achievements
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Find Study Partners
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Study Time
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Zap className="h-4 w-4 mr-2" />
                  Practice Speaking
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;