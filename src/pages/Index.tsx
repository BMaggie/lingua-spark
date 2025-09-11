import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LandingPage from '@/components/LandingPage';
import LocalizedDashboard from '@/components/enhanced/LocalizedDashboard';
import VocabularyCard from '@/components/VocabularyCard';
import QuizSection from '@/components/QuizSection';
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [userProgress, setUserProgress] = useState({
    wordsLearned: 0,
    streak: 0,
    points: 0,
    level: 1
  });
  const [userLanguages, setUserLanguages] = useState({
    spoken: [] as string[],
    learning: [] as string[],
    primarySpoken: '',
    primaryLearning: ''
  });
  const [hasLanguagePreferences, setHasLanguagePreferences] = useState(false);

  // Load user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load language preferences
      const { data: languagePrefs } = await supabase
        .from('user_language_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (languagePrefs) {
        setUserLanguages({
          spoken: languagePrefs.spoken_languages || [],
          learning: languagePrefs.learning_languages || [],
          primarySpoken: languagePrefs.primary_spoken_language || 'en',
          primaryLearning: languagePrefs.primary_learning_language || 'es'
        });
        setHasLanguagePreferences((languagePrefs.spoken_languages?.length || 0) > 0 && (languagePrefs.learning_languages?.length || 0) > 0);
      }

      // Load user stats
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
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSectionChange = (section: string) => {
    if (section === 'admin' && user?.role === 'admin') {
      navigate('/admin');
    } else if (section === 'lessons') {
      navigate('/course');
    } else if (section === 'achievements') {
      navigate('/achievements');
    } else if (section === 'community') {
      navigate('/community');
    } else {
      setCurrentSection(section);
    }
  };

  // Show landing page for non-authenticated users
  if (!isAuthenticated) {
    return <LandingPage onLanguageSelect={() => {}} />;
  }

  // Show localized dashboard for authenticated users with language preferences
  if (hasLanguagePreferences) {
    return (
      <motion.div 
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LocalizedDashboard 
          progress={userProgress}
          languages={userLanguages}
          onSectionChange={handleSectionChange}
          userName={user?.profile?.full_name || 'Student'}
        />
        
        <main className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentSection === 'vocabulary' && (
                <VocabularyCard 
                  languages={{ base: userLanguages.primarySpoken, target: userLanguages.primaryLearning }}
                  onProgress={() => {}}
                />
              )}
              
              {currentSection === 'quiz' && (
                <QuizSection 
                  languages={{ base: userLanguages.primarySpoken, target: userLanguages.primaryLearning }}
                  onProgress={() => {}}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    );
  }

  // Fallback - LanguageMiddleware should handle language selection flow
  return <LandingPage onLanguageSelect={() => {}} />;
};

export default Index;