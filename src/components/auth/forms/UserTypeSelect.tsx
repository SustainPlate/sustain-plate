
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface UserTypeSelectProps {
  userType: string;
  onUserTypeChange: (value: string) => void;
}

const UserTypeSelect: React.FC<UserTypeSelectProps> = ({ userType, onUserTypeChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="userType">I am a</Label>
      <Select 
        value={userType} 
        onValueChange={onUserTypeChange}
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
  );
};

export default UserTypeSelect;
