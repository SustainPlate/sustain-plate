
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DonorDashboard from '@/components/dashboard/DonorDashboard';
import NgoDashboard from '@/components/dashboard/NgoDashboard';
import VolunteerDashboard from '@/components/dashboard/VolunteerDashboard';
import { Loader2, RefreshCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const Dashboard: React.FC = () => {
  const { profile, loading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [localLoading, setLocalLoading] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

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

  if (!profile) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h1>
          <p className="mb-4">We couldn't load your profile information.</p>
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
