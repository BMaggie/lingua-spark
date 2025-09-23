import { useToast } from "@/hooks/use-toast";
import { Star, Lock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StagesSelectorProps {
  stages: Array<{
    id: number;
    level: number;
    difficulty: string;
    wordsCount: number;
  }>;
  currentStageId: number;
  completedStages: number[];
  progress: Record<number, number>;
  onStageSelect: (stageId: number) => void;
}

const StagesSelector = ({
  stages,
  currentStageId,
  completedStages,
  progress,
  onStageSelect,
}: StagesSelectorProps) => {
  const { toast } = useToast();

  const handleStageClick = (stage: { id: number; level: number }) => {
    const isAvailable = stage.level === 1 || completedStages.includes(stage.level - 1);
    if (!isAvailable) {
      toast({
        title: "Stage Locked",
        description: "Complete the previous stage first!",
        variant: "destructive"
      });
      return;
    }
    onStageSelect(stage.id);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-6">
      {stages.map((stage) => {
        const isCompleted = completedStages.includes(stage.level);
        const isAvailable = stage.level === 1 || completedStages.includes(stage.level - 1);
        const isCurrent = stage.id === currentStageId;
        return (
          <button
            key={stage.id}
            onClick={() => handleStageClick(stage)}
            disabled={!isAvailable}
            className={`w-10 h-10 flex items-center justify-center rounded-md border text-lg font-bold transition-all duration-200
              ${isCurrent ? 'bg-blue-600 text-white border-blue-600 scale-110 shadow-lg' :
                isCompleted ? 'bg-green-500 text-white border-green-500' :
                !isAvailable ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed' :
                'bg-white text-gray-800 border-gray-300 hover:bg-blue-100 hover:border-blue-400'}
            `}
            title={isAvailable ? `Stage ${stage.level}` : 'Locked'}
            aria-label={`Stage ${stage.level}`}
          >
            {stage.level}
            {isCompleted && <Star className="h-4 w-4 text-yellow-300 ml-1" />}
            {!isAvailable && <Lock className="h-4 w-4 text-gray-400 ml-1" />}
          </button>
        );
      })}
    </div>
  );
};

export default StagesSelector;
