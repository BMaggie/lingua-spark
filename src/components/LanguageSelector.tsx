
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LanguageSelectorProps {
  onLanguageSelect: (languages: { base: string; target: string }) => void;
}

const LanguageSelector = ({ onLanguageSelect }: LanguageSelectorProps) => {
  const [baseLanguage, setBaseLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('');

  const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'fu', name: 'Fulani', flag: '🇳🇬' },
  { code: 'ff', name: 'Fulfulde', flag: '🇳🇬' }
  ];

  const handleStartLearning = () => {
    if (baseLanguage && targetLanguage && baseLanguage !== targetLanguage) {
      const baseLang = languages.find(l => l.code === baseLanguage);
      const targetLang = languages.find(l => l.code === targetLanguage);
      
      onLanguageSelect({
        base: baseLang?.name || '',
        target: targetLang?.name || ''
      });
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Choose Your Learning Path</CardTitle>
        <p className="text-center text-gray-600 mt-2">
          Select your native language and the language you want to learn
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">I speak:</label>
            <Select value={baseLanguage} onValueChange={setBaseLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your native language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center space-x-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">I want to learn:</label>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select target language" />
              </SelectTrigger>
              <SelectContent>
                {languages
                  .filter(lang => lang.code !== baseLanguage)
                  .map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      <div className="flex items-center space-x-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={handleStartLearning}
          disabled={!baseLanguage || !targetLanguage || baseLanguage === targetLanguage}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transform transition-all duration-200 hover:scale-105"
        >
          Start Learning Journey 🚀
        </Button>
      </CardContent>
    </Card>
  );
};

export default LanguageSelector;
