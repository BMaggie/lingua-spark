import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LandingPage from '@/components/LandingPage';
import VocabularyCard from '@/components/VocabularyCard';
import QuizSection from '@/components/QuizSection';
import ProgressDashboard from '@/components/ProgressDashboard';
import { LogOut } from 'lucide-react';
import RoleGuard from '@/components/RoleGuard';
import AnimatedLoader from '@/components/AnimatedLoader';
import { BookOpen, Star, Settings } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, isLoading, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [selectedLanguages, setSelectedLanguages] = useState({ base: '', target: '' });
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [userProgress, setUserProgress] = useState({
    wordsLearned: 0,
    streak: 0,
    points: 0,
    level: 1
  });

  // Load user progress when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserProgress();
    }
  }, [isAuthenticated, user]);

  const loadUserProgress = async () => {
    if (!user) return;

    try {
      // Fetch or create user stats
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (stats) {
        setUserProgress({
          wordsLearned: stats.words_learned || 0,
          streak: stats.streak || 0,
          points: stats.points || 0,
          level: stats.level || 1
        });

        // If user has languages set, show app view
        if (stats.base_language && stats.target_language) {
          setSelectedLanguages({ 
            base: stats.base_language, 
            target: stats.target_language 
          });
          setCurrentView('app');
        }
      } else {
        // Create initial stats record
        await supabase
          .from('user_stats')
          .insert({
            user_id: user.id,
            words_learned: 0,
            streak: 0,
            points: 0,
            level: 1
          });
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

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
    if (section === 'admin' && user?.role === 'admin') {
      navigate('/admin');
      return;
    }
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
    await signOut();
    setCurrentView('landing');
    setSelectedLanguages({ base: '', target: '' });
    navigate('/');
  };

  // Show loading animation while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <AnimatedLoader text="Loading LinguaSpark..." />
      </div>
    );
  }

  // If user is not authenticated, show landing page
  if (!isAuthenticated || currentView === 'landing') {
    return <LandingPage onLanguageSelect={handleLanguageSelect} />;
  }

  // If user is authenticated and has selected languages, show the app
  if (selectedLanguages.base && selectedLanguages.target) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.header 
          className="bg-white shadow-sm border-b"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <motion.button 
                  onClick={handleBackToLanding}
                  className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  LinguaSpark
                </motion.button>
                <span className="text-sm text-gray-500">
                  {selectedLanguages.base} → {selectedLanguages.target}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Star className="h-4 w-4 text-yellow-500 animate-pulse" />
                  <span className="font-semibold">{userProgress.points}</span>
                </motion.div>
                <div className="text-sm text-gray-600">Level {userProgress.level}</div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToLanding}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </motion.header>

        <motion.nav 
          className="bg-white border-b"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="container mx-auto px-4">
            <div className="flex space-x-8">
              {[
                { key: 'dashboard', label: 'Dashboard' },
                { key: 'vocabulary', label: 'Vocabulary' },
                { key: 'quiz', label: 'Quiz' },
              ].map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant={currentSection === item.key ? 'default' : 'ghost'}
                    onClick={() => handleSectionChange(item.key)}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 transition-all duration-300"
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}
              
              {/* Admin button with role guard */}
              <RoleGuard allowedRoles={['admin']}>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="ghost"
                    onClick={() => handleSectionChange('admin')}
                    className="rounded-none border-b-2 border-transparent transition-all duration-300"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </motion.div>
              </RoleGuard>
            </div>
          </div>
        </motion.nav>

        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
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
            </motion.div>
          </AnimatePresence>
        </main>

        <Toaster />
      </motion.div>
    );
  }

  // Fallback - should show landing page for language selection
  return <LandingPage onLanguageSelect={handleLanguageSelect} />;
};

export default Index;