
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DonorDashboard from '@/components/dashboard/DonorDashboard';
import NgoDashboard from '@/components/dashboard/NgoDashboard';
import VolunteerDashboard from '@/components/dashboard/VolunteerDashboard';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Dashboard: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  // Debug authentication state
  useEffect(() => {
    console.log('Dashboard auth state:', { user, profile, loading });
  }, [user, profile, loading]);

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to /auth');
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // If profile is missing but user exists, show error
  useEffect(() => {
    if (!loading && user && !profile) {
      const errorMsg = 'User profile not found. Please contact support.';
      console.error(errorMsg);
      setError(errorMsg);
      toast({
        title: "Profile Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  }, [user, profile, loading, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
          <p className="mb-4">{error}</p>
          <p>Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      </div>
    );
  }

  // Return appropriate dashboard based on user type
  const renderDashboard = () => {
    if (!profile) return null;

    console.log('Rendering dashboard for user type:', profile.user_type);
    
    switch (profile.user_type) {
      case 'donor':
        return <DonorDashboard />;
      case 'ngo':
        return <NgoDashboard />;
      case 'volunteer':
        return <VolunteerDashboard />;
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
