
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
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        
        if (error.code === 'PGRST116') {
          console.log('Profile not found, attempting to create a default profile');
          
          // Extract user information from metadata if available
          let userType = 'donor'; // Default to donor
          let fullName = '';
          
          if (user?.user_metadata) {
            userType = user.user_metadata.user_type || 'donor';
            fullName = user.user_metadata.full_name || user.user_metadata.name || '';
          }
          
          const { error: insertError, data: insertData } = await supabase
            .from('profiles')
            .insert({ 
              id: userId,
              user_type: userType,
              full_name: fullName
            })
            .select()
            .single();
            
          if (insertError) {
            console.error('Failed to create profile:', insertError);
            toast({
              title: "Profile Error",
              description: "Failed to create a user profile. Please try again or refresh the page.",
              variant: "destructive",
            });
          } else if (insertData) {
            console.log('Created default profile:', insertData);
            setProfile(insertData);
          } else {
            // Fetch the profile again as a fallback
            console.log('Fetching profile again after creation');
            await fetchProfile(userId);
          }
        } else {
          toast({
            title: "Profile Error",
            description: "Failed to fetch user profile: " + error.message,
            variant: "destructive",
          });
        }
      } else if (data) {
        console.log('Profile fetched successfully:', data);
        setProfile(data);
      } else {
        console.warn('No profile found for user:', userId);
      }
    } catch (error) {
      console.error('Exception fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to manually refresh the profile data
  const refreshProfile = async () => {
    if (user) {
      setLoading(true);
      await fetchProfile(user.id);
    }
  };

  useEffect(() => {
    console.log('Initializing authentication');
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log('Initial session:', session ? 'Found' : 'None');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
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
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Set a timeout to ensure we don't hang in loading state
    const timeout = setTimeout(() => {
      if (loading) {
        console.log('Auth initialization timeout reached, forcing loading state to false');
        setLoading(false);
      }
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setProfile(null);
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
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
