import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface SignUpFormProps {
  defaultUserType?: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ defaultUserType = 'donor' }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [userType, setUserType] = useState(defaultUserType);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (defaultUserType) {
      setUserType(defaultUserType);
    }
  }, [defaultUserType]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      console.log('Attempting to sign up with:', email, 'Type:', userType);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType,
            phone: phone || null,
            address: address || null,
            organization_name: userType === 'ngo' ? organizationName : null,
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        setErrorMessage(error.message || "An error occurred during signup.");
        toast({
          title: "Error",
          description: error.message || "An error occurred during signup.",
          variant: "destructive",
        });
        return;
      }

      if (!data.user) {
        throw new Error("No user returned after signup");
      }

      toast({
        title: "Account created!",
        description: "You've successfully signed up.",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Exception during signup:', error);
      setErrorMessage(error.message || "An unexpected error occurred.");
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Join Sustain Plate and help reduce food waste.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="bg-red-50 p-3 rounded-md border border-red-200 text-red-700 text-sm">
            {errorMessage}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="userType">I am a</Label>
          <Select 
            value={userType} 
            onValueChange={setUserType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="donor">Food Donor (Restaurants, Hotels, Hostels, etc.)</SelectItem>
              <SelectItem value="ngo">NGO/Food Collection</SelectItem>
              <SelectItem value="volunteer">Volunteer/Food Distribution</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input 
            id="fullName" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        {userType === 'ngo' && (
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input 
              id="organizationName" 
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="your@email.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input 
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Account...
            </>
          ) : "Create Account"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignUpForm;
