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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {stages.map((stage) => {
        const isCompleted = completedStages.includes(stage.level);
        const isAvailable = stage.level === 1 || completedStages.includes(stage.level - 1);
        const isCurrent = stage.id === currentStageId;
        const stageProgress = progress[stage.id] || 0;

        return (
          <Card
            key={stage.id}
            className={`cursor-pointer transition-all duration-200 ${
              isCurrent
                ? 'ring-2 ring-blue-500 bg-blue-50'
                : isCompleted
                ? 'bg-green-50'
                : !isAvailable
                ? 'opacity-60'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleStageClick(stage)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Stage {stage.level}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(stage.difficulty)}`}>
                      {stage.difficulty}
                    </span>
                    <span className="text-xs text-gray-500">
                      {stage.wordsCount} words
                    </span>
                  </div>
                </div>
                <div>
                  {isCompleted ? (
                    <Star className="h-5 w-5 text-yellow-500" />
                  ) : !isAvailable ? (
                    <Lock className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-blue-500" />
                  )}
                </div>
              </div>
              {(isAvailable || isCompleted) && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${(stageProgress / stage.wordsCount) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {stageProgress}/{stage.wordsCount} completed
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StagesSelector;
