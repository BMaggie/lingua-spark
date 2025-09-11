import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import type { Profile } from '@/integrations/supabase/types';

interface AuthUser extends User {
  profile: Profile;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  userRole: 'admin' | 'user' | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          await fetchUserData(session.user);
        } else {
          setUser(null);
          setUserRole(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (authUser: User) => {
    try {
      setIsLoading(true);
      
      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }

      // Create user object with profile
      const userWithProfile: AuthUser = {
        ...authUser,
        profile: profile || {
          id: '',
          user_id: authUser.id,
          username: authUser.email?.split('@')[0] || 'user',
          avatar_url: '',
          full_name: authUser.user_metadata?.full_name || '',
          languages_spoken: [],
          learning_languages: { base: '', target: '' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };

      setUser(userWithProfile);
      
      // Set user role
      const role = authUser.user_metadata?.role || profile?.role || 'user';
      setUserRole(role);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserRole('user');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await fetchUserData(session.user);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
  };

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    userRole,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};