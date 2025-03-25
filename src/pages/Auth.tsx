
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';

const Auth: React.FC = () => {
  const location = useLocation();
  
  // Get the default tab from URL search params
  const defaultTab = new URLSearchParams(location.search).get('tab') === 'signup' ? 'signup' : 'signin';

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 px-4">
      <Card className="w-full max-w-md">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <SignInForm />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;
