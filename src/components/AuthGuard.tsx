
import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we need to redirect
    if (!loading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
      });
      navigate('/auth', { replace: true });
    }
  }, [user, loading, navigate, toast]);

  // Show error state with retry button if loading takes too long
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-green-600 mb-4" />
        <p className="text-sm text-gray-600 mb-2">Verifying your session...</p>
        <p className="text-xs text-gray-500">This will only take a moment</p>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Alert className="max-w-md">
          <AlertDescription>
            You must be logged in to access this page. Redirecting to login...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
