import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Trophy, 
  Medal, 
  Star, 
  Target, 
  Flame, 
  Crown, 
  Award, 
  TrendingUp,
  Users,
  Calendar,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  xp: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  position: number;
}

const GamePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('achievements');

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: Star,
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      xp: 50,
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Streak Master',
      description: 'Maintain a 7-day learning streak',
      icon: Flame,
      unlocked: false,
      progress: 3,
      maxProgress: 7,
      xp: 200,
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Vocabulary Hero',
      description: 'Learn 100 new words',
      icon: Trophy,
      unlocked: false,
      progress: 45,
      maxProgress: 100,
      xp: 500,
      rarity: 'epic'
    },
    {
      id: '4',
      title: 'Quiz Champion',
      description: 'Complete 50 quizzes with 90% accuracy',
      icon: Crown,
      unlocked: false,
      progress: 12,
      maxProgress: 50,
      xp: 1000,
      rarity: 'legendary'
    }
  ];

  const leaderboard: LeaderboardUser[] = [
    {
      id: '1',
      name: 'Maria García',
      avatar: '/avatars/maria.jpg',
      xp: 15420,
      level: 23,
      streak: 45,
      position: 1
    },
    {
      id: '2',
      name: 'John Smith',
      avatar: '/avatars/john.jpg',
      xp: 12890,
      level: 19,
      streak: 32,
      position: 2
    },
    {
      id: '3',
      name: 'Emma Johnson',
      avatar: '/avatars/emma.jpg',
      xp: 11240,
      level: 17,
      streak: 28,
      position: 3
    },
    {
      id: '4',
      name: user?.profile?.full_name || user?.email || 'You',
      avatar: user?.profile?.avatar_url || '/avatars/default.jpg',
      xp: 8750,
      level: 14,
      streak: 15,
      position: 4
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 border-gray-300';
      case 'rare': return 'text-blue-600 border-blue-300';
      case 'epic': return 'text-purple-600 border-purple-300';
      case 'legendary': return 'text-yellow-600 border-yellow-300';
      default: return 'text-gray-600 border-gray-300';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-50';
      case 'rare': return 'bg-blue-50';
      case 'epic': return 'bg-purple-50';
      case 'legendary': return 'bg-yellow-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Achievements & Leaderboard</h1>
          <p className="text-muted-foreground">Track your progress and compete with others</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Zap className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">8,750</p>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">Level 14</p>
                  <p className="text-xs text-muted-foreground">Current Level</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Flame className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-xs text-muted-foreground">Day Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Award className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Achievements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border-2 ${achievement.unlocked ? 'border-green-300 bg-green-50' : getRarityColor(achievement.rarity)} ${getRarityBg(achievement.rarity)}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${achievement.unlocked ? 'bg-green-100' : 'bg-muted'}`}>
                          <achievement.icon className={`h-6 w-6 ${achievement.unlocked ? 'text-green-600' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{achievement.title}</h3>
                            <Badge variant={achievement.unlocked ? 'default' : 'secondary'}>
                              {achievement.xp} XP
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          
                          {!achievement.unlocked && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{achievement.progress}/{achievement.maxProgress}</span>
                              </div>
                              <Progress 
                                value={(achievement.progress / achievement.maxProgress) * 100} 
                                className="h-2"
                              />
                            </div>
                          )}
                          
                          {achievement.unlocked && (
                            <Badge className="bg-green-100 text-green-800">
                              ✓ Unlocked
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Weekly Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center space-x-4 p-4 rounded-lg border ${
                        user.id === '4' ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          user.position === 1 ? 'bg-yellow-100 text-yellow-800' :
                          user.position === 2 ? 'bg-gray-100 text-gray-800' :
                          user.position === 3 ? 'bg-orange-100 text-orange-800' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {user.position <= 3 ? (
                            user.position === 1 ? <Crown className="h-4 w-4" /> :
                            user.position === 2 ? <Medal className="h-4 w-4" /> :
                            <Award className="h-4 w-4" />
                          ) : (
                            user.position
                          )}
                        </div>
                        
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">Level {user.level}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold">{user.xp.toLocaleString()} XP</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Flame className="h-3 w-3" />
                          {user.streak} day streak
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, index) => (
                <Card key={index} className="aspect-square flex items-center justify-center">
                  <CardContent className="pt-6 text-center">
                    <Medal className={`h-8 w-8 mx-auto mb-2 ${index < 4 ? 'text-primary' : 'text-muted-foreground'}`} />
                    <p className="text-xs font-medium">
                      {index < 4 ? 'Earned' : 'Locked'} Badge
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GamePage;