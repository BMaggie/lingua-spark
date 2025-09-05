import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Headphones, Check } from 'lucide-react';
import StagesSelector from './StagesSelector';
import { supabase } from "@/integrations/supabase/client";
import type { VocabularyStage } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { useUserProgress } from "@/hooks/useUserProgress";

interface VocabularyCardProps {
  languages: { base: string; target: string };
}

function VocabularyCard({ languages }: VocabularyCardProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState<number[]>([]);
  const [currentStage, setCurrentStage] = useState<VocabularyStage | null>(null);
  const [stages, setStages] = useState<VocabularyStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [stageProgress, setStageProgress] = useState<Record<number, number>>({});
  const { userProfile, updateProgress, loading: userLoading } = useUserProgress();
  const { toast } = useToast();
  const completedStages = userProfile?.stages_completed?.vocabulary || [];

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const { data: vocabStages, error } = await supabase
          .from('vocabulary_stages')
          .select('*')
          .order('level', { ascending: true });

        if (error) {
          console.error('Database error:', error);
          // If table doesn't exist, create some sample data
          if (error.message.includes('relation "vocabulary_stages" does not exist')) {
            console.log('Creating sample vocabulary stages...');
            const sampleStages: VocabularyStage[] = [
              {
                id: 1,
                level: 1,
                words: [
                  { word: 'Hello', translation: 'Hola', difficulty: 'easy' as const },
                  { word: 'Goodbye', translation: 'Adiós', difficulty: 'easy' as const },
                  { word: 'Thank you', translation: 'Gracias', difficulty: 'easy' as const }
                ]
              }
            ];
            setStages(sampleStages);
            setCurrentStage(sampleStages[0]);
          } else {
            throw error;
          }
        } else {
          setStages(vocabStages || []);
          if (vocabStages && vocabStages.length > 0) {
            setCurrentStage(vocabStages[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching vocabulary stages:', error);
        toast({
          title: "Error",
          description: "Failed to load vocabulary stages. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStages();
  }, [toast]);

  const nextCard = () => {
    if (!currentStage) return;
    setCurrentCardIndex((prev) => (prev + 1) % currentStage.words.length);
    setIsFlipped(false);
  };

  const currentCard = currentStage?.words[currentCardIndex];

  const playAudio = async (text: string, lang: string) => {
    if (currentCard?.audio_url) {
      // Play from audio URL if available
      const audio = new Audio(currentCard.audio_url);
      await audio.play();
    } else if ('speechSynthesis' in window) {
      // Fallback to speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'Spanish' ? 'es-ES' : 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleStageSelect = (stageId: number) => {
    const stage = stages.find(s => s.level === stageId);
    if (!stage) return;
    
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
    setCurrentCardIndex(0);
    setKnownWords([]);
    setIsFlipped(false);
  };

  const handleKnowWord = async () => {
    if (!currentStage || !currentCard || !userProfile) return;
    
    if (!knownWords.includes(currentCardIndex)) {
      const newKnownWords = [...knownWords, currentCardIndex];
      setKnownWords(newKnownWords);
      
      // Update stage progress
      const newProgress = {
        ...stageProgress,
        [currentStage.id]: (stageProgress[currentStage.id] || 0) + 1
      };
      setStageProgress(newProgress);
      
      // Calculate points based on difficulty
      const points = currentCard.difficulty === 'hard' ? 30 : 
                    currentCard.difficulty === 'medium' ? 20 : 10;
      
      try {
        // Update user progress
        await updateProgress(points, {
          vocabulary: [...(userProfile.stages_completed?.vocabulary || []), currentStage.level]
        });
        
        toast({
          title: `+${points} Points!`,
          description: "Great job! Keep learning! 🌟",
        });
      } catch (error) {
        console.error('Error updating progress:', error);
        toast({
          title: "Error",
          description: `Failed to update progress: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive"
        });
      }

      // Check if stage is completed
      if (newKnownWords.length === currentStage.words.length) {
        // Update user's completed stages
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('No user found');

          const { error } = await supabase
            .from('profiles')
            .update({
              stages_completed: {
                vocabulary: [...completedStages, currentStage.level]
              }
            })
            .eq('user_id', user.id);

          if (error) throw error;

          toast({
            title: "Stage Completed!",
            description: `Congratulations! You've mastered all words in stage ${currentStage.level}!`,
          });

          // Move to next stage if available
          const nextStageIndex = stages.findIndex(s => s.id === currentStage.id) + 1;
          if (nextStageIndex < stages.length) {
            handleStageSelect(stages[nextStageIndex].level);
          }
        } catch (error) {
          console.error('Error updating completed stages:', error);
          toast({
            title: "Error",
            description: "Failed to update progress",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Great job! 🎉",
          description: `You earned ${points} points for learning a new word!`,
        });
      }
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

  const resetCards = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setKnownWords([]);
  };

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
          No vocabulary stages available
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Vocabulary Practice</h2>
            <p className="text-gray-600">
              Stage {currentStage.level} • Card {currentCardIndex + 1} of {currentStage.words.length} • 
              Known: {knownWords.length} words
            </p>
          </div>

          <StagesSelector
            stages={stages.map(stage => ({
              id: stage.id,
              level: stage.level,
              difficulty: 'medium', // Default difficulty since it's not in the stage data
              wordsCount: stage.words.length
            }))}
            currentStageId={currentStage.id}
            completedStages={completedStages}
            progress={stageProgress}
            onStageSelect={handleStageSelect}
          />
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentCardIndex + 1) / currentStage.words.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card 
        className={`h-80 cursor-pointer transition-all duration-700 transform-gpu ${
          isFlipped ? 'rotate-y-180' : ''
        } hover:shadow-xl`}
        onClick={handleCardFlip}
      >
        {/* Front of card */}
        <CardContent className="absolute inset-0 backface-hidden flex flex-col justify-center items-center p-8">
          <div className="text-center space-y-4">
            <div className="text-sm text-gray-500 uppercase tracking-wide flex items-center justify-center gap-2">
              <Badge variant={currentCard.difficulty === 'easy' ? 'secondary' : currentCard.difficulty === 'medium' ? 'default' : 'destructive'}>
                {currentCard.difficulty}
              </Badge>
            </div>
            <div className="text-4xl font-bold text-gray-800">
              {currentCard.word}
            </div>
            <div className="text-gray-600 italic">
              {languages.base}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                playAudio(currentCard.word, languages.base);
              }}
            >
              <Headphones className="h-4 w-4 mr-2" />
              Listen
            </Button>
          </div>
        </CardContent>

        {/* Back of card */}
        <CardContent className={`absolute inset-0 backface-hidden rotate-y-180 flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-50 to-purple-50`}>
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
            >
              <Headphones className="h-4 w-4 mr-2" />
              Listen
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500">
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

      {currentStage && knownWords.length === currentStage.words.length && (
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
}

export default VocabularyCard;