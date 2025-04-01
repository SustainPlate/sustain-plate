
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);
  const { toast } = useToast();
  
  const MAX_RETRIES = 3;

  // Updated profile fetching with retries
  const fetchProfile = async (userId: string, retryCount = 0) => {
    try {
      console.log(`Fetching profile for user: ${userId} (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If no rows found and we haven't reached max retries, retry after a delay
        if (error.code === 'PGRST116' && retryCount < MAX_RETRIES) {
          console.log(`Profile not found, retrying in ${(retryCount + 1) * 1000}ms...`);
          
          // Wait with increasing backoff before retrying
          setTimeout(() => fetchProfile(userId, retryCount + 1), (retryCount + 1) * 1000);
          return;
        }
        
        if (retryCount >= MAX_RETRIES) {
          console.error('Max retries reached, unable to fetch profile');
        }
      } else if (data) {
        console.log('Profile fetched successfully:', data);
        setProfile(data);
        return;
      } else {
        console.warn('No profile found for user:', userId);
      }
    } catch (error) {
      console.error('Exception fetching profile:', error);
    }
  };

  // Function to manually refresh the profile data
  const refreshProfile = async () => {
    if (user) {
      setLoading(true);
      await fetchProfile(user.id);
      setLoading(false);
    }
  };

  // Effect to handle auth state and profile fetching
  useEffect(() => {
    console.log('Initializing authentication');
    let timeout: NodeJS.Timeout;
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log('Initial session:', session ? 'Found' : 'None');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            // Reset the profile when signing in to avoid seeing stale data
            setProfile(null);
            await fetchProfile(session.user.id);
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Set a timeout to ensure we don't hang in loading state
    timeout = setTimeout(() => {
      if (loading) {
        console.log('Auth initialization timeout reached, forcing loading state to false');
        setLoading(false);
      }
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [refreshCount]); // Add refreshCount dependency to allow force-refreshing the effect

  const signOut = async () => {
    try {
      console.log('Signing out user');
      setLoading(true);
      
      // Clear profile first to avoid stale data
      setProfile(null);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Error",
          description: error.message || "An error occurred while signing out.",
          variant: "destructive",
        });
      } else {
        console.log('Sign out successful');
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      }
    } catch (error: any) {
      console.error('Exception during sign out:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred while signing out.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh trigger
  const forceRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      profile, 
      loading, 
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
