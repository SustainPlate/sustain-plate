
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactInfoInputsProps {
  phone: string;
  setPhone: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
}

const ContactInfoInputs: React.FC<ContactInfoInputsProps> = ({ 
  phone, setPhone, address, setAddress 
}) => {
  return (
    <>
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
    </>
  );
};

export default ContactInfoInputs;
