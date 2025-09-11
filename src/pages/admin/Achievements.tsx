import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  Target,
  Trophy,
  Zap
} from 'lucide-react';

const Achievements = () => {
  const achievements = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first vocabulary stage",
      icon: "🌟",
      rarity: "common",
      points: 10,
      unlocked: 45
    },
    {
      id: 2,
      name: "Streak Master",
      description: "Maintain a 7-day learning streak",
      icon: "🔥",
      rarity: "rare",
      points: 50,
      unlocked: 12
    },
    {
      id: 3,
      name: "Quiz Champion",
      description: "Score 100% on 5 quizzes",
      icon: "🏆",
      rarity: "epic",
      points: 100,
      unlocked: 3
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
        <p className="text-gray-600 mt-2">Manage achievements and rewards for users</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Common</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements.filter(a => a.rarity === 'common').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements.filter(a => a.rarity === 'rare').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Epic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements.filter(a => a.rarity === 'epic').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Achievement Library</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Achievement
        </Button>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <Card key={achievement.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{achievement.name}</CardTitle>
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{achievement.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{achievement.points} points</span>
                </div>
                <div className="text-sm text-gray-500">
                  {achievement.unlocked} unlocked
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Achievement Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Target className="h-5 w-5 text-blue-500" />
                <h4 className="font-medium">Progress Based</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Achievements based on learning milestones
              </p>
              <Button size="sm" variant="outline">
                Use Template
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <h4 className="font-medium">Streak Based</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Achievements for consistent learning habits
              </p>
              <Button size="sm" variant="outline">
                Use Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Achievements;
