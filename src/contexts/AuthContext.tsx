
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
  const [profileFetchAttempts, setProfileFetchAttempts] = useState(0);
  const { toast } = useToast();
  
  const MAX_RETRIES = 3; // Reduce number of retries
  const RETRY_DELAY = 1000; // Set consistent delay

  // Handle tab visibility change for auto logout
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Save the timestamp when the user leaves the page
        localStorage.setItem('lastActiveTime', Date.now().toString());
      } else if (document.visibilityState === 'visible') {
        const lastActiveTime = localStorage.getItem('lastActiveTime');
        if (lastActiveTime) {
          const inactiveTime = Date.now() - parseInt(lastActiveTime);
          // If inactive for more than 5 minutes, sign out
          if (inactiveTime > 5 * 60 * 1000) {
            signOut();
            toast({
              title: "Session Expired",
              description: "You have been signed out due to inactivity.",
            });
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Updated profile fetching with improved retry logic
  const fetchProfile = async (userId: string, retryCount = 0): Promise<boolean> => {
    try {
      console.log(`Fetching profile for user: ${userId} (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})`);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        // If no rows found and we haven't reached max retries, retry
        if (error.code === 'PGRST116' && retryCount < MAX_RETRIES) {
          const delay = RETRY_DELAY;
          console.log(`Profile not found, retrying in ${delay}ms...`);
          
          return new Promise(resolve => {
            setTimeout(async () => {
              const result = await fetchProfile(userId, retryCount + 1);
              resolve(result);
            }, delay);
          });
        }
        
        if (retryCount >= MAX_RETRIES) {
          console.error('Max retries reached, unable to fetch profile');
          return false;
        }
        
        return false;
      } else if (data) {
        console.log('Profile fetched successfully:', data);
        setProfile(data);
        setProfileFetchAttempts(0); // Reset attempts counter on success
        return true;
      } else {
        console.warn('No profile found for user:', userId);
        return false;
      }
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return false;
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
          const profileSuccess = await fetchProfile(session.user.id);
          // If profile fetch fails after all retries, sign out
          if (!profileSuccess && profileFetchAttempts > MAX_RETRIES) {
            console.warn('Failed to fetch profile after multiple attempts, signing out');
            await signOut();
            toast({
              title: "Error",
              description: "Could not load your profile. Please try logging in again.",
              variant: "destructive",
            });
          }
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
          localStorage.removeItem('lastActiveTime'); // Clear last active time
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

    // Check for session expiration on window focus
    const handleWindowFocus = () => {
      const tokenExpiryData = localStorage.getItem('supabase.auth.token');
      if (tokenExpiryData && user) {
        try {
          const tokenExpiry = JSON.parse(tokenExpiryData)?.expiresAt;
          if (tokenExpiry && Date.now() > tokenExpiry * 1000) {
            signOut();
            toast({
              title: "Session Expired",
              description: "Your session has expired. Please log in again.",
            });
          }
        } catch (error) {
          console.error('Error checking token expiry:', error);
        }
      }
    };

    window.addEventListener('focus', handleWindowFocus);

    // Set up before unload event to update last active time
    const handleBeforeUnload = () => {
      if (user) {
        localStorage.setItem('lastActiveTime', Date.now().toString());
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [profileFetchAttempts]); // Track profile fetch attempts

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
        // Clear any authentication-related storage
        localStorage.removeItem('lastActiveTime');
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
