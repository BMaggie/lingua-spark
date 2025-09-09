import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LandingPage from '@/components/LandingPage';
<<<<<<< Updated upstream

const Index = () => {
  const { user, isLoading, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect authenticated users to their appropriate dashboard
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
=======
import VocabularyCard from '@/components/VocabularyCard';
import QuizSection from '@/components/QuizSection';
import ProgressDashboard from '@/components/ProgressDashboard';
import ProfileDropdown from '@/components/ProfileDropdown';
import Leaderboard from '@/components/Leaderboard';
import BaseLanguageModal from '@/components/BaseLanguageModal';
import { BookOpen, Star } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useLanguagePreferences } from '@/hooks/useLanguagePreferences';

const AVAILABLE_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' }
];

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [currentSection, setCurrentSection] = useState('dashboard');
  const { userProfile, loading: userLoading } = useUserProgress();
  const { preferences, loading: langLoading, refreshPreferences } = useLanguagePreferences();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await refreshPreferences();
          if (preferences?.base && preferences?.target) {
            setCurrentView('app');
          }
        } else {
          setCurrentView('landing');
        }
>>>>>>> Stashed changes
      }
    }
  }, [isAuthenticated, user, userRole, isLoading, navigate]);

<<<<<<< Updated upstream
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
=======
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        refreshPreferences();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLanguageSelect = async (languages: { base: string; target: string }) => {
    const { error } = await supabase.from('user_preferences').upsert({
      user_id: user?.id,
      base_language: languages.base,
      target_language: languages.target
    });

    if (!error) {
      await refreshPreferences();
      setCurrentView('app');
      setCurrentSection('dashboard');
    }
  };

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
  };



  const handleBackToLanding = async () => {
    await supabase.auth.signOut();
    setCurrentView('landing');
    setSelectedLanguages({ base: '', target: '' });
    setUser(null);
    setSession(null);
  };

  // Show landing page if user is not authenticated
  if (!user || currentView === 'landing') {
    return <LandingPage onSignIn={async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await refreshPreferences();
        if (preferences?.base && preferences?.target) {
          setCurrentView('app');
        }
      }
    }} />;
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
                  <span className="font-semibold">{userProfile?.points || 0}</span>
                </div>
                <div className="text-sm text-gray-600">Level {userProfile?.current_level || 1}</div>
                        <ProfileDropdown 
          userProgress={{
            wordsLearned: userProfile?.stages_completed?.vocabulary?.length || 0,
            streak: userProfile?.streak_days || 0,
            points: userProfile?.points || 0,
            level: userProfile?.current_level || 1
          }}
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
          {currentSection === 'dashboard' && preferences && (
            <>
              <ProgressDashboard 
                progress={{
                  wordsLearned: userProfile?.stages_completed?.vocabulary?.length || 0,
                  streak: userProfile?.streak_days || 0,
                  points: userProfile?.points || 0,
                  level: userProfile?.current_level || 1
                }}
                languages={{
                  base: preferences.base,
                  target: preferences.target
                }}
                onSectionChange={handleSectionChange}
              />
              <div className="mt-8">
                <Leaderboard 
                  targetLanguage={preferences.target}
                  currentUserId={user?.id}
                />
              </div>
            </>
          )}
          
          {currentSection === 'vocabulary' && preferences && (
            <VocabularyCard 
              languages={{
                base: preferences.base,
                target: preferences.target
              }}
            />
          )}
          
          {currentSection === 'quiz' && preferences && (
            <QuizSection 
              languages={{
                base: preferences.base,
                target: preferences.target
              }}
            />
          )}
        </main>

        <Toaster />
>>>>>>> Stashed changes
      </div>
    );
  }

  // Show landing page for unauthenticated users
  if (!isAuthenticated) {
    return <LandingPage onLanguageSelect={() => {}} />;
  }

  // Show loading while redirecting authenticated users
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
    </div>
  );
};

export default Index;