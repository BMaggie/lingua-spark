import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TargetLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageSelect: (language: string) => void;
  baseLanguage: string;
}

const TargetLanguageModal = ({ isOpen, onClose, onLanguageSelect, baseLanguage }: TargetLanguageModalProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  // Only local languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', difficulty: 'Easy', speakers: '1.5B+ speakers' },
    { code: 'ha', name: 'Hausa', flag: '🇳🇬', difficulty: 'Medium', speakers: '50M+ speakers' },
    { code: 'fu', name: 'Fulani', flag: '🇳🇬', difficulty: 'Medium', speakers: '20M+ speakers' },
    { code: 'ff', name: 'Fulfulde', flag: '🇳🇬', difficulty: 'Medium', speakers: '15M+ speakers' }
  ];
  

  // Filter out the base language
  const availableLanguages = languages.filter(lang => lang.name !== baseLanguage);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartLearning = () => {
    if (selectedLanguage) {
      onLanguageSelect(selectedLanguage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            What language do you want to learn?
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Choose the language you'd like to master. Your base language: <span className="font-semibold">{baseLanguage}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
          {availableLanguages.map((language) => (
            <div
              key={language.code}
              onClick={() => setSelectedLanguage(language.name)}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                ${selectedLanguage === language.name 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="text-2xl mb-2">{language.flag}</div>
              <h3 className="font-semibold text-sm">{language.name}</h3>
              <Badge 
                variant="secondary" 
                className={`text-xs mt-1 ${getDifficultyColor(language.difficulty)}`}
              >
                {language.difficulty}
              </Badge>
              <p className="text-xs text-gray-500 mt-1">{language.speakers}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={handleStartLearning}
            disabled={!selectedLanguage}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Start Learning!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TargetLanguageModal;