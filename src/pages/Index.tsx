
import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LandingPage from '@/components/LandingPage';
import VocabularyCard from '@/components/VocabularyCard';
import QuizSection from '@/components/QuizSection';
import ProgressDashboard from '@/components/ProgressDashboard';
import ProfileDropdown from '@/components/ProfileDropdown';
import AdminDashboard from '@/components/AdminDashboard';
import { BookOpen, Star, Settings } from 'lucide-react';
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
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile to get role
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          setUserRole(profile?.role || 'user');
          
          // Fetch or create user stats
          const { data: stats } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (stats) {
            setUserProgress({
              wordsLearned: stats.words_learned || 0,
              streak: stats.streak || 0,
              points: stats.points || 0,
              level: stats.level || 1
            });
          } else {
            // Create initial stats record
            await supabase
              .from('user_stats')
              .insert({
                user_id: session.user.id,
                words_learned: 0,
                streak: 0,
                points: 0,
                level: 1
              });
          }
          
          if (currentView === 'landing') {
            // User is authenticated, but we still need language selection
            // The language selection modal will be handled by LandingPage component
          }
        } else if (!session?.user) {
          // User logged out, return to landing
          setCurrentView('landing');
          setSelectedLanguages({ base: '', target: '' });
          setUserRole('user');
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

  const handleLanguageSelect = async (languages: { base: string; target: string }) => {
    setSelectedLanguages(languages);
    setCurrentView('app');
    setCurrentSection('dashboard');
    
    // Update user stats with selected languages
    if (user) {
      await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          base_language: languages.base,
          target_language: languages.target,
          words_learned: userProgress.wordsLearned,
          streak: userProgress.streak,
          points: userProgress.points,
          level: userProgress.level
        });
    }
  };

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };

  const updateProgress = async (points: number, wordsLearned: number = 0) => {
    const newProgress = {
      ...userProgress,
      points: userProgress.points + points,
      wordsLearned: userProgress.wordsLearned + wordsLearned,
      level: Math.floor((userProgress.points + points) / 100) + 1
    };
    
    setUserProgress(newProgress);
    
    // Update in database
    if (user) {
      await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          ...newProgress,
          base_language: selectedLanguages.base,
          target_language: selectedLanguages.target
        });
    }
  };

  const handleBackToLanding = async () => {
    await supabase.auth.signOut();
    setCurrentView('landing');
    setSelectedLanguages({ base: '', target: '' });
    setUser(null);
    setSession(null);
    setUserRole('user');
  };

  // If user is not authenticated, show landing page
  if (!user || currentView === 'landing') {
    return <LandingPage onLanguageSelect={handleLanguageSelect} />;
  }

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
              {userRole === 'admin' && (
                <Button 
                  variant={currentSection === 'admin' ? 'default' : 'ghost'}
                  onClick={() => handleSectionChange('admin')}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}
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
          
          {currentSection === 'admin' && userRole === 'admin' && (
            <AdminDashboard />
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
