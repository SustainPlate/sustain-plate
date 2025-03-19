
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Calendar, Clock } from 'lucide-react';

const VolunteerDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [deliveries, setDeliveries] = useState<any[]>([]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Volunteer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.full_name || 'Volunteer'}
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Search className="h-4 w-4" />
          Find Opportunities
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Scheduled Pickups</CardTitle>
            <CardDescription>Upcoming food transport tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Completed Deliveries</CardTitle>
            <CardDescription>Your contribution so far</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Volunteer Hours</CardTitle>
            <CardDescription>Total time contributed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Deliveries</CardTitle>
          <CardDescription>Your scheduled pickup and delivery tasks</CardDescription>
        </CardHeader>
        <CardContent>
          {deliveries.length > 0 ? (
            <div>Scheduled deliveries will appear here</div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium">No scheduled deliveries</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">
                You don't have any upcoming delivery assignments.
              </p>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" />
                Find delivery opportunities
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerDashboard;
