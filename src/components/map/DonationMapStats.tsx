
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DonationLocation {
  id: string;
  locationType: 'pickup' | 'delivery';
  address: string;
  foodName?: string;
  status: string;
  timestamp: string;
}

interface DonationMapStatsProps {
  donationLocations: DonationLocation[];
}

const DonationMapStats: React.FC<DonationMapStatsProps> = ({ donationLocations }) => {
  // Calculate statistics
  const stats = useMemo(() => {
    const pickups = donationLocations.filter(loc => loc.locationType === 'pickup');
    const deliveries = donationLocations.filter(loc => loc.locationType === 'delivery');
    
    const statusCounts = donationLocations.reduce((acc, loc) => {
      acc[loc.status] = (acc[loc.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value
    }));
    
    return {
      total: donationLocations.length,
      pickups: pickups.length,
      deliveries: deliveries.length,
      statusData
    };
  }, [donationLocations]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Donation Stats</CardTitle>
          <CardDescription>Current donation and delivery statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-green-600 text-sm font-medium">Pickups</p>
              <p className="text-3xl font-bold">{stats.pickups}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-blue-600 text-sm font-medium">Deliveries</p>
              <p className="text-3xl font-bold">{stats.deliveries}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status Breakdown</CardTitle>
          <CardDescription>Donation status distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ChartContainer
              config={{
                status: {
                  label: "Status"
                }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {stats.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2">
            {stats.statusData.map((status, index) => (
              <div key={status.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm capitalize">{status.name}</span>
                </div>
                <span className="text-sm font-medium">{status.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DonationMapStats;
