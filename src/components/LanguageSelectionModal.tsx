
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, ArrowRight, Star, Users, Crown } from 'lucide-react';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageSelect: (languages: { base: string; target: string }) => void;
  userRole: 'admin' | 'user';
}

const LanguageSelectionModal = ({ isOpen, onClose, onLanguageSelect, userRole }: LanguageSelectionModalProps) => {
  const [baseLanguage, setBaseLanguage] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', difficulty: 'Easy', speakers: '1.5B' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', difficulty: 'Easy', speakers: '500M' },
    { code: 'fr', name: 'French', flag: '🇫🇷', difficulty: 'Medium', speakers: '280M' },
    { code: 'de', name: 'German', flag: '🇩🇪', difficulty: 'Medium', speakers: '95M' },
    { code: 'it', name: 'Italian', flag: '🇮🇹', difficulty: 'Medium', speakers: '65M' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹', difficulty: 'Medium', speakers: '260M' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺', difficulty: 'Hard', speakers: '258M' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵', difficulty: 'Hard', speakers: '125M' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷', difficulty: 'Hard', speakers: '77M' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳', difficulty: 'Hard', speakers: '1.1B' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', difficulty: 'Hard', speakers: '422M' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳', difficulty: 'Medium', speakers: '600M' },
  ];

  // Admin gets access to more languages
  const adminLanguages = [
    ...languages,
    { code: 'ha', name: 'Hausa', flag: '🇳🇬', difficulty: 'Medium', speakers: '70M' },
    { code: 'yo', name: 'Yoruba', flag: '🇳🇬', difficulty: 'Medium', speakers: '45M' },
    { code: 'ig', name: 'Igbo', flag: '🇳🇬', difficulty: 'Medium', speakers: '24M' },
    { code: 'sw', name: 'Swahili', flag: '🇰🇪', difficulty: 'Easy', speakers: '16M' },
    { code: 'am', name: 'Amharic', flag: '🇪🇹', difficulty: 'Hard', speakers: '57M' },
  ];

  const availableLanguages = userRole === 'admin' ? adminLanguages : languages;

  const handleContinue = () => {
    if (baseLanguage && targetLanguage && baseLanguage !== targetLanguage) {
      const baseLang = availableLanguages.find(l => l.code === baseLanguage);
      const targetLang = availableLanguages.find(l => l.code === targetLanguage);
      
      onLanguageSelect({
        base: baseLang?.name || baseLanguage,
        target: targetLang?.name || targetLanguage
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const LanguageGrid = ({ title, selectedLanguage, onSelect, exclude }: {
    title: string;
    selectedLanguage: string;
    onSelect: (code: string) => void;
    exclude?: string;
  }) => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <Globe className="h-5 w-5 text-blue-600" />
        {title}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
        {availableLanguages
          .filter(lang => exclude ? lang.code !== exclude : true)
          .map((language) => (
          <Card 
            key={language.code}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedLanguage === language.code 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelect(language.code)}
          >
            <CardContent className="p-3">
              <div className="text-center">
                <div className="text-2xl mb-1">{language.flag}</div>
                <div className="font-medium text-sm text-gray-800">{language.name}</div>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(language.difficulty)}`}>
                    {language.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-500">
                  <Users className="h-3 w-3" />
                  <span>{language.speakers}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {userRole === 'admin' && <Crown className="h-6 w-6 text-yellow-500" />}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Choose Your Languages
              </span>
            </div>
            {userRole === 'admin' && (
              <div className="flex items-center justify-center gap-2 text-sm font-normal text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                <Star className="h-4 w-4" />
                Admin Access - Additional Languages Available
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <LanguageGrid 
            title="I speak (Base Language)"
            selectedLanguage={baseLanguage}
            onSelect={setBaseLanguage}
            exclude={targetLanguage}
          />

          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-gray-400" />
          </div>

          <LanguageGrid 
            title="I want to learn (Target Language)"
            selectedLanguage={targetLanguage}
            onSelect={setTargetLanguage}
            exclude={baseLanguage}
          />

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleContinue}
              disabled={!baseLanguage || !targetLanguage || baseLanguage === targetLanguage}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg"
            >
              Start Learning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {baseLanguage && targetLanguage && baseLanguage !== targetLanguage && (
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                Perfect! You'll be learning{' '}
                <span className="font-semibold">
                  {availableLanguages.find(l => l.code === targetLanguage)?.name}
                </span>{' '}
                from{' '}
                <span className="font-semibold">
                  {availableLanguages.find(l => l.code === baseLanguage)?.name}
                </span>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LanguageSelectionModal;
