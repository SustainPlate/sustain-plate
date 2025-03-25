
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DonorDashboard from '@/components/dashboard/DonorDashboard';
import NgoDashboard from '@/components/dashboard/NgoDashboard';
import VolunteerDashboard from '@/components/dashboard/VolunteerDashboard';
import { Loader2, RefreshCcw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { profile, loading, refreshProfile, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [localLoading, setLocalLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [renderKey, setRenderKey] = useState(0);
  
  // Max number of automatic retries before showing the error
  const MAX_AUTO_RETRIES = 2;

  useEffect(() => {
    // Auto-retry profile loading a few times if user exists but profile doesn't
    if (!loading && user && !profile && retryCount < MAX_AUTO_RETRIES) {
      console.log(`Auto-retrying profile fetch (${retryCount + 1}/${MAX_AUTO_RETRIES})`);
      const timer = setTimeout(() => {
        refreshProfile();
        setRetryCount(prev => prev + 1);
      }, 1500); // Wait a bit between retries
      
      return () => clearTimeout(timer);
    }
  }, [loading, user, profile, retryCount, refreshProfile]);

  const handleManualRetry = async () => {
    setLocalLoading(true);
    try {
      await refreshProfile();
      setRenderKey(prev => prev + 1);
      toast({
        title: "Success",
        description: "Your profile has been refreshed."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh profile. Please try again."
      });
    } finally {
      setLocalLoading(false);
    }
  };

  if (loading || localLoading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h1>
          <p className="mb-4">You need to be logged in to access your dashboard.</p>
          <Button 
            onClick={() => navigate('/auth')} 
            variant="default" 
            className="mx-auto"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h1>
          <p className="mb-4">We couldn't load your profile information.</p>
          <p className="mb-6 max-w-md mx-auto text-gray-600">
            This might happen if your profile is still being created. Please try refreshing, or sign out and sign in again if the issue persists.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={handleManualRetry} 
              variant="default" 
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" /> Try Again
            </Button>
            <Button 
              onClick={() => navigate('/auth')} 
              variant="outline"
            >
              Return to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
