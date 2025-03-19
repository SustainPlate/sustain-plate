
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, ShoppingBag, Search } from 'lucide-react';

const NgoDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NGO Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.organization_name || profile?.full_name || 'Partner'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            Browse Donations
          </Button>
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Request
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Requests</CardTitle>
            <CardDescription>Your current food needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Received Donations</CardTitle>
            <CardDescription>Total donations received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>People Served</CardTitle>
            <CardDescription>Estimated impact of donations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Requests</CardTitle>
          <CardDescription>Manage your food requests</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length > 0 ? (
            <div>Request listings will appear here</div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No requests yet</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                You haven't created any food requests yet.
              </p>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create your first request
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NgoDashboard;
