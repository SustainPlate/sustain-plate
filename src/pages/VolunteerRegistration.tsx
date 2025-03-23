
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  available: z.boolean().default(true),
  currentLocation: z.string().min(1, "Please provide your current location"),
  maxDistance: z.coerce.number().min(1, "Distance must be at least 1").max(100, "Distance cannot exceed 100")
});

type FormValues = z.infer<typeof formSchema>;

const VolunteerRegistration: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [existingVolunteer, setExistingVolunteer] = useState<any>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      available: true,
      currentLocation: '',
      maxDistance: 10
    }
  });

  useEffect(() => {
    const checkExistingVolunteer = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('volunteers')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setExistingVolunteer(data);
          form.reset({
            available: data.available,
            currentLocation: data.current_location || '',
            maxDistance: data.max_distance || 10
          });
        }
      } catch (error) {
        console.error('Error checking volunteer status:', error);
        toast({
          title: "Error",
          description: "Failed to check volunteer status. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingVolunteer();
  }, [user, form, toast]);

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to register as a volunteer.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      if (existingVolunteer) {
        // Update existing volunteer record
        const { error } = await supabase
          .from('volunteers')
          .update({
            available: data.available,
            current_location: data.currentLocation,
            max_distance: data.maxDistance
          })
          .eq('id', existingVolunteer.id);

        if (error) throw error;

        toast({
          title: "Volunteer Profile Updated",
          description: "Your volunteer profile has been successfully updated.",
        });
      } else {
        // Create new volunteer record
        const { error } = await supabase
          .from('volunteers')
          .insert({
            user_id: user.id,
            available: data.available,
            current_location: data.currentLocation,
            max_distance: data.maxDistance
          });

        if (error) throw error;

        // Update profile user_type to include volunteer role
        if (profile && !profile.user_type.includes('volunteer')) {
          const newUserType = profile.user_type === 'donor' 
            ? 'donor,volunteer' 
            : `${profile.user_type},volunteer`;
            
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ user_type: newUserType })
            .eq('id', user.id);
            
          if (profileError) throw profileError;
          
          // Refresh profile to get updated user_type
          await refreshProfile();
        }

        toast({
          title: "Volunteer Registration Successful",
          description: "You have successfully registered as a volunteer.",
        });
      }

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error registering as volunteer:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register as volunteer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <Card>
            <CardHeader>
              <CardTitle>{existingVolunteer ? "Update Volunteer Profile" : "Volunteer Registration"}</CardTitle>
              <CardDescription>
                Help deliver food donations to those in need
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="available"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Availability</FormLabel>
                            <FormDescription>
                              Mark yourself as available for delivery assignments
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="currentLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your city or neighborhood" {...field} />
                          </FormControl>
                          <FormDescription>
                            This helps match you with nearby donations
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="maxDistance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Distance (km)</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} max={100} {...field} />
                          </FormControl>
                          <FormDescription>
                            Maximum distance you're willing to travel for a delivery
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {existingVolunteer ? "Update Profile" : "Register as Volunteer"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VolunteerRegistration;
