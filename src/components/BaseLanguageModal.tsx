import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BaseLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageSelect: (language: string) => void;
}

const BaseLanguageModal = ({ isOpen, onClose, onLanguageSelect }: BaseLanguageModalProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸', speakers: '1.5B+ speakers' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', speakers: '500M+ speakers' },
    { code: 'fr', name: 'French', flag: '🇫🇷', speakers: '280M+ speakers' },
    { code: 'de', name: 'German', flag: '🇩🇪', speakers: '100M+ speakers' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹', speakers: '260M+ speakers' },
    { code: 'it', name: 'Italian', flag: '🇮🇹', speakers: '65M+ speakers' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳', speakers: '1.1B+ speakers' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵', speakers: '125M+ speakers' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷', speakers: '77M+ speakers' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦', speakers: '400M+ speakers' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳', speakers: '600M+ speakers' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺', speakers: '260M+ speakers' }
  ];

  const handleContinue = () => {
    if (selectedLanguage) {
      onLanguageSelect(selectedLanguage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            What language do you speak?
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Select your native language or the language you're most comfortable with
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
          {languages.map((language) => (
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
              <p className="text-xs text-gray-500 mt-1">{language.speakers}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={handleContinue}
            disabled={!selectedLanguage}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BaseLanguageModal;