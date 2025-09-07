import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { useUserProgress } from '@/hooks/useUserProgress';
import VocabularyCard from '@/components/VocabularyCard';
import QuizSection from '@/components/QuizSection';
import Leaderboard from '@/components/Leaderboard';
import { 
  BookOpen, 
  Brain, 
  Trophy, 
  Star, 
  Target, 
  Clock, 
  LogOut,
  Settings,
  User
} from 'lucide-react';

const DashboardPage = () => {
  const { user, signOut, userRole } = useAuth();
  const { userProfile, loading: userLoading } = useUserProgress();
  const navigate = useNavigate();
  const [selectedLanguages, setSelectedLanguages] = useState({ base: '', target: '' });
  const [currentSection, setCurrentSection] = useState('dashboard');

  useEffect(() => {
    if (userProfile?.learning_languages) {
      setSelectedLanguages({
        base: userProfile.learning_languages.base,
        target: userProfile.learning_languages.target
      });
    }
  }, [userProfile]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getLevelProgress = () => {
    const points = userProfile?.points || 0;
    const pointsInCurrentLevel = points % 100;
    return (pointsInCurrentLevel / 100) * 100;
  };

  const getMotivationalMessage = () => {
    const points = userProfile?.points || 0;
    if (points === 0) return "Welcome to your language learning journey! 🌟";
    if (points < 50) return "Great start! Keep up the momentum! 💪";
    if (points < 100) return "You're making excellent progress! 🚀";
    if (points < 200) return "Fantastic work! You're becoming fluent! ⭐";
    return "Amazing dedication! You're a language learning superstar! 🏆";
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">LinguaSpark</h1>
              </div>
              <Badge variant="secondary" className="ml-4">
                {userRole === 'admin' ? 'Admin' : 'Student'}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">{userProfile?.points || 0}</span>
              </div>
              <div className="text-sm text-gray-600">Level {userProfile?.current_level || 1}</div>
              
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <Button
              variant={currentSection === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setCurrentSection('dashboard')}
              className="flex items-center space-x-2"
            >
              <Target className="h-4 w-4" />
              <span>Dashboard</span>
            </Button>
            <Button
              variant={currentSection === 'vocabulary' ? 'default' : 'ghost'}
              onClick={() => setCurrentSection('vocabulary')}
              className="flex items-center space-x-2"
            >
              <BookOpen className="h-4 w-4" />
              <span>Vocabulary</span>
            </Button>
            <Button
              variant={currentSection === 'quiz' ? 'default' : 'ghost'}
              onClick={() => setCurrentSection('quiz')}
              className="flex items-center space-x-2"
            >
              <Brain className="h-4 w-4" />
              <span>Quiz</span>
            </Button>
            <Button
              variant={currentSection === 'leaderboard' ? 'default' : 'ghost'}
              onClick={() => setCurrentSection('leaderboard')}
              className="flex items-center space-x-2"
            >
              <Trophy className="h-4 w-4" />
              <span>Leaderboard</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentSection === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Message */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Welcome back, {user?.email?.split('@')[0]}!</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{getMotivationalMessage()}</p>
                
                {selectedLanguages.base && selectedLanguages.target && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>Learning {selectedLanguages.target}</span>
                    <span>•</span>
                    <span>From {selectedLanguages.base}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Words Learned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userProfile?.stages_completed?.vocabulary?.length || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Current Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userProfile?.streak_days || 0} days</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{userProfile?.points || 0}</div>
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
                    <span>Level {userProfile?.current_level || 1}</span>
                    <span>{userProfile?.points || 0} / {(userProfile?.current_level || 1) * 100} points</span>
                  </div>
                  <Progress value={getLevelProgress()} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentSection === 'vocabulary' && selectedLanguages.base && selectedLanguages.target && (
          <VocabularyCard languages={selectedLanguages} />
        )}

        {currentSection === 'quiz' && selectedLanguages.base && selectedLanguages.target && (
          <QuizSection languages={selectedLanguages} />
        )}

        {currentSection === 'leaderboard' && selectedLanguages.target && (
          <Leaderboard 
            targetLanguage={selectedLanguages.target}
            currentUserId={user?.id}
          />
        )}
      </main>
    </div>
  );
};

export default DashboardPage;