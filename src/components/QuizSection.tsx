import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, Headphones } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import type { QuizStage } from "@/integrations/supabase/types";
import { useUserProgress } from "@/hooks/useUserProgress";
import StagesSelector from "./StagesSelector";

interface QuizSectionProps {
  languages: { base: string; target: string };
}

const QuizSection = ({ languages }: QuizSectionProps) => {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [stages, setStages] = useState<QuizStage[]>([]);
  const [currentStage, setCurrentStage] = useState<QuizStage | null>(null);
  const [loading, setLoading] = useState(true);
  const [stageProgress, setStageProgress] = useState<Record<number, { score: number; total: number }>>({});
  const { userProfile, updateProgress, loading: userLoading } = useUserProgress();
  const { toast } = useToast();

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const { data: quizStages, error } = await supabase
          .from('quiz_stages')
          .select('*')
          .order('level', { ascending: true });

        if (error) throw error;
        setStages(quizStages || []);
        if (quizStages && quizStages.length > 0) {
          setCurrentStage(quizStages[0]);
        }
      } catch (error) {
        console.error('Error fetching quiz stages:', error);
        toast({
          title: "Error",
          description: "Failed to load quiz stages",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStages();
  }, []);

  if (loading || userLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentStage || !userProfile) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          No quiz stages available
        </CardContent>
      </Card>
    );
  }

  const completedStages = userProfile?.stages_completed?.quiz || [];

  const handleStageSelect = async (stage: QuizStage) => {
    const isAvailable = stage.level === 1 || completedStages.includes(stage.level - 1);
    if (!isAvailable) {
      toast({
        title: "Stage Locked",
        description: "Complete the previous stage first!",
        variant: "destructive"
      });
      return;
    }
    setCurrentStage(stage);
    setCurrentQuiz(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  const handleAnswerSelect = async (answer: string) => {
    if (!currentStage || !userProfile || showResult) return;

    const currentQuestion = currentStage.questions[currentQuiz];
    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentQuestion.correct_answer;
    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);

      const currentProgress = stageProgress[currentStage.id] || { score: 0, total: 0 };
      const newProgress = {
        ...stageProgress,
        [currentStage.id]: {
          score: currentProgress.score + 1,
          total: currentProgress.total + 1
        }
      };
      setStageProgress(newProgress);

      try {
        await updateProgress(currentQuestion.points, {
          quiz: newScore === currentStage.questions.length
            ? [...userProfile.stages_completed.quiz, currentStage.level]
            : userProfile.stages_completed.quiz
        });

        toast({
          title: `+${currentQuestion.points} Points!`,
          description: "Correct answer! 🎯",
        });
      } catch (error) {
        console.error('Error updating progress:', error);
        toast({
          title: "Error",
          description: "Failed to update progress",
          variant: "destructive"
        });
      }

      if (newScore === currentStage.questions.length) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('No user found');

          const { error } = await supabase
            .from('profiles')
            .update({
              stages_completed: {
                quiz: [...completedStages, currentStage.level]
              }
            })
            .eq('user_id', user.id);

          if (error) throw error;

          toast({
            title: "Stage Completed!",
            description: `Perfect score! You've mastered quiz stage ${currentStage.level}!`,
          });

          const nextStageIndex = stages.findIndex(s => s.id === currentStage.id) + 1;
          if (nextStageIndex < stages.length) {
            handleStageSelect(stages[nextStageIndex]);
          }
        } catch (error) {
          console.error('Error updating completed stages:', error);
        }
      } else {
        toast({
          title: `Correct! +${currentQuestion.points} Points`,
          description: "Great job! Keep going! 🌟",
        });
      }
    } else {
      toast({
        title: "Not quite right",
        description: `The correct answer was: ${currentQuestion.correct_answer}`,
        variant: "destructive",
      });
    }
  };

  const nextQuestion = () => {
    if (!currentStage) return;

    if (currentQuiz < currentStage.questions.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const finalScore = Math.round((score / currentStage.questions.length) * 100);
      toast({
        title: "Quiz Complete! 🏆",
        description: `Your score: ${finalScore}%`,
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  const currentQuestion = currentStage.questions[currentQuiz];

  const getButtonVariant = (option: string) => {
    if (!showResult) return "outline";
    if (option === currentQuestion.correct_answer) return "default";
    if (option === selectedAnswer && option !== currentQuestion.correct_answer) return "destructive";
    return "outline";
  };

  const getButtonClass = (option: string) => {
    if (!showResult) return "hover:bg-blue-50";
    if (option === currentQuestion.correct_answer) return "bg-green-600 hover:bg-green-700 text-white";
    if (option === selectedAnswer && option !== currentQuestion.correct_answer) return "bg-red-600 hover:bg-red-700 text-white";
    return "opacity-50";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Language Quiz</h2>
        <p className="text-gray-600">
          Stage {currentStage.level}: {currentStage.name}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {currentStage.description}
        </p>
      </div>

      <StagesSelector
        stages={stages.map(stage => ({
          id: stage.id,
          level: stage.level,
          difficulty: 'medium',
          wordsCount: stage.questions.length
        }))}
        currentStageId={currentStage.id}
        completedStages={userProfile.stages_completed.quiz}
        progress={Object.fromEntries(
          Object.entries(stageProgress).map(([id, p]) => [id, p.score])
        )}
        onStageSelect={handleStageSelect}
      />

      {currentQuiz >= currentStage.questions.length ? (
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Stage {currentStage.level} Complete! 🏆</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {Math.round((score / currentStage.questions.length) * 100)}%
            </div>
            <p className="text-xl text-gray-600">
              You got {score} out of {currentStage.questions.length} questions correct!
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Performance Rating:</p>
              <div className="text-lg font-semibold">
                {score / currentStage.questions.length >= 0.8
                  ? "🌟 Excellent!"
                  : score / currentStage.questions.length >= 0.6
                  ? "👍 Good job!"
                  : "💪 Keep practicing!"}
              </div>
            </div>
            <div className="flex space-x-4 justify-center">
              <Button onClick={resetQuiz} className="bg-blue-600 hover:bg-blue-700">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Language Quiz</h2>
            <p className="text-gray-600">
              Question {currentQuiz + 1} of {currentStage.questions.length} | Score: {score}/{currentQuiz + (showResult ? 1 : 0)}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className="bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuiz + 1) / currentStage.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-center">
                {currentQuestion.question}
              </CardTitle>
              {currentQuestion.audio && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const audio = new Audio(currentQuestion.audio);
                      audio.play();
                    }}
                  >
                    <Headphones className="h-4 w-4 mr-2" />
                    Listen to pronunciation
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={getButtonVariant(option)}
                  className={`w-full text-left justify-start h-auto p-4 ${getButtonClass(option)}`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{option}</span>
                    {showResult && option === currentQuestion.correct_answer && (
                      <Check className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {showResult && (
            <div className="text-center">
              <Button onClick={nextQuestion} className="bg-blue-600 hover:bg-blue-700">
                {currentQuiz < currentStage.questions.length - 1 ? "Next Question" : "View Results"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizSection;
