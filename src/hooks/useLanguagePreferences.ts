import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/integrations/supabase/types';
import { useToast } from './use-toast';

interface LanguagePreferences {
  base: string;
  target: string;
  spoken: string[];
}

export function useLanguagePreferences() {
  const [preferences, setPreferences] = useState<LanguagePreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPreferences(null);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('languages_spoken, learning_languages')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (profile) {
        setPreferences({
          base: profile.learning_languages.base,
          target: profile.learning_languages.target,
          spoken: profile.languages_spoken
        });
      }
    } catch (error) {
      console.error('Error fetching language preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load language preferences',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences: LanguagePreferences) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase.rpc('update_user_languages', {
        user_id: user.id,
        base_lang: newPreferences.base,
        target_lang: newPreferences.target,
        spoken_langs: newPreferences.spoken
      });

      if (error) throw error;

      setPreferences(newPreferences);
      return data;
    } catch (error) {
      console.error('Error updating language preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to update language preferences',
        variant: 'destructive'
      });
      return null;
    }
  };

  return {
    preferences,
    loading,
    updatePreferences,
    refreshPreferences: fetchPreferences
  };
}
