
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import NotificationCenter from './notifications/NotificationCenter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, UserCog, Package, CarFront, Loader2 } from 'lucide-react';

const AuthButtons: React.FC = () => {
  const { user, signOut, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      // After successfully signing out, navigate to the home page
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "An error occurred while signing out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center">
        <Loader2 className="animate-spin h-5 w-5 text-gray-400" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <NotificationCenter />
        <span className="text-sm hidden md:inline-block">
          Hello, {profile?.full_name || user.email}
        </span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
              <Package className="mr-2 h-4 w-4" />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <UserCog className="mr-2 h-4 w-4" />
              Edit Profile
            </DropdownMenuItem>
            {profile && !profile.user_type.includes('volunteer') && (
              <DropdownMenuItem onClick={() => navigate('/volunteer')}>
                <CarFront className="mr-2 h-4 w-4" />
                Become a Volunteer
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
              {isSigningOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" asChild>
        <Link to="/auth">Log In</Link>
      </Button>
      <Button asChild>
        <Link to="/auth?tab=signup">Sign Up</Link>
      </Button>
    </div>
  );
};

export default AuthButtons;
