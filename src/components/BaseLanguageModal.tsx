import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLanguagePreferences } from '@/hooks/useLanguagePreferences';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  // Nigerian languages
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
  { code: 'ff', name: 'Fulfulde', flag: '🇳🇬' },
  { code: 'ti', name: 'Tiv', flag: '🇳🇬' },
  { code: 'kr', name: 'Kanuri', flag: '🇳🇬' },
  { code: 'ib', name: 'Ibibio', flag: '🇳🇬' },
  { code: 'ee', name: 'Edo', flag: '🇳🇬' },
  { code: 'urh', name: 'Urhobo', flag: '🇳🇬' }
];

interface BaseLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageSelect?: (language: string) => void;
  onLanguagesSet?: () => void;
}

export default function BaseLanguageModal({ isOpen, onClose, onLanguageSelect, onLanguagesSet }: BaseLanguageModalProps) {
  const [baseLanguage, setBaseLanguage] = useState("");
  const [spokenLanguages, setSpokenLanguages] = useState<string[]>([]);
  const [targetLanguage, setTargetLanguage] = useState("");
  const { updatePreferences } = useLanguagePreferences();

  const handleSpokenLanguageSelect = (langCode: string) => {
    setSpokenLanguages(prev => {
      if (prev.includes(langCode)) {
        return prev.filter(code => code !== langCode);
      }
      return [...prev, langCode];
    });
  };

  const handleContinue = async () => {
    if (baseLanguage && targetLanguage) {
      if (onLanguagesSet) {
        const success = await updatePreferences({
          base: baseLanguage,
          target: targetLanguage,
          spoken: spokenLanguages
        });

        if (success) {
          onLanguagesSet();
          onClose();
        }
      } else if (onLanguageSelect) {
        // Legacy mode for single language selection
        onLanguageSelect(baseLanguage);
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Language Selection
          </DialogTitle>
          <DialogDescription className="text-center">
            Let's personalize your learning experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Native Language Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">What's your native language?</label>
            <Select value={baseLanguage} onValueChange={setBaseLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select your native language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="mr-2">{lang.flag}</span>{lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Other Languages You Speak */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Other languages you speak (optional)</label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <Badge
                  key={lang.code}
                  variant={spokenLanguages.includes(lang.code) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleSpokenLanguageSelect(lang.code)}
                >
                  {lang.flag} {lang.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Target Language Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Which language do you want to learn?</label>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select a language to learn" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES
                  .filter(lang => lang.code !== baseLanguage)
                  .map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <span className="mr-2">{lang.flag}</span>{lang.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button 
            onClick={handleContinue} 
            disabled={!baseLanguage || !targetLanguage}
            className="px-6 py-2"
          >
            Start Learning
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
