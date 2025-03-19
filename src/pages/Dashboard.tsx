
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DonorDashboard from '@/components/dashboard/DonorDashboard';
import NgoDashboard from '@/components/dashboard/NgoDashboard';
import VolunteerDashboard from '@/components/dashboard/VolunteerDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-green-600" />
      </div>
    );
  }

  // Return appropriate dashboard based on user type
  const renderDashboard = () => {
    if (!profile) return null;

    switch (profile.user_type) {
      case 'donor':
        return <DonorDashboard />;
      case 'ngo':
        return <NgoDashboard />;
      case 'volunteer':
        return <VolunteerDashboard />;
      default:
        return <div>Invalid user type</div>;
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
