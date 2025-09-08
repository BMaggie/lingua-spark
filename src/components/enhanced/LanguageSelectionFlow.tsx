import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Globe, Users } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  flag: string;
  speakers: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  isPopular?: boolean;
}

interface LanguageSelectionFlowProps {
  onComplete: (languages: { spoken: string[]; learning: string[] }) => void;
  onClose?: () => void;
}

const SPOKEN_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', speakers: '1.5B speakers' },
  { code: 'es', name: 'Español', flag: '🇪🇸', speakers: '500M speakers' },
  { code: 'zh', name: '中文', flag: '🇨🇳', speakers: '1.1B speakers' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', speakers: '600M speakers' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', speakers: '400M speakers' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', speakers: '260M speakers' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', speakers: '280M speakers' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', speakers: '100M speakers' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', speakers: '125M speakers' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', speakers: '260M speakers' }
];

const LEARNING_LANGUAGES: Language[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸', speakers: '500M speakers', difficulty: 'Beginner', isPopular: true },
  { code: 'fr', name: 'Français', flag: '🇫🇷', speakers: '280M speakers', difficulty: 'Beginner', isPopular: true },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', speakers: '100M speakers', difficulty: 'Intermediate' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', speakers: '65M speakers', difficulty: 'Beginner' },
  { code: 'pt', name: 'Português', flag: '🇧🇷', speakers: '260M speakers', difficulty: 'Beginner', isPopular: true },
  { code: 'ja', name: '日本語', flag: '🇯🇵', speakers: '125M speakers', difficulty: 'Advanced' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', speakers: '77M speakers', difficulty: 'Advanced' },
  { code: 'zh', name: '中文', flag: '🇨🇳', speakers: '1.1B speakers', difficulty: 'Advanced' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', speakers: '260M speakers', difficulty: 'Intermediate' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', speakers: '400M speakers', difficulty: 'Advanced' }
];

const LanguageSelectionFlow = ({ onComplete, onClose }: LanguageSelectionFlowProps) => {
  const [step, setStep] = useState<'spoken' | 'learning'>('spoken');
  const [selectedSpokenLanguages, setSelectedSpokenLanguages] = useState<string[]>([]);
  const [selectedLearningLanguages, setSelectedLearningLanguages] = useState<string[]>([]);

  const handleSpokenLanguageToggle = (languageCode: string) => {
    setSelectedSpokenLanguages(prev => 
      prev.includes(languageCode) 
        ? prev.filter(code => code !== languageCode)
        : [...prev, languageCode]
    );
  };

  const handleLearningLanguageToggle = (languageCode: string) => {
    setSelectedLearningLanguages(prev => 
      prev.includes(languageCode) 
        ? prev.filter(code => code !== languageCode)
        : [...prev, languageCode]
    );
  };

  const handleContinueToLearning = () => {
    if (selectedSpokenLanguages.length > 0) {
      setStep('learning');
    }
  };

  const handleComplete = () => {
    if (selectedSpokenLanguages.length > 0 && selectedLearningLanguages.length > 0) {
      onComplete({
        spoken: selectedSpokenLanguages,
        learning: selectedLearningLanguages
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const LanguageCard = ({ 
    language, 
    isSelected, 
    onToggle, 
    showDifficulty = false 
  }: { 
    language: Language; 
    isSelected: boolean; 
    onToggle: (code: string) => void;
    showDifficulty?: boolean;
  }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg relative ${
          isSelected 
            ? 'ring-2 ring-primary border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        }`}
        onClick={() => onToggle(language.code)}
      >
        {isSelected && (
          <motion.div 
            className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Check className="h-3 w-3" />
          </motion.div>
        )}
        
        {language.isPopular && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 text-xs"
          >
            Popular
          </Badge>
        )}
        
        <div className="flex flex-col items-center space-y-3">
          <div className="text-4xl">{language.flag}</div>
          <div className="text-center">
            <h3 className="font-semibold text-foreground">{language.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
              <Users className="h-3 w-3" />
              {language.speakers}
            </p>
          </div>
          
          {showDifficulty && language.difficulty && (
            <Badge 
              className={`text-xs ${getDifficultyColor(language.difficulty)}`}
              variant="outline"
            >
              {language.difficulty}
            </Badge>
          )}
        </div>
      </Card>
    </motion.div>
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
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                {step === 'spoken' ? 'Select Your Language(s)' : 'Choose Languages to Learn'}
              </h2>
              <p className="text-muted-foreground mt-1">
                {step === 'spoken' 
                  ? 'Which languages do you speak? This will be your app interface language.'
                  : 'Select the languages you want to learn. You can choose multiple!'
                }
              </p>
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            )}
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div className={`h-2 w-16 rounded-full ${step === 'spoken' ? 'bg-primary' : 'bg-muted'}`} />
            <ArrowRight className={`h-4 w-4 ${step === 'learning' ? 'text-primary' : 'text-muted-foreground'}`} />
            <div className={`h-2 w-16 rounded-full ${step === 'learning' ? 'bg-primary' : 'bg-muted'}`} />
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {step === 'spoken' && (
              <motion.div
                key="spoken"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {SPOKEN_LANGUAGES.map((language, index) => (
                    <motion.div
                      key={language.code}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <LanguageCard
                        language={language}
                        isSelected={selectedSpokenLanguages.includes(language.code)}
                        onToggle={handleSpokenLanguageToggle}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'learning' && (
              <motion.div
                key="learning"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {LEARNING_LANGUAGES
                    .filter(lang => !selectedSpokenLanguages.includes(lang.code))
                    .map((language, index) => (
                      <motion.div
                        key={language.code}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <LanguageCard
                          language={language}
                          isSelected={selectedLearningLanguages.includes(language.code)}
                          onToggle={handleLearningLanguageToggle}
                          showDifficulty={true}
                        />
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {step === 'spoken' 
                ? `${selectedSpokenLanguages.length} language(s) selected`
                : `${selectedLearningLanguages.length} language(s) to learn`
              }
            </div>
            
            <div className="flex gap-2">
              {step === 'learning' && (
                <Button 
                  variant="outline" 
                  onClick={() => setStep('spoken')}
                >
                  Back
                </Button>
              )}
              
              {step === 'spoken' && (
                <Button 
                  onClick={handleContinueToLearning}
                  disabled={selectedSpokenLanguages.length === 0}
                  className="flex items-center gap-2"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              
              {step === 'learning' && (
                <Button 
                  onClick={handleComplete}
                  disabled={selectedLearningLanguages.length === 0}
                  className="flex items-center gap-2"
                >
                  Start Learning
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LanguageSelectionFlow;