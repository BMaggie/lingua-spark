
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Headphones, Check, Mic } from 'lucide-react';

interface VocabularyCardProps {
  languages: { base: string; target: string };
  onProgress: (points: number, wordsLearned: number) => void;
}

const VocabularyCard = ({ languages, onProgress }: VocabularyCardProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState<number[]>([]);
  const { toast } = useToast();

  // Sample vocabulary data - in a real app, this would come from an API
  const vocabularyData = [
    { word: 'Hello', translation: 'Hola', example: 'Hello, how are you?', category: 'Greetings' },
    { word: 'Thank you', translation: 'Gracias', example: 'Thank you for your help', category: 'Greetings' },
    { word: 'Water', translation: 'Agua', example: 'I need some water', category: 'Basic Needs' },
    { word: 'Food', translation: 'Comida', example: 'The food is delicious', category: 'Basic Needs' },
    { word: 'House', translation: 'Casa', example: 'This is my house', category: 'Places' },
    { word: 'Friend', translation: 'Amigo', example: 'He is my best friend', category: 'People' },
    { word: 'Book', translation: 'Libro', example: 'I am reading a book', category: 'Objects' },
    { word: 'Beautiful', translation: 'Hermoso', example: 'What a beautiful day!', category: 'Adjectives' },
  ];

  const currentCard = vocabularyData[currentCardIndex];

  const playAudio = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'Spanish' ? 'es-ES' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleKnowWord = () => {
    if (!knownWords.includes(currentCardIndex)) {
      setKnownWords([...knownWords, currentCardIndex]);
      onProgress(10, 1);
      toast({
        title: "Great job! 🎉",
        description: "You earned 10 points for learning a new word!",
      });
    }
    nextCard();
  };

  const handleDontKnowWord = () => {
    toast({
      title: "Keep practicing! 💪",
      description: "Review this word and try again later.",
    });
    nextCard();
  };

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % vocabularyData.length);
  };

  const resetCards = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setKnownWords([]);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Vocabulary Practice</h2>
        <p className="text-gray-600">
          Card {currentCardIndex + 1} of {vocabularyData.length} | 
          Known: {knownWords.length} words
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentCardIndex + 1) / vocabularyData.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="perspective-1000">
        <Card 
          className={`h-80 w-full cursor-pointer transition-all duration-700 transform-gpu preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          } hover:shadow-xl`}
          onClick={handleCardFlip}
        >
          {/* Front of card */}
          <CardContent className={`absolute inset-0 backface-hidden flex flex-col justify-center items-center p-8 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}>
            <div className="text-center space-y-4">
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                {currentCard.category}
              </div>
              <div className="text-4xl font-bold text-gray-800">
                {currentCard.word}
              </div>
              <div className="text-gray-600 italic">
                "{currentCard.example}"
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(currentCard.word, languages.base);
                }}
                className="mt-4"
              >
                <Headphones className="h-4 w-4 mr-2" />
                Listen
              </Button>
            </div>
          </CardContent>

          {/* Back of card */}
          <CardContent className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 ${
            !isFlipped ? 'rotate-y-180' : ''
          }`}>
            <div className="text-center space-y-4">
              <div className="text-sm text-gray-500 uppercase tracking-wide">
                Translation in {languages.target}
              </div>
              <div className="text-4xl font-bold text-blue-600">
                {currentCard.translation}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(currentCard.translation, languages.target);
                }}
                className="mt-4"
              >
                <Headphones className="h-4 w-4 mr-2" />
                Listen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-sm text-gray-500 mb-4">
        Click the card to flip it and see the translation
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={handleDontKnowWord}
          variant="outline"
          className="flex-1 max-w-xs"
        >
          Still Learning
        </Button>
        <Button
          onClick={handleKnowWord}
          className="flex-1 max-w-xs bg-green-600 hover:bg-green-700"
        >
          <Check className="h-4 w-4 mr-2" />
          I Know This
        </Button>
      </div>

      {knownWords.length === vocabularyData.length && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="text-center p-6">
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Congratulations! 🎉
            </h3>
            <p className="text-green-700 mb-4">
              You've completed all vocabulary cards!
            </p>
            <Button onClick={resetCards} className="bg-green-600 hover:bg-green-700">
              Practice Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VocabularyCard;
