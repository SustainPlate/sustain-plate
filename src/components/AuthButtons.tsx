
import React from 'react';
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
import { User, LogOut, UserCog, Package, CarFront } from 'lucide-react';

const AuthButtons: React.FC = () => {
  const { user, signOut, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Success",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "An error occurred while signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

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
            {!profile?.user_type.includes('volunteer') && (
              <DropdownMenuItem onClick={() => navigate('/volunteer')}>
                <CarFront className="mr-2 h-4 w-4" />
                Become a Volunteer
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
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
