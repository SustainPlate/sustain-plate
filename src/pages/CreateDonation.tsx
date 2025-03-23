
import React, { useEffect } from 'react';
import CreateDonationForm from '@/components/dashboard/donor/CreateDonationForm';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CreateDonation: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is a donor
  useEffect(() => {
    if (profile && profile.user_type !== 'donor') {
      toast({
        title: "Access Denied",
        description: "Only donors can create food donations.",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [profile, navigate, toast]);

  // If not a donor, don't render the form
  if (profile?.user_type !== 'donor') {
    return null;
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
