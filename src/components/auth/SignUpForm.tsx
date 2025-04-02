
import React, { useState, useEffect } from 'react';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import UserTypeSelect from './forms/UserTypeSelect';
import AuthInputs from './forms/AuthInputs';
import OrganizationInput from './forms/OrganizationInput';
import ContactInfoInputs from './forms/ContactInfoInputs';
import useSignUp from './hooks/useSignUp';

interface SignUpFormProps {
  defaultUserType?: string;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ defaultUserType = 'donor' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [userType, setUserType] = useState(defaultUserType);
  const { loading, errorMessage, handleSignUp } = useSignUp();

  useEffect(() => {
    if (defaultUserType) {
      setUserType(defaultUserType);
    }
  }, [defaultUserType]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSignUp(
      email,
      password,
      fullName,
      userType,
      phone,
      address,
      organizationName
    );
  };

  return (
    <form onSubmit={onSubmit}>
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
        
        <UserTypeSelect userType={userType} onUserTypeChange={setUserType} />
        
        <AuthInputs 
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />

        {userType === 'ngo' && (
          <OrganizationInput 
            organizationName={organizationName}
            setOrganizationName={setOrganizationName}
          />
        )}

        <ContactInfoInputs
          phone={phone}
          setPhone={setPhone}
          address={address}
          setAddress={setAddress}
        />
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
