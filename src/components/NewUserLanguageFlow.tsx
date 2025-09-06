import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import BaseLanguageModal from './BaseLanguageModal';
import TargetLanguageModal from './TargetLanguageModal';
import { supabase } from '@/integrations/supabase/client';

interface NewUserLanguageFlowProps {
  onComplete: (languages: { base: string; target: string }) => void;
}

const NewUserLanguageFlow = ({ onComplete }: NewUserLanguageFlowProps) => {
  const { user } = useAuth();
  const [showBaseLanguageModal, setShowBaseLanguageModal] = useState(false);
  const [showTargetLanguageModal, setShowTargetLanguageModal] = useState(false);
  const [selectedBaseLanguage, setSelectedBaseLanguage] = useState<string>('');
  const [shouldShowFlow, setShouldShowFlow] = useState(false);

  useEffect(() => {
    const checkIfNewUser = async () => {
      if (!user) return;

      try {
        // Check if user already has language preferences
        const { data: stats } = await supabase
          .from('user_stats')
          .select('base_language, target_language')
          .eq('user_id', user.id)
          .single();

        // If no languages set, show the flow
        if (!stats || !stats.base_language || !stats.target_language) {
          setShouldShowFlow(true);
          setShowBaseLanguageModal(true);
        }
      } catch (error) {
        console.error('Error checking user languages:', error);
        // If error (likely no record exists), show the flow
        setShouldShowFlow(true);
        setShowBaseLanguageModal(true);
      }
    };

    if (user) {
      checkIfNewUser();
    }
  }, [user]);

  const handleBaseLanguageSelect = (language: string) => {
    setSelectedBaseLanguage(language);
    setShowBaseLanguageModal(false);
    setShowTargetLanguageModal(true);
  };

  const handleTargetLanguageSelect = async (language: string) => {
    setShowTargetLanguageModal(false);
    setShouldShowFlow(false);
    
    const languages = { base: selectedBaseLanguage, target: language };
    
    // Save languages to database
    if (user) {
      try {
        await supabase
          .from('user_stats')
          .upsert({
            user_id: user.id,
            base_language: selectedBaseLanguage,
            target_language: language,
            words_learned: 0,
            streak: 0,
            points: 0,
            level: 1
          });
      } catch (error) {
        console.error('Error saving user languages:', error);
      }
    }
    
    onComplete(languages);
  };

  if (!shouldShowFlow) {
    return null;
  }

  return (
    <>
      <BaseLanguageModal
        isOpen={showBaseLanguageModal}
        onClose={() => {
          setShowBaseLanguageModal(false);
          setShouldShowFlow(false);
        }}
        onLanguageSelect={handleBaseLanguageSelect}
      />

      <TargetLanguageModal
        isOpen={showTargetLanguageModal}
        onClose={() => {
          setShowTargetLanguageModal(false);
          setShouldShowFlow(false);
        }}
        onLanguageSelect={handleTargetLanguageSelect}
        baseLanguage={selectedBaseLanguage}
      />
    </>
  );
};

export default NewUserLanguageFlow;