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
        {
          word: 'Hello',
          translation: 'Sannu',
          options: ['Sannu', 'Barka', 'Ina', 'Lafiya']
        },
        {
          word: 'Water',
          translation: 'Ruwa',
          options: ['Ruwa', 'Gida', 'Abinci', 'Daki']
        },
        {
          word: 'Food',
          translation: 'Abinci',
          options: ['Abinci', 'Ruwa', 'Gida', 'Lafiya']
        }
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
