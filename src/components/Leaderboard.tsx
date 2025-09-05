import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import type { LeaderboardEntry } from "@/integrations/supabase/types";

interface LeaderboardProps {
  targetLanguage: string;
}

const Leaderboard = ({ targetLanguage }: LeaderboardProps) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .rpc('get_leaderboard', { 
            target_language: targetLanguage,
            limit: 10 
          });

        if (error) throw error;
        setLeaderboardData(data || []);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [targetLanguage]);

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 1:
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 2:
        return 'bg-amber-100 text-amber-600 border-amber-200';
      default:
        return 'bg-white text-gray-600 border-gray-100';
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Top Learners
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboardData.map((entry, index) => (
            <div 
              key={entry.user_id}
              className={`flex items-center p-4 rounded-lg border ${getRankStyle(index)}`}
            >
              <div className="flex-shrink-0 w-12 text-center font-bold">
                {index < 3 ? (
                  <Medal className={`h-6 w-6 mx-auto ${
                    index === 0 ? 'text-yellow-500' : 
                    index === 1 ? 'text-gray-500' : 
                    'text-amber-500'
                  }`} />
                ) : (
                  <span className="text-gray-500">#{index + 1}</span>
                )}
              </div>
              <div className="ml-4 flex-grow">
                <div className="flex items-center">
                  <img 
                    src={entry.avatar_url || '/placeholder.svg'} 
                    alt={entry.username}
                    className="h-8 w-8 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold">{entry.username}</div>
                    <div className="text-sm text-gray-500">
                      Level {entry.level}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="font-bold text-lg">{entry.points}</div>
                <div className="text-xs text-gray-500">points</div>
              </div>
            </div>
          ))}

          {leaderboardData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No learners found for this language yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
