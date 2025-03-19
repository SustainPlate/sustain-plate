
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const AuthButtons: React.FC = () => {
  const { user, signOut, profile } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm hidden md:inline-block">
          Hello, {profile?.full_name || user.email}
        </span>
        <Button variant="outline" onClick={signOut}>
          Log Out
        </Button>
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
