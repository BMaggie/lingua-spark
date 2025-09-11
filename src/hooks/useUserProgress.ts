import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '@/integrations/supabase/types';

export function useUserProgress() {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setUserProfile(profile);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();

    // Subscribe to profile changes
    const channel = supabase
      .channel('profile_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles'
      }, async payload => {
        // Get current user to check if this update is for the current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user && payload.new?.user_id === user.id) {
          setUserProfile(payload.new as Profile);
        }
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const updateProgress = async (
    points: number, 
    completedStages?: { vocabulary?: number[]; quiz?: number[] }
  ) => {
    try {
      if (!userProfile) throw new Error('No user profile found');

      const updates = {
        points: (userProfile.points || 0) + points,
        stages_completed: {
          vocabulary: completedStages?.vocabulary || userProfile.stages_completed?.vocabulary || [],
          quiz: completedStages?.quiz || userProfile.stages_completed?.quiz || []
        }
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userProfile.user_id)
        .select()
        .single();

      if (error) throw error;
      setUserProfile(data);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateLeaderboard = async () => {
    if (!userProfile) return;

    try {
      await supabase.from('leaderboard').upsert({
        user_id: userProfile.user_id,
        username: userProfile.username,
        avatar_url: userProfile.avatar_url,
        points: userProfile.points,
        level: userProfile.current_level,
        learning_language: userProfile.learning_languages.target,
        streak_days: userProfile.streak_days || 0
      });
    } catch (err) {
      console.error('Error updating leaderboard:', err);
    }
  };

  return {
    loading,
    error,
    userProfile,
    updateProgress,
    updateLeaderboard
  };
}
