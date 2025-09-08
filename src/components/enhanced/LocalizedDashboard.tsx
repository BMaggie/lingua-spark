import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLocalization } from '@/hooks/useLocalization';
import { 
  BookOpen, 
  Trophy, 
  Flame, 
  Target, 
  TrendingUp, 
  Calendar,
  Star,
  Award,
  Users
} from 'lucide-react';

interface UserProgress {
  wordsLearned: number;
  streak: number;
  points: number;
  level: number;
}

interface Languages {
  spoken: string[];
  learning: string[];
  primarySpoken: string;
  primaryLearning: string;
}

interface LocalizedDashboardProps {
  progress: UserProgress;
  languages: Languages;
  onSectionChange: (section: string) => void;
  userName?: string;
}

const LocalizedDashboard = ({ 
  progress, 
  languages, 
  onSectionChange,
  userName = 'Student'
}: LocalizedDashboardProps) => {
  const { t, getGreeting } = useLocalization();

  const levelProgress = ((progress.points % 100) / 100) * 100;
  const dailyGoal = 50; // points
  const dailyProgress = Math.min((progress.points % 100) / dailyGoal * 100, 100);

  const stats = [
    {
      label: t('wordsLearned'),
      value: progress.wordsLearned,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: t('streak'),
      value: `${progress.streak}`,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: t('points'),
      value: progress.points,
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: t('level'),
      value: progress.level,
      icon: Trophy,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const quickActions = [
    {
      title: t('continueLesson'),
      description: `Learning ${languages.primaryLearning}`,
      icon: BookOpen,
      action: () => onSectionChange('lessons'),
      color: 'bg-primary text-primary-foreground'
    },
    {
      title: t('practice'),
      description: 'Review vocabulary',
      icon: Target,
      action: () => onSectionChange('vocabulary'),
      color: 'bg-secondary text-secondary-foreground'
    },
    {
      title: t('quiz'),
      description: 'Test your knowledge',
      icon: Award,
      action: () => onSectionChange('quiz'),
      color: 'bg-accent text-accent-foreground'
    }
  ];

  const getLanguageName = (code: string) => {
    const names: { [key: string]: string } = {
      'en': 'English',
      'es': 'Español', 
      'fr': 'Français',
      'de': 'Deutsch',
      'pt': 'Português',
      'zh': '中文',
      'ja': '日本語',
      'ko': '한국어',
      'it': 'Italiano',
      'ru': 'Русский',
      'ar': 'العربية'
    };
    return names[code] || code;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold gradient-text mb-2">
          {getGreeting()}, {userName}!
        </h1>
        <p className="text-muted-foreground">
          {t('welcome')} • Learning {languages.learning.map(getLanguageName).join(', ')}
        </p>
      </motion.div>

      {/* Language Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{t('todaysGoal')}</h2>
            <Badge variant="outline" className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {Math.round(dailyProgress)}%
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Daily Points Goal</span>
                <span>{Math.min(progress.points % 100, dailyGoal)}/{dailyGoal}</span>
              </div>
              <Progress value={dailyProgress} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Level Progress</span>
                <span>Level {progress.level}</span>
              </div>
              <Progress value={levelProgress} className="h-2" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="p-6 cursor-pointer hover:shadow-lg transition-all"
                onClick={action.action}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t('weeklyProgress')}
            </h2>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              This Week
            </Button>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, i) => {
              const isToday = i === 6;
              const hasActivity = i < 6 || progress.streak > 0;
              
              return (
                <div
                  key={i}
                  className={`h-12 rounded-lg border-2 flex items-center justify-center ${
                    hasActivity
                      ? isToday
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-green-100 border-green-300 text-green-700'
                      : 'bg-muted border-border'
                  }`}
                >
                  {hasActivity && <Flame className="h-4 w-4" />}
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Recent Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            {t('recentAchievements')}
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">First Words!</p>
                <p className="text-sm text-muted-foreground">Learned your first 10 words</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Getting Started</p>
                <p className="text-sm text-muted-foreground">Completed your first lesson</p>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => onSectionChange('achievements')}
          >
            View All Achievements
          </Button>
        </Card>
      </motion.div>
    </div>
  );
};

export default LocalizedDashboard;