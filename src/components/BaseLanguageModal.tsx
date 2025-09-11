import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLanguagePreferences } from '@/hooks/useLanguagePreferences';

interface BaseLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguagesSet: () => void;
  languages: { code: string; name: string; flag: string }[];
}

export default function BaseLanguageModal({ isOpen, onClose, onLanguagesSet, languages }: BaseLanguageModalProps) {
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
      const success = await updatePreferences({
        base: baseLanguage,
        target: targetLanguage,
        spoken: spokenLanguages
      });

      if (success) {
        onLanguagesSet();
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
                {languages.map((lang) => (
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
              {languages.map((lang) => (
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
                {languages
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
