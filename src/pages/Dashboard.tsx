
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DonorDashboard from '@/components/dashboard/DonorDashboard';
import NgoDashboard from '@/components/dashboard/NgoDashboard';
import VolunteerDashboard from '@/components/dashboard/VolunteerDashboard';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [renderKey, setRenderKey] = useState(0); // Add a key to force re-render

  // Debug authentication state
  useEffect(() => {
    console.log('Dashboard auth state:', { user, profile, loading, retryCount });
    
    // Use a short timeout to prevent infinite loading
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [user, profile, loading, retryCount]);

  // Set local loading state based on auth loading
  useEffect(() => {
    if (!loading) {
      // Add a small delay to ensure other state updates have processed
      setTimeout(() => {
        setLocalLoading(false);
      }, 100);
    } else {
      setLocalLoading(true);
    }
  }, [loading]);

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to /auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Auto-retry profile fetch if user exists but profile is missing
  useEffect(() => {
    if (!loading && user && !profile && retryCount < 3) {
      const retryTimer = setTimeout(() => {
        console.log(`Retry ${retryCount + 1}: Attempting to refresh profile...`);
        refreshProfile();
        setRetryCount(prev => prev + 1);
      }, 1000);
      
      return () => clearTimeout(retryTimer);
    }
  }, [user, profile, loading, refreshProfile, retryCount]);

  // Show error if profile is missing after retries
  useEffect(() => {
    if (!loading && user && !profile && retryCount >= 3) {
      const errorMsg = 'User profile not found. Please try refreshing the page.';
      console.error(errorMsg);
      setError(errorMsg);
      toast({
        title: "Profile Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  }, [user, profile, loading, toast, retryCount]);

  const handleManualRetry = () => {
    setError(null);
    setLocalLoading(true);
    setRetryCount(0);
    refreshProfile();
    setRenderKey(prev => prev + 1); // Force re-render on retry
  };

  // Force render after a certain time to prevent infinite loading
  if (localLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
          <p className="mb-4">{error}</p>
          <p className="mb-6">Please try refreshing the page or contact support if the issue persists.</p>
          <Button 
            onClick={handleManualRetry} 
            variant="outline" 
            className="mx-auto flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" /> Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Safety check - if profile is still null despite checks, show loading
  if (!profile) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" />
          <p>Loading profile data...</p>
          <Button 
            onClick={handleManualRetry} 
            variant="outline" 
            className="mx-auto mt-4 flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" /> Reload
          </Button>
        </div>
      </div>
    );
  }

  // Return appropriate dashboard based on user type
  const renderDashboard = () => {
    console.log('Rendering dashboard for user type:', profile.user_type);
    
    switch (profile.user_type) {
      case 'donor':
        return <DonorDashboard key={renderKey} />;
      case 'ngo':
        return <NgoDashboard key={renderKey} />;
      case 'volunteer':
        return <VolunteerDashboard key={renderKey} />;
      default:
        return (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Invalid User Type</h2>
            <p className="text-gray-600">
              User type "{profile.user_type}" is not recognized. Please contact support.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;
