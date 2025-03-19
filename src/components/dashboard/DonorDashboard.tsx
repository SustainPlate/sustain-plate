
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, Package } from 'lucide-react';

const DonorDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donor Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'Donor'}
          </p>
        </div>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Food Donation
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Donations</CardTitle>
            <CardDescription>Your current food donation listings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Completed Donations</CardTitle>
            <CardDescription>Successfully delivered donations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Impact</CardTitle>
            <CardDescription>Meals provided through your donations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>Manage your recent food donation listings</CardDescription>
        </CardHeader>
        <CardContent>
          {donations.length > 0 ? (
            <div>Donation listings will appear here</div>
          ) : (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No donations yet</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                You haven't created any food donation listings yet.
              </p>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create your first donation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DonorDashboard;
