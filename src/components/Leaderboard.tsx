import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import type { UserProgress } from "@/integrations/supabase/types";
import { Badge } from './ui/badge';

interface LeaderboardProps {
  targetLanguage: string;
  currentUserId?: string;
}

interface LeaderboardEntry extends UserProgress {
  user_name: string;
}

const Leaderboard = ({ targetLanguage, currentUserId }: LeaderboardProps) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select(`
            *,
            users:user_id (
              full_name
            )
          `)
          .eq('target_language', targetLanguage)
          .order('total_points', { ascending: false })
          .limit(10);

        if (error) throw error;

        const formattedData = data.map(entry => ({
          ...entry,
          user_name: entry.users?.full_name || 'Anonymous User'
        }));

        setLeaderboardData(formattedData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [targetLanguage]);

  if (loading) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Top Learners - {targetLanguage}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leaderboardData.map((entry, index) => (
            <div
              key={entry.user_id}
              className={`flex items-center justify-between p-4 rounded-lg ${
                entry.user_id === currentUserId ? 'bg-primary/10' : 'bg-secondary/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-lg font-semibold min-w-[24px]">#{index + 1}</span>
                <span>{entry.user_name}</span>
                {index < 3 && (
                  <Badge variant={index === 0 ? "default" : "secondary"}>
                    {index === 0 ? '🏆' : index === 1 ? '🥈' : '🥉'}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm">Level {Math.floor(entry.total_points / 100) + 1}</span>
                <span className="font-semibold">{entry.total_points} pts</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default Leaderboard;
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
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">
                        Level {entry.level}
                      </div>
                      <div className="flex gap-1">
                        {getAchievementBadges(entry).map((badge, i) => (
                          <badge.icon
                            key={i}
                            className={`h-4 w-4 ${badge.color}`}
                            title={badge.title}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {entry.points}
                </div>
                <div className="text-xs text-gray-500">
                  {entry.streak_days > 0 && `${entry.streak_days}d streak • `}points
                </div>
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
