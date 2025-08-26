import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Trophy, 
  Star, 
  Flame, 
  Zap, 
  Medal,
  Crown,
  Award,
  Target,
  TrendingUp,
  BookOpen,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  showDetails?: boolean;
}

export const XPBar = ({ currentXP, nextLevelXP, level, showDetails = true }: XPBarProps) => {
  const progress = (currentXP / nextLevelXP) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-r from-gamification-xp/10 to-gamification-xp/5 p-4 rounded-lg border border-gamification-xp/20"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gamification-xp/10 rounded-full">
            <Zap className="h-4 w-4 text-gamification-xp" />
          </div>
          <span className="font-semibold">Level {level}</span>
        </div>
        {showDetails && (
          <span className="text-sm text-muted-foreground">
            {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
          </span>
        )}
      </div>
      <Progress value={progress} className="h-3" />
      {showDetails && (
        <p className="text-xs text-muted-foreground mt-2">
          {(nextLevelXP - currentXP).toLocaleString()} XP to next level
        </p>
      )}
    </motion.div>
  );
};

interface StreakCounterProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const StreakCounter = ({ streak, size = 'md', animated = true }: StreakCounterProps) => {
  const sizeClasses = {
    sm: 'text-lg p-2',
    md: 'text-2xl p-3',
    lg: 'text-3xl p-4'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5', 
    lg: 'h-6 w-6'
  };

  return (
    <motion.div
      initial={animated ? { scale: 0 } : undefined}
      animate={animated ? { scale: 1 } : undefined}
      transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
      className={`inline-flex items-center space-x-2 bg-gradient-to-r from-gamification-streak/10 to-gamification-streak/5 rounded-full border border-gamification-streak/20 ${sizeClasses[size]}`}
    >
      <motion.div
        animate={animated && streak > 0 ? { 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        } : undefined}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3 
        }}
      >
        <Flame className={`${iconSizes[size]} text-gamification-streak`} />
      </motion.div>
      <span className={`font-bold text-gamification-streak`}>
        {streak}
      </span>
      <span className="text-sm text-muted-foreground">
        {streak === 1 ? 'day' : 'days'}
      </span>
    </motion.div>
  );
};

interface BadgeDisplayProps {
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: 'bronze' | 'silver' | 'gold' | 'legendary';
    unlocked: boolean;
    progress?: number;
    maxProgress?: number;
  }>;
  showProgress?: boolean;
}

export const BadgeDisplay = ({ badges, showProgress = false }: BadgeDisplayProps) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'bronze': return 'gamification-bronze';
      case 'silver': return 'gamification-silver';
      case 'gold': return 'gamification-gold';
      case 'legendary': return 'accent';
      default: return 'muted';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'bronze': return Medal;
      case 'silver': return Award;
      case 'gold': return Trophy;
      case 'legendary': return Crown;
      default: return Star;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {badges.map((badge, index) => {
        const IconComponent = getRarityIcon(badge.rarity);
        const colorClass = getRarityColor(badge.rarity);
        
        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`hover-lift transition-all duration-300 ${
              badge.unlocked 
                ? `border-${colorClass}/30 bg-${colorClass}/5` 
                : 'opacity-60 grayscale'
            }`}>
              <CardContent className="p-4 text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${colorClass}/10 mb-3`}
                >
                  {badge.icon ? (
                    <span className="text-2xl">{badge.icon}</span>
                  ) : (
                    <IconComponent className={`h-8 w-8 text-${colorClass}`} />
                  )}
                </motion.div>
                <h3 className="font-semibold mb-1">{badge.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{badge.description}</p>
                
                <Badge 
                  className={`mb-2 bg-${colorClass} text-white`}
                  variant="secondary"
                >
                  {badge.rarity.toUpperCase()}
                </Badge>
                
                {showProgress && badge.progress !== undefined && badge.maxProgress && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{badge.progress}/{badge.maxProgress}</span>
                    </div>
                    <Progress value={(badge.progress / badge.maxProgress) * 100} className="h-2" />
                  </div>
                )}
                
                {badge.unlocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="mt-2"
                  >
                    <Badge variant="outline" className="text-success border-success">
                      ✓ Unlocked
                    </Badge>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

interface LeaderboardProps {
  users: Array<{
    id: string;
    name: string;
    avatar: string;
    xp: number;
    level: number;
    position: number;
  }>;
  currentUserId: string;
}

export const Leaderboard = ({ users, currentUserId }: LeaderboardProps) => {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="h-5 w-5 text-gamification-gold" />;
      case 2: return <Medal className="h-5 w-5 text-gamification-silver" />;
      case 3: return <Award className="h-5 w-5 text-gamification-bronze" />;
      default: return <span className="text-muted-foreground font-bold">#{position}</span>;
    }
  };

  const getPositionBg = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-gamification-gold/10 to-gamification-gold/5 border-gamification-gold/20';
      case 2: return 'bg-gradient-to-r from-gamification-silver/10 to-gamification-silver/5 border-gamification-silver/20';
      case 3: return 'bg-gradient-to-r from-gamification-bronze/10 to-gamification-bronze/5 border-gamification-bronze/20';
      default: return 'bg-background border-border';
    }
  };

  return (
    <Card className="hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-primary" />
          <span>Leaderboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex items-center space-x-4 p-3 rounded-lg border transition-all duration-300 ${
              getPositionBg(user.position)
            } ${user.id === currentUserId ? 'ring-2 ring-primary/50' : ''}`}
          >
            <div className="flex items-center justify-center w-8">
              {getPositionIcon(user.position)}
            </div>
            
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <p className={`font-semibold ${user.id === currentUserId ? 'text-primary' : ''}`}>
                {user.name}
                {user.id === currentUserId && <span className="text-xs ml-2 text-primary">(You)</span>}
              </p>
              <p className="text-sm text-muted-foreground">Level {user.level}</p>
            </div>
            
            <div className="text-right">
              <p className="font-bold text-gamification-xp">{user.xp.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">XP</p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

interface ProgressStatsProps {
  stats: {
    lessonsCompleted: number;
    studyStreak: number;
    totalStudyTime: number; // in minutes
    averageAccuracy: number; // percentage
    weeklyGoal: number; // in minutes
    weeklyProgress: number; // in minutes
  };
}

export const ProgressStats = ({ stats }: ProgressStatsProps) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const weeklyProgressPercent = (stats.weeklyProgress / stats.weeklyGoal) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="hover-lift bg-gradient-to-br from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-success/10 rounded-full">
              <BookOpen className="h-6 w-6 text-success" />
            </div>
            <div className="text-2xl font-bold text-success">{stats.lessonsCompleted}</div>
            <p className="text-sm text-muted-foreground">Lessons Completed</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="hover-lift bg-gradient-to-br from-gamification-streak/10 to-gamification-streak/5 border-gamification-streak/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-gamification-streak/10 rounded-full">
              <Flame className="h-6 w-6 text-gamification-streak" />
            </div>
            <div className="text-2xl font-bold text-gamification-streak">{stats.studyStreak}</div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="hover-lift bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">{formatTime(stats.totalStudyTime)}</div>
            <p className="text-sm text-muted-foreground">Total Study Time</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="hover-lift bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-accent/10 rounded-full">
              <Target className="h-6 w-6 text-accent" />
            </div>
            <div className="text-2xl font-bold text-accent">{stats.averageAccuracy}%</div>
            <p className="text-sm text-muted-foreground">Average Accuracy</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Progress - spans full width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="md:col-span-2 lg:col-span-4"
      >
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Weekly Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Study Goal Progress</span>
              <span className="text-sm text-muted-foreground">
                {formatTime(stats.weeklyProgress)} / {formatTime(stats.weeklyGoal)}
              </span>
            </div>
            <Progress value={weeklyProgressPercent} className="h-3 mb-2" />
            <p className="text-xs text-muted-foreground">
              {weeklyProgressPercent >= 100 
                ? "🎉 Goal achieved! Great work!" 
                : `${Math.round(100 - weeklyProgressPercent)}% remaining to reach your weekly goal`
              }
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default {
  XPBar,
  StreakCounter,
  BadgeDisplay,
  Leaderboard,
  ProgressStats
};