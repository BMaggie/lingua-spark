import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLocalization } from '@/hooks/useLocalization';
import LanguageSelectionFlow from './LanguageSelectionFlow';
import AnimatedLoader from '@/components/AnimatedLoader';

interface LanguagePreferences {
  spoken_languages: string[];
  learning_languages: string[];
  primary_spoken_language: string;
  primary_learning_language: string;
}

interface LanguageMiddlewareProps {
  children: React.ReactNode;
}

const LanguageMiddleware = ({ children }: LanguageMiddlewareProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { setLanguage } = useLocalization();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLanguageFlow, setShowLanguageFlow] = useState(false);
  const [isCheckingLanguages, setIsCheckingLanguages] = useState(true);
  const [languagePreferences, setLanguagePreferences] = useState<LanguagePreferences | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      checkUserLanguagePreferences();
    } else {
      setIsCheckingLanguages(false);
    }
  }, [isAuthenticated, user]);

  const checkUserLanguagePreferences = async () => {
    if (!user) return;

    try {
      const { data: preferences } = await supabase
        .from('user_language_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (preferences) {
        // User has language preferences
        setLanguagePreferences(preferences);
        
        // Set app language to primary spoken language
        if (preferences.primary_spoken_language) {
          setLanguage(preferences.primary_spoken_language);
        }
        
        // Check if user has both spoken and learning languages
        if (
          preferences.spoken_languages?.length > 0 && 
          preferences.learning_languages?.length > 0
        ) {
          setIsCheckingLanguages(false);
        } else {
          // User has incomplete language setup
          setShowLanguageFlow(true);
          setIsCheckingLanguages(false);
        }
      } else {
        // New user - show language selection flow
        setShowLanguageFlow(true);
        setIsCheckingLanguages(false);
      }
    } catch (error) {
      console.error('Error checking language preferences:', error);
      // If error, assume new user and show language flow
      setShowLanguageFlow(true);
      setIsCheckingLanguages(false);
    }
  };

  const handleLanguageSelection = async (languages: { spoken: string[]; learning: string[] }) => {
    if (!user) return;

    try {
      const primarySpoken = languages.spoken[0];
      const primaryLearning = languages.learning[0];

      await supabase
        .from('user_language_preferences')
        .upsert({
          user_id: user.id,
          spoken_languages: languages.spoken,
          learning_languages: languages.learning,
          primary_spoken_language: primarySpoken,
          primary_learning_language: primaryLearning
        });

      // Set app language to primary spoken language
      setLanguage(primarySpoken);
      
      // Update local state
      setLanguagePreferences({
        spoken_languages: languages.spoken,
        learning_languages: languages.learning,
        primary_spoken_language: primarySpoken,
        primary_learning_language: primaryLearning
      });

      // Hide language flow
      setShowLanguageFlow(false);

      // Navigate to dashboard or main app
      navigate('/');
    } catch (error) {
      console.error('Error saving language preferences:', error);
    }
  };

  // Do not block public routes with loader
  const isPublicRoute = location.pathname === '/' || location.pathname.startsWith('/auth');

  // Show loading only when needed and not on public routes
  if (!isPublicRoute && (isLoading || (isAuthenticated && isCheckingLanguages))) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <AnimatedLoader text="Setting up your experience..." />
      </div>
    );
  }

  // Show language selection flow if authenticated user needs language setup
  if (isAuthenticated && showLanguageFlow) {
    return (
      <LanguageSelectionFlow 
        onComplete={handleLanguageSelection}
      />
    );
  }

  // Render children only if:
  // 1. User is not authenticated (show auth flow), OR
  // 2. User is authenticated and has complete language preferences
  return <>{children}</>;
};

export default LanguageMiddleware;