import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Globe, Users } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';

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
  { code: 'ha', name: 'Hausa', flag: '🇳🇬', speakers: '100M speakers' },
  { code: 'fu', name: 'Fulani', flag: '🇳🇬', speakers: '100M speakers' },
  { code: 'ff', name: 'Fulfulde', flag: '🇳🇬', speakers: '100M speakers' }
];

const LEARNING_LANGUAGES: Language[] = [
  // { code: 'en', name: 'English', flag: '🇺🇸', speakers: '1.5B+ speakers', difficulty: 'Beginner', isPopular: true },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬', speakers: '100M speakers', difficulty: 'Beginner', isPopular: true },
  { code: 'fu', name: 'Fulani', flag: '🇳🇬', speakers: '100M speakers', difficulty: 'Beginner', isPopular: true },
  { code: 'ff', name: 'Fulfulde', flag: '🇳🇬', speakers: '100M speakers', difficulty: 'Beginner', isPopular: true }
];

const LanguageSelectionFlow = ({ onComplete, onClose }: LanguageSelectionFlowProps) => {
  const [step, setStep] = useState<'spoken' | 'learning'>('spoken');
  const [selectedSpokenLanguages, setSelectedSpokenLanguages] = useState<string[]>([]);
  const [selectedLearningLanguages, setSelectedLearningLanguages] = useState<string[]>([]);
  
  const focusTrapRef = useFocusTrap(true);

  useEffect(() => {
    const handleEscape = () => {
      if (onClose) {
        onClose();
      }
    };

    const container = focusTrapRef.current;
    if (container) {
      container.addEventListener('modal-escape', handleEscape);
      return () => container.removeEventListener('modal-escape', handleEscape);
    }
  }, [onClose]);

  const handleSpokenLanguageToggle = (languageCode: string) => {
    // Only allow one spoken language for simplicity
    setSelectedSpokenLanguages([languageCode]);
  };

  const handleLearningLanguageToggle = (languageCode: string) => {
    // Only allow one learning language for simplicity
    setSelectedLearningLanguages([languageCode]);
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
        className={`p-3 cursor-pointer transition-all duration-300 hover:shadow-md relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          isSelected 
            ? 'ring-2 ring-primary border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        }`}
        onClick={() => onToggle(language.code)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle(language.code);
          }
        }}
        tabIndex={0}
        role="button"
        aria-pressed={isSelected}
        aria-label={`Select ${language.name} (${language.speakers})`}
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
        
        <div className="flex flex-col items-center space-y-2">
          <div className="text-3xl">{language.flag}</div>
          <div className="text-center">
            <h3 className="font-semibold text-foreground text-sm">{language.name}</h3>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
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
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
    >
      <motion.div 
        ref={focusTrapRef}
        className="bg-card rounded-xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden border"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-4 sm:p-6 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 
                id="language-modal-title"
                className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2"
              >
                <Globe className="h-5 w-5 text-primary" />
                {step === 'spoken' ? 'Select Your Language' : 'Choose Language to Learn'}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {step === 'spoken' 
                  ? 'Which language do you speak? This will be your app interface.'
                  : 'Select one language you want to learn first.'
                }
              </p>
            </div>
            {onClose && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                aria-label="Close language selection"
                className="shrink-0"
              >
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

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh]">
          <AnimatePresence mode="wait">
            {step === 'spoken' && (
              <motion.div
                key="spoken"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        <div className="p-4 sm:p-6 border-t bg-muted/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              {step === 'spoken' 
                ? `${selectedSpokenLanguages.length} language selected`
                : `${selectedLearningLanguages.length} language to learn`
              }
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              {step === 'learning' && (
                <Button 
                  variant="outline" 
                  onClick={() => setStep('spoken')}
                  className="flex-1 sm:flex-none"
                >
                  Back
                </Button>
              )}
              
              {step === 'spoken' && (
                <Button 
                  onClick={handleContinueToLearning}
                  disabled={selectedSpokenLanguages.length === 0}
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 text-base font-medium flex-1 sm:flex-none"
                  aria-describedby="continue-help"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              
              {step === 'learning' && (
                <Button 
                  onClick={handleComplete}
                  disabled={selectedLearningLanguages.length === 0}
                  className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 text-base font-medium flex-1 sm:flex-none"
                  aria-describedby="complete-help"
                >
                  Start Learning
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Hidden helper text for screen readers */}
          <div id="continue-help" className="sr-only">
            Select a language you speak to continue to language learning selection
          </div>
          <div id="complete-help" className="sr-only">
            Select a language to learn and start your learning journey
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LanguageSelectionFlow;