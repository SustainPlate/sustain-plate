
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ProfileForm from '@/components/profile/ProfileForm';

const Profile: React.FC = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Profile Not Found</h1>
          <p className="mb-4">We couldn't find your profile information.</p>
          <Button onClick={() => navigate('/auth')} variant="default">Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Your Profile</h1>
          
          <ProfileForm 
            profile={profile} 
            onSuccess={() => {
              refreshProfile();
              toast({
                title: "Profile Updated",
                description: "Your profile has been successfully updated.",
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
