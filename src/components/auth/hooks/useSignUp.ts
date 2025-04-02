
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useSignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async (
    email: string,
    password: string,
    fullName: string,
    userType: string,
    phone: string = '',
    address: string = '',
    organizationName: string = ''
  ) => {
    setLoading(true);
    setErrorMessage('');

    try {
      console.log('Attempting to sign up with:', email, 'Type:', userType);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
            phone: phone || null,
            address: address || null,
            organization_name: userType === 'ngo' ? organizationName : null,
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        setErrorMessage(error.message || "An error occurred during signup.");
        toast({
          title: "Error",
          description: error.message || "An error occurred during signup.",
          variant: "destructive",
        });
        return false;
      }

      if (!data.user) {
        throw new Error("No user returned after signup");
      }

      toast({
        title: "Account created!",
        description: "You've successfully signed up.",
      });
      
      // Redirect to dashboard instead of home
      navigate('/dashboard');
      return true;
    } catch (error: any) {
      console.error('Exception during signup:', error);
      setErrorMessage(error.message || "An unexpected error occurred.");
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errorMessage,
    handleSignUp
  };
};

export default useSignUp;
