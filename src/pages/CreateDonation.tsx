
import React from 'react';
import CreateDonationForm from '@/components/dashboard/donor/CreateDonationForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CreateDonation: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && profile && profile.user_type !== 'donor') {
      toast({
        title: "Access Denied",
        description: "Only donors can create food donations.",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [user, profile, loading, navigate, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-green-600" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Create Food Donation</h1>
          <p className="text-muted-foreground">
            Fill out the form below to create a new food donation listing.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <CreateDonationForm />
        </div>
      </div>
    </div>
  );
};

export default CreateDonation;
