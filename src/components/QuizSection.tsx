
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, Headphones } from 'lucide-react';

interface QuizSectionProps {
  languages: { base: string; target: string };
  onProgress: (points: number) => void;
}

const QuizSection = ({ languages, onProgress }: QuizSectionProps) => {
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizType, setQuizType] = useState<'multiple-choice' | 'matching' | 'fill-blank'>('multiple-choice');
  const { toast } = useToast();

  const quizData = [
    {
      question: "What does 'Hola' mean in English?",
      options: ["Hello", "Goodbye", "Thank you", "Please"],
      correct: "Hello",
      audio: "Hola"
    },
    {
      question: "How do you say 'Water' in Spanish?",
      options: ["Fuego", "Agua", "Tierra", "Aire"],
      correct: "Agua",
      audio: "Agua"
    },
    {
      question: "What is the English translation of 'Gracias'?",
      options: ["Please", "Sorry", "Thank you", "Excuse me"],
      correct: "Thank you",
      audio: "Gracias"
    },
    {
      question: "How do you say 'House' in Spanish?",
      options: ["Coche", "Casa", "Cama", "Comida"],
      correct: "Casa",
      audio: "Casa"
    },
    {
      question: "What does 'Amigo' mean?",
      options: ["Enemy", "Stranger", "Family", "Friend"],
      correct: "Friend",
      audio: "Amigo"
    }
  ];

  const currentQuestion = quizData[currentQuiz];

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === currentQuestion.correct;
    if (isCorrect) {
      setScore(score + 1);
      onProgress(15);
      toast({
        title: "Correct! 🎉",
        description: "You earned 15 points!",
      });
    } else {
      toast({
        title: "Not quite right 🤔",
        description: `The correct answer is: ${currentQuestion.correct}`,
        variant: "destructive",
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuiz < quizData.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      const finalScore = Math.round((score / quizData.length) * 100);
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

  const getButtonVariant = (option: string) => {
    if (!showResult) return "outline";
    if (option === currentQuestion.correct) return "default";
    if (option === selectedAnswer && option !== currentQuestion.correct) return "destructive";
    return "outline";
  };

  const getButtonClass = (option: string) => {
    if (!showResult) return "hover:bg-blue-50";
    if (option === currentQuestion.correct) return "bg-green-600 hover:bg-green-700 text-white";
    if (option === selectedAnswer && option !== currentQuestion.correct) return "bg-red-600 hover:bg-red-700 text-white";
    return "opacity-50";
  };

  if (currentQuiz >= quizData.length) {
    const finalScore = Math.round((score / quizData.length) * 100);
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Quiz Complete! 🏆</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-6xl font-bold text-blue-600">
              {finalScore}%
            </div>
            <p className="text-xl text-gray-600">
              You got {score} out of {quizData.length} questions correct!
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Performance Rating:</p>
              <div className="text-lg font-semibold">
                {finalScore >= 80 ? "🌟 Excellent!" : 
                 finalScore >= 60 ? "👍 Good job!" : 
                 "💪 Keep practicing!"}
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
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Language Quiz</h2>
        <p className="text-gray-600">
          Question {currentQuiz + 1} of {quizData.length} | Score: {score}/{currentQuiz + (showResult ? 1 : 0)}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-gradient-to-r from-green-600 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuiz + 1) / quizData.length) * 100}%` }}
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
                onClick={() => playAudio(currentQuestion.audio)}
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
                {showResult && option === currentQuestion.correct && (
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
            {currentQuiz < quizData.length - 1 ? "Next Question" : "View Results"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizSection;
