import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LandingPage from '@/components/LandingPage';
import VocabularyCard from '@/components/VocabularyCard';
import QuizSection from '@/components/QuizSection';
import ProgressDashboard from '@/components/ProgressDashboard';
import ProfileDropdown from '@/components/ProfileDropdown';
import { BookOpen, Star } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && currentView === 'landing') {
          // User is authenticated, but we still need language selection
          // The language selection modal will be handled by LandingPage component
        } else if (!session?.user) {
          // User logged out, return to landing
          setCurrentView('landing');
          setSelectedLanguages({ base: '', target: '' });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [currentView]);

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

  const handleBackToLanding = async () => {
    await supabase.auth.signOut();
    setCurrentView('landing');
    setSelectedLanguages({ base: '', target: '' });
    setUser(null);
    setSession(null);
  };

  // If user is not authenticated, show landing page
  if (!user || currentView === 'landing') {
    return <LandingPage onLanguageSelect={handleLanguageSelect} />;
  }

  // If user is authenticated but hasn't selected languages, this will be handled by LandingPage
  // If user is authenticated and has selected languages, show the app
  if (selectedLanguages.base && selectedLanguages.target) {
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
                <ProfileDropdown 
                  userProgress={userProgress}
                  languages={selectedLanguages}
                  onBackToLanding={handleBackToLanding}
                />
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
  }

  // Fallback - should show landing page for language selection
  return <LandingPage onLanguageSelect={handleLanguageSelect} />;
};

export default Index;
