
import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LandingPage from '@/components/LandingPage';
import VocabularyCard from '@/components/VocabularyCard';
import QuizSection from '@/components/QuizSection';
import ProgressDashboard from '@/components/ProgressDashboard';
import { BookOpen, Star, User, Clock } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [selectedLanguages, setSelectedLanguages] = useState({ base: '', target: '' });
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [userProgress, setUserProgress] = useState({
    wordsLearned: 0,
    streak: 0,
    points: 0,
    level: 1
  });

  const handleLanguageSelect = (languages: { base: string; target: string }) => {
    setSelectedLanguages(languages);
    setCurrentView('app');
    setCurrentSection('dashboard');
  };

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };

  const updateProgress = (points: number, wordsLearned: number = 0) => {
    setUserProgress(prev => ({
      ...prev,
      points: prev.points + points,
      wordsLearned: prev.wordsLearned + wordsLearned,
      level: Math.floor((prev.points + points) / 100) + 1
    }));
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setSelectedLanguages({ base: '', target: '' });
  };

  if (currentView === 'landing') {
    return <LandingPage onLanguageSelect={handleLanguageSelect} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBackToLanding}
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                LinguaSpark
              </button>
              <span className="text-sm text-gray-500">
                {selectedLanguages.base} → {selectedLanguages.target}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-semibold">{userProgress.points}</span>
              </div>
              <div className="text-sm text-gray-600">Level {userProgress.level}</div>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <Button 
              variant={currentSection === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => handleSectionChange('dashboard')}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
            >
              Dashboard
            </Button>
            <Button 
              variant={currentSection === 'vocabulary' ? 'default' : 'ghost'}
              onClick={() => handleSectionChange('vocabulary')}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
            >
              Vocabulary
            </Button>
            <Button 
              variant={currentSection === 'quiz' ? 'default' : 'ghost'}
              onClick={() => handleSectionChange('quiz')}
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
            >
              Quiz
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {currentSection === 'dashboard' && (
          <ProgressDashboard 
            progress={userProgress}
            languages={selectedLanguages}
            onSectionChange={handleSectionChange}
          />
        )}
        
        {currentSection === 'vocabulary' && (
          <VocabularyCard 
            languages={selectedLanguages}
            onProgress={updateProgress}
          />
        )}
        
        {currentSection === 'quiz' && (
          <QuizSection 
            languages={selectedLanguages}
            onProgress={updateProgress}
          />
        )}
      </main>

      <Toaster />
    </div>
  );
};

export default Index;
