import { createContext, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    const initialCheck = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Prefetch user data in parallel
        await Promise.all([
          supabase.from('user_preferences').select('*').single(),
          supabase.from('user_progress').select('*').single()
        ]).catch(() => {}); // Ignore errors, they'll be handled by the components
      }
    };

    initialCheck();

    // This ensures the auth state is synchronized across tabs/windows
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Clear any problematic cookies when signing in
        document.cookie = '__cf_bm=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={null}>
      {children}
    </AuthContext.Provider>
  );
}
