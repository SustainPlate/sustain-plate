
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OrganizationInputProps {
  organizationName: string;
  setOrganizationName: (value: string) => void;
}

const OrganizationInput: React.FC<OrganizationInputProps> = ({ 
  organizationName, setOrganizationName 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="organizationName">Organization Name</Label>
      <Input 
        id="organizationName" 
        value={organizationName}
        onChange={(e) => setOrganizationName(e.target.value)}
        required
      />
    </div>
  );
};

export default OrganizationInput;
