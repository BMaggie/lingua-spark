
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, Clock, User } from 'lucide-react';

interface ProgressDashboardProps {
  progress: {
    wordsLearned: number;
    streak: number;
    points: number;
    level: number;
  };
  languages: { base: string; target: string };
  onSectionChange: (section: string) => void;
}

const ProgressDashboard = ({ progress, languages, onSectionChange }: ProgressDashboardProps) => {
  const getLevelProgress = () => {
    const pointsInCurrentLevel = progress.points % 100;
    return (pointsInCurrentLevel / 100) * 100;
  };

  const getMotivationalMessage = () => {
    if (progress.points === 0) return "Welcome to your language learning journey! 🌟";
    if (progress.points < 50) return "Great start! Keep up the momentum! 💪";
    if (progress.points < 100) return "You're making excellent progress! 🚀";
    if (progress.points < 200) return "Fantastic work! You're becoming fluent! ⭐";
    return "Amazing dedication! You're a language learning superstar! 🏆";
  };

  const achievements = [
    { name: "First Steps", description: "Learn your first word", unlocked: progress.wordsLearned >= 1, icon: "🌱" },
    { name: "Quick Learner", description: "Learn 10 words", unlocked: progress.wordsLearned >= 10, icon: "⚡" },
    { name: "Point Collector", description: "Earn 100 points", unlocked: progress.points >= 100, icon: "💎" },
    { name: "Dedicated", description: "Maintain a 3-day streak", unlocked: progress.streak >= 3, icon: "🔥" },
    { name: "Level Up", description: "Reach level 2", unlocked: progress.level >= 2, icon: "🆙" },
    { name: "Vocabulary Builder", description: "Learn 25 words", unlocked: progress.wordsLearned >= 25, icon: "📚" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back! 👋
        </h2>
        <p className="text-gray-600 text-lg">
          {getMotivationalMessage()}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="mx-auto bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-600">{progress.wordsLearned}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Words Learned</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="mx-auto bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-yellow-600">{progress.points}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Total Points</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="mx-auto bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">{progress.streak}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Day Streak</p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="mx-auto bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-purple-600">{progress.level}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Current Level</p>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Level Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level {progress.level}</span>
              <span>{progress.points % 100}/100 XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getLevelProgress()}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {100 - (progress.points % 100)} more points to reach Level {progress.level + 1}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Learning</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              onClick={() => onSectionChange('vocabulary')}
              className="h-20 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <div className="text-center">
                <BookOpen className="h-6 w-6 mx-auto mb-1" />
                <div className="font-semibold">Practice Vocabulary</div>
                <div className="text-xs opacity-90">Learn new words</div>
              </div>
            </Button>
            
            <Button 
              onClick={() => onSectionChange('quiz')}
              className="h-20 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <div className="text-center">
                <Star className="h-6 w-6 mx-auto mb-1" />
                <div className="font-semibold">Take Quiz</div>
                <div className="text-xs opacity-90">Test your knowledge</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                  achievement.unlocked 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200 opacity-60'
                }`}
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className={`font-semibold ${achievement.unlocked ? 'text-green-800' : 'text-gray-600'}`}>
                    {achievement.name}
                  </div>
                  <div className={`text-sm ${achievement.unlocked ? 'text-green-600' : 'text-gray-500'}`}>
                    {achievement.description}
                  </div>
                </div>
                {achievement.unlocked && (
                  <div className="text-green-600">
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;
