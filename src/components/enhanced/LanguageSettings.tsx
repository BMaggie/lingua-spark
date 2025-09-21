import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useLocalization } from '@/hooks/useLocalization';
import { supabase } from '@/integrations/supabase/client';
import { Settings, Globe, Plus, X, Save } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const LANGUAGES: Language[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'fu', name: 'Fulani', flag: '🇳🇬' },
  { code: 'ff', name: 'Fulfulde', flag: '🇳🇬' }
];

interface LanguageSettingsProps {
  onClose?: () => void;
}

const LanguageSettings = ({ onClose }: LanguageSettingsProps) => {
  const { user } = useAuth();
  const { t, setLanguage, currentLanguage } = useLocalization();
  const [spokenLanguages, setSpokenLanguages] = useState<string[]>([]);
  const [learningLanguages, setLearningLanguages] = useState<string[]>([]);
  const [primarySpoken, setPrimarySpoken] = useState('');
  const [primaryLearning, setPrimaryLearning] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadUserLanguages();
  }, [user]);

  const loadUserLanguages = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_language_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setSpokenLanguages(data.spoken_languages || []);
        setLearningLanguages(data.learning_languages || []);
        setPrimarySpoken(data.primary_spoken_language || '');
        setPrimaryLearning(data.primary_learning_language || '');
      }
    } catch (error) {
      console.error('Error loading user languages:', error);
    }
  };

  const getLanguageName = (code: string) => {
    return LANGUAGES.find(lang => lang.code === code)?.name || code;
  };

  const getLanguageFlag = (code: string) => {
    return LANGUAGES.find(lang => lang.code === code)?.flag || '🏳️';
  };

  const handleSpokenLanguageToggle = (languageCode: string) => {
    setSpokenLanguages(prev => {
      const newLanguages = prev.includes(languageCode) 
        ? prev.filter(code => code !== languageCode)
        : [...prev, languageCode];
      
      // If removing primary spoken language, reset it
      if (!newLanguages.includes(primarySpoken)) {
        setPrimarySpoken(newLanguages[0] || '');
      }
      
      setHasChanges(true);
      return newLanguages;
    });
  };

  const handleLearningLanguageToggle = (languageCode: string) => {
    setLearningLanguages(prev => {
      const newLanguages = prev.includes(languageCode) 
        ? prev.filter(code => code !== languageCode)
        : [...prev, languageCode];
      
      // If removing primary learning language, reset it
      if (!newLanguages.includes(primaryLearning)) {
        setPrimaryLearning(newLanguages[0] || '');
      }
      
      setHasChanges(true);
      return newLanguages;
    });
  };

  const handlePrimarySpokenChange = (languageCode: string) => {
    setPrimarySpoken(languageCode);
    setLanguage(languageCode); // Update app language immediately
    setHasChanges(true);
  };

  const handlePrimaryLearningChange = (languageCode: string) => {
    setPrimaryLearning(languageCode);
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!user) return;

    if (spokenLanguages.length === 0 || learningLanguages.length === 0) {
      toast({
        title: "Incomplete Selection",
        description: "Please select at least one spoken language and one learning language.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      await supabase
        .from('user_language_preferences')
        .upsert({
          user_id: user.id,
          spoken_languages: spokenLanguages,
          learning_languages: learningLanguages,
          primary_spoken_language: primarySpoken,
          primary_learning_language: primaryLearning
        });

      setHasChanges(false);
      
      toast({
        title: "Settings Updated",
        description: "Your language preferences have been saved successfully."
      });

      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving language preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save language preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const LanguageCard = ({ 
    language, 
    isSelected, 
    isPrimary, 
    onToggle, 
    onSetPrimary 
  }: { 
    language: Language; 
    isSelected: boolean; 
    isPrimary: boolean;
    onToggle: (code: string) => void;
    onSetPrimary?: (code: string) => void;
  }) => (
    <div className={`p-3 border rounded-lg cursor-pointer transition-all ${
      isSelected 
        ? 'border-primary bg-primary/5' 
        : 'border-border hover:border-primary/50'
    }`}>
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 flex-1"
          onClick={() => onToggle(language.code)}
        >
          <span className="text-lg">{language.flag}</span>
          <span className="font-medium">{language.name}</span>
        </div>
        
        {isSelected && (
          <div className="flex items-center space-x-2">
            {isPrimary && (
              <Badge variant="default" className="text-xs">Primary</Badge>
            )}
            {!isPrimary && onSetPrimary && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={() => onSetPrimary(language.code)}
              >
                Set Primary
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive"
              onClick={() => onToggle(language.code)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
              Language Settings
            </h2>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Spoken Languages Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Spoken Languages (App Interface)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select the languages you speak. The primary language will be used for the app interface.
            </p>
            
            <div className="space-y-2 mb-4">
              {spokenLanguages.map(langCode => {
                const language = LANGUAGES.find(l => l.code === langCode);
                if (!language) return null;
                
                return (
                  <LanguageCard
                    key={langCode}
                    language={language}
                    isSelected={true}
                    isPrimary={langCode === primarySpoken}
                    onToggle={handleSpokenLanguageToggle}
                    onSetPrimary={handlePrimarySpokenChange}
                  />
                );
              })}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {LANGUAGES
                .filter(lang => !spokenLanguages.includes(lang.code))
                .map(language => (
                  <Button
                    key={language.code}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    onClick={() => handleSpokenLanguageToggle(language.code)}
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    {language.flag} {language.name}
                  </Button>
                ))}
            </div>
          </div>

          {/* Learning Languages Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-500" />
              Learning Languages
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select the languages you want to learn. The primary language will be your main focus.
            </p>
            
            <div className="space-y-2 mb-4">
              {learningLanguages.map(langCode => {
                const language = LANGUAGES.find(l => l.code === langCode);
                if (!language) return null;
                
                return (
                  <LanguageCard
                    key={langCode}
                    language={language}
                    isSelected={true}
                    isPrimary={langCode === primaryLearning}
                    onToggle={handleLearningLanguageToggle}
                    onSetPrimary={handlePrimaryLearningChange}
                  />
                );
              })}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {LANGUAGES
                .filter(lang => 
                  !learningLanguages.includes(lang.code) && 
                  !spokenLanguages.includes(lang.code)
                )
                .map(language => (
                  <Button
                    key={language.code}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                    onClick={() => handleLearningLanguageToggle(language.code)}
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    {language.flag} {language.name}
                  </Button>
                ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {hasChanges && "You have unsaved changes"}
            </div>
            
            <div className="flex gap-2">
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              )}
              
              <Button 
                onClick={handleSave}
                disabled={isLoading || !hasChanges}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LanguageSettings;