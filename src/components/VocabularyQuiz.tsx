import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Flame, Check, X, Headphones } from 'lucide-react';
// import { supabase } from "@/integrations/supabase/client";
// import type { QuizStage } from "@/integrations/supabase/types";
import { useUserProgress } from "@/hooks/useUserProgress";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface QuizSectionProps {
  languages: { base: string; target: string };
}

const VocabularyQuiz = ({ languages }: QuizSectionProps) => {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  // Hardcoded vocabulary data
  const [loading, setLoading] = useState(false);
  const [stages] = useState([
    {
      id: 1,
      words: [
        { word: 'Hello', translation: 'Sannu', options: ['Sannu', 'Barka', 'Ina', 'Lafiya'] },
        { word: 'Water', translation: 'Ruwa', options: ['Ruwa', 'Gida', 'Abinci', 'Daki'] },
        { word: 'Food', translation: 'Abinci', options: ['Abinci', 'Ruwa', 'Gida', 'Lafiya'] }
      ]
    },
    {
      id: 2,
      words: [
        { word: 'House', translation: 'Gida', options: ['Gida', 'Daki', 'Abinci', 'Ruwa'] },
        { word: 'Room', translation: 'Daki', options: ['Daki', 'Gida', 'Abinci', 'Lafiya'] },
        { word: 'Thank you', translation: 'Nagode', options: ['Nagode', 'Sannu', 'Barka', 'Ruwa'] }
      ]
    },
    {
      id: 3,
      words: [
        { word: 'Goodbye', translation: 'Sai anjima', options: ['Sai anjima', 'Nagode', 'Sannu', 'Barka'] },
        { word: 'Please', translation: 'Don Allah', options: ['Don Allah', 'Nagode', 'Barka', 'Daki'] },
        { word: 'Morning', translation: 'Ina kwana', options: ['Ina kwana', 'Barka da yamma', 'Nagode', 'Lafiya'] }
      ]
    },
    {
      id: 4,
      words: [
        { word: 'Father', translation: 'Uba', options: ['Uba', 'Mahaifiya', 'Yaro', 'Gida'] },
        { word: 'Mother', translation: 'Uwa', options: ['Uwa', 'Uba', 'Yarinya', 'Abinci'] },
        { word: 'Child', translation: 'Yaro', options: ['Yaro', 'Uba', 'Uwa', 'Daki'] }
      ]
    },
    {
      id: 5,
      words: [
        { word: 'Book', translation: 'Littafi', options: ['Littafi', 'Gida', 'Daki', 'Ruwa'] },
        { word: 'Pen', translation: 'Alkalam', options: ['Alkalam', 'Littafi', 'Abinci', 'Nagode'] },
        { word: 'School', translation: 'Makaranta', options: ['Makaranta', 'Gida', 'Daki', 'Lafiya'] }
      ]
    },
    {
      id: 6,
      words: [
        { word: 'Car', translation: 'Mota', options: ['Mota', 'Keke', 'Gida', 'Daki'] },
        { word: 'Bicycle', translation: 'Keke', options: ['Keke', 'Mota', 'Abinci', 'Nagode'] },
        { word: 'Market', translation: 'Kasuwa', options: ['Kasuwa', 'Gida', 'Daki', 'Lafiya'] }
      ]
    },
    {
      id: 7,
      words: [
        { word: 'Rice', translation: 'Shinkafa', options: ['Shinkafa', 'Abinci', 'Ruwa', 'Gida'] },
        { word: 'Meat', translation: 'Nama', options: ['Nama', 'Shinkafa', 'Abinci', 'Nagode'] },
        { word: 'Soup', translation: 'Miyan', options: ['Miyan', 'Nama', 'Shinkafa', 'Lafiya'] }
      ]
    },
    {
      id: 8,
      words: [
        { word: 'Dog', translation: 'Kare', options: ['Kare', 'Mage', 'Akuya', 'Shanu'] },
        { word: 'Cat', translation: 'Mage', options: ['Mage', 'Kare', 'Akuya', 'Shanu'] },
        { word: 'Goat', translation: 'Akuya', options: ['Akuya', 'Kare', 'Mage', 'Shanu'] }
      ]
    },
    {
      id: 9,
      words: [
        { word: 'Sun', translation: 'Rana', options: ['Rana', 'Ruwa', 'Dare', 'Gida'] },
        { word: 'Rain', translation: 'Ruwa', options: ['Ruwa', 'Rana', 'Dare', 'Gida'] },
        { word: 'Night', translation: 'Dare', options: ['Dare', 'Rana', 'Ruwa', 'Gida'] }
      ]
    },
    {
      id: 10,
      words: [
        { word: 'One', translation: 'Daya', options: ['Daya', 'Biyu', 'Uku', 'Hudu'] },
        { word: 'Two', translation: 'Biyu', options: ['Biyu', 'Daya', 'Uku', 'Hudu'] },
        { word: 'Three', translation: 'Uku', options: ['Uku', 'Daya', 'Biyu', 'Hudu'] }
      ]
    },
    {
      id: 11,
      words: [
        { word: 'Four', translation: 'Hudu', options: ['Hudu', 'Biyar', 'Shida', 'Bakwai'] },
        { word: 'Five', translation: 'Biyar', options: ['Biyar', 'Hudu', 'Shida', 'Bakwai'] },
        { word: 'Six', translation: 'Shida', options: ['Shida', 'Biyar', 'Hudu', 'Bakwai'] }
      ]
    },
    {
      id: 12,
      words: [
        { word: 'Seven', translation: 'Bakwai', options: ['Bakwai', 'Takwas', 'Tara', 'Goma'] },
        { word: 'Eight', translation: 'Takwas', options: ['Takwas', 'Bakwai', 'Tara', 'Goma'] },
        { word: 'Nine', translation: 'Tara', options: ['Tara', 'Bakwai', 'Takwas', 'Goma'] }
      ]
    },
    {
      id: 13,
      words: [
        { word: 'Ten', translation: 'Goma', options: ['Goma', 'Tara', 'Takwas', 'Bakwai'] },
        { word: 'Friend', translation: 'Aboki', options: ['Aboki', 'Abokiya', 'Yaro', 'Yarinya'] },
        { word: 'Girl', translation: 'Yarinya', options: ['Yarinya', 'Yaro', 'Aboki', 'Abokiya'] }
      ]
    },
    {
      id: 14,
      words: [
        { word: 'Boy', translation: 'Yaro', options: ['Yaro', 'Yarinya', 'Aboki', 'Abokiya'] },
        { word: 'Teacher', translation: 'Malam', options: ['Malam', 'Dalibi', 'Aboki', 'Yaro'] },
        { word: 'Student', translation: 'Dalibi', options: ['Dalibi', 'Malam', 'Aboki', 'Yaro'] }
      ]
    },
    {
      id: 15,
      words: [
        { word: 'Market', translation: 'Kasuwanci', options: ['Kasuwanci', 'Kasuwa', 'Gida', 'Daki'] },
        { word: 'Shop', translation: 'Shago', options: ['Shago', 'Kasuwanci', 'Gida', 'Daki'] },
        { word: 'Money', translation: 'Kudi', options: ['Kudi', 'Shago', 'Kasuwanci', 'Gida'] }
      ]
    },
    {
      id: 16,
      words: [
        { word: 'Chair', translation: 'Kujera', options: ['Kujera', 'Tebur', 'Gida', 'Daki'] },
        { word: 'Table', translation: 'Tebur', options: ['Tebur', 'Kujera', 'Gida', 'Daki'] },
        { word: 'Window', translation: 'Tagar', options: ['Tagar', 'Kujera', 'Tebur', 'Daki'] }
      ]
    },
    {
      id: 17,
      words: [
        { word: 'Door', translation: 'Kofa', options: ['Kofa', 'Tagar', 'Kujera', 'Tebur'] },
        { word: 'Wall', translation: 'Bango', options: ['Bango', 'Kofa', 'Tagar', 'Kujera'] },
        { word: 'Floor', translation: 'Kasa', options: ['Kasa', 'Bango', 'Kofa', 'Tagar'] }
      ]
    },
    {
      id: 18,
      words: [
        { word: 'Light', translation: 'Hasken', options: ['Hasken', 'Kasa', 'Bango', 'Kofa'] },
        { word: 'Dark', translation: 'Duhu', options: ['Duhu', 'Hasken', 'Kasa', 'Bango'] },
        { word: 'Fire', translation: 'Wuta', options: ['Wuta', 'Duhu', 'Hasken', 'Kasa'] }
      ]
    },
    {
      id: 19,
      words: [
        { word: 'Mountain', translation: 'Dutse', options: ['Dutse', 'Kogi', 'Gona', 'Daji'] },
        { word: 'River', translation: 'Kogi', options: ['Kogi', 'Dutse', 'Gona', 'Daji'] },
        { word: 'Farm', translation: 'Gona', options: ['Gona', 'Kogi', 'Dutse', 'Daji'] }
      ]
    },
    {
      id: 20,
      words: [
        { word: 'Forest', translation: 'Daji', options: ['Daji', 'Gona', 'Kogi', 'Dutse'] },
        { word: 'Road', translation: 'Hanya', options: ['Hanya', 'Daji', 'Gona', 'Kogi'] },
        { word: 'City', translation: 'Birni', options: ['Birni', 'Hanya', 'Daji', 'Gona'] }
      ]
    }
  ]);
  const [currentStage, setCurrentStage] = useState(stages[0]);
  const [stageProgress, setStageProgress] = useState<Record<number, { score: number; total: number }>>({});
  const [animation, setAnimation] = useState<'correct' | 'wrong' | null>(null);
  
  const { userProfile, updateProgress } = useUserProgress();
  const { toast } = useToast();

  // useEffect(() => {
  //   fetchQuizData();
  // }, [languages]);

  const handleAnswer = async (answer: string) => {
    if (showResult || !currentStage?.words) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === currentStage.words[currentQuiz]?.translation;
    
    setAnimation(isCorrect ? 'correct' : 'wrong');
    
    if (isCorrect) {
      setScore(s => s + 10);
      setStreakCount(s => s + 1);
    } else {
      setStreakCount(0);
    }

    setTimeout(() => {
      setAnimation(null);
      setSelectedAnswer(null);
      if (currentQuiz < (currentStage.words?.length || 0) - 1) {
        setCurrentQuiz(q => q + 1);
      } else {
        setShowResult(true);
        updateProgress({
          language: languages.target,
          score: score + (isCorrect ? 10 : 0),
          completed_stages: [...(userProfile?.completed_stages || []), currentStage.id]
        });
      }
    }, 1000);
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            Vocabulary Quiz
          </CardTitle>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">{score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-semibold">{streakCount}</span>
            </div>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${(currentQuiz / (currentStage?.words?.length || 1)) * 100}%` }}
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {showResult ? (
          <div className="text-center space-y-4">

            <h3 className="text-2xl font-bold">Quiz Complete!</h3>
            <p className="text-gray-600">Final Score: {score}</p>
            <Button
              onClick={() => {
                setShowResult(false);
                setCurrentQuiz(0);
                setScore(0);
                setStreakCount(0);
              }}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuiz}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">
                  {currentStage?.words?.[currentQuiz]?.word}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Add text-to-speech functionality here
                  }}
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  Listen
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {currentStage?.words?.[currentQuiz]?.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === option ? (
                      option === currentStage.words?.[currentQuiz]?.translation
                        ? "success"
                        : "destructive"
                    ) : "outline"}
                    className={cn(
                      "h-20 text-lg relative overflow-hidden",
                      animation === 'correct' && selectedAnswer === option && "border-green-500 bg-green-50",
                      animation === 'wrong' && selectedAnswer === option && "border-red-500 bg-red-50"
                    )}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedAnswer}
                  >
                    {option}
                    {selectedAnswer === option && (
                      option === currentStage.words?.[currentQuiz]?.translation ? (
                        <Check className="absolute bottom-2 right-2 h-4 w-4 text-green-500" />
                      ) : (
                        <X className="absolute bottom-2 right-2 h-4 w-4 text-red-500" />
                      )
                    )}
                  </Button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
};

export default VocabularyQuiz;
