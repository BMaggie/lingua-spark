import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, SkipForward, SkipBack, Volume2, BookOpen, Brain, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface Lesson {
  id: string;
  title: string;
  type: 'flashcard' | 'video' | 'audio' | 'quiz';
  content: {
    word?: string;
    translation?: string;
    pronunciation?: string;
    example?: string;
    videoUrl?: string;
    audioUrl?: string;
    questions?: Array<{
      question: string;
      options: string[];
      correct: number;
    }>;
  };
  completed: boolean;
  xp: number;
}

const CoursePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const lessons: Lesson[] = [
    {
      id: '1',
      title: 'Basic Greetings',
      type: 'flashcard',
      content: {
        word: 'Sannu',
        translation: 'Hello',
        example: 'Sannu! Yaya kake?' // Hello! How are you?
      },
      completed: false,
      xp: 10
    },
    {
      id: '2',
      title: 'Expressing Thanks',
      type: 'flashcard',
      content: {
        word: 'Nagode',
        translation: 'Thank you',
        example: 'Nagode da taimako.' // Thank you for your help.
      },
      completed: false,
      xp: 10
    },
    {
      id: '3',
      title: 'Common Questions',
      type: 'flashcard',
      content: {
        word: 'Ina lafiya?',
        translation: 'How are you?',
        example: 'Ina lafiya? Lafiya lau.' // How are you? I am fine.
      },
      completed: false,
      xp: 10
    },
    {
      id: '4',
      title: 'Hausa Basics Quiz',
      type: 'quiz',
      content: {
        questions: [
          {
            question: 'What does "Sannu" mean in English?',
            options: ['Hello', 'Thank you', 'Goodbye', 'Water'],
            correct: 0
          },
          {
            question: 'How do you say "Thank you" in Hausa?',
            options: ['Nagode', 'Gida', 'Ruwa', 'Kudi'],
            correct: 0
          },
          {
            question: 'What is the Hausa word for "Water"?',
            options: ['Ruwa', 'Abinci', 'Kasuwa', 'Makaranta'],
            correct: 0
          },
          {
            question: 'Translate "School" to Hausa.',
            options: ['Makaranta', 'Kasuwa', 'Gida', 'Abinci'],
            correct: 0
          }
        ]
      },
      completed: false,
      xp: 20
    }
  ];

  const currentLesson = lessons[currentLessonIndex];

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  const handleComplete = () => {
    lessons[currentLessonIndex].completed = true;
    toast({
      title: "Lesson Completed!",
      description: `You earned ${currentLesson.xp} XP!`,
    });
    setProgress((currentLessonIndex + 1) / lessons.length * 100);
  };

  const handleQuizAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    
    if (currentLesson.content.questions && currentLesson.content.questions[0].correct === answerIndex) {
      setTimeout(() => {
        handleComplete();
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Spanish Course</h1>
            <p className="text-muted-foreground">Continue your learning journey</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            <Brain className="h-4 w-4 mr-2" />
            Lesson {currentLessonIndex + 1} of {lessons.length}
          </Badge>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Course Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Lesson Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentLessonIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="min-h-[400px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {currentLesson.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {currentLesson.type === 'flashcard' && (
                  <div className="text-center space-y-6">
                    <div className="bg-primary/5 rounded-lg p-8 border border-primary/10">
                      <div className="space-y-4">
                        <h2 className="text-4xl font-bold text-primary">
                          {currentLesson.content.word}
                        </h2>
                        <p className="text-muted-foreground text-lg">
                          {currentLesson.content.pronunciation}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playAudio(currentLesson.content.word || '')}
                        >
                          <Volume2 className="h-4 w-4 mr-2" />
                          Listen
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {showAnswer && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-secondary/20 rounded-lg p-6 border border-secondary/30"
                        >
                          <h3 className="text-2xl font-semibold text-secondary-foreground">
                            {currentLesson.content.translation}
                          </h3>
                          <p className="text-muted-foreground mt-2">
                            {currentLesson.content.example}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-3">
                      {!showAnswer ? (
                        <Button onClick={() => setShowAnswer(true)} className="flex-1">
                          Show Translation
                        </Button>
                      ) : (
                        <Button onClick={handleComplete} className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          I Know This
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {currentLesson.type === 'quiz' && currentLesson.content.questions && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold mb-6">
                        {currentLesson.content.questions[0].question}
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {currentLesson.content.questions[0].options.map((option, index) => (
                          <Button
                            key={index}
                            variant={
                              selectedAnswer === index
                                ? index === currentLesson.content.questions![0].correct
                                  ? "default"
                                  : "destructive"
                                : showAnswer && index === currentLesson.content.questions![0].correct
                                ? "default"
                                : "outline"
                            }
                            onClick={() => handleQuizAnswer(index)}
                            disabled={showAnswer}
                            className="p-4 text-left justify-start"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentLessonIndex === 0}
              >
                <SkipBack className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {lessons.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentLessonIndex
                        ? 'bg-primary'
                        : index < currentLessonIndex
                        ? 'bg-green-500'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                disabled={currentLessonIndex === lessons.length - 1}
              >
                Next
                <SkipForward className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoursePage;