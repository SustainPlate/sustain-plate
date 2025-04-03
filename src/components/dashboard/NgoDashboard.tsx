
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Search, RefreshCw, AlertCircle } from 'lucide-react';
import StatsCards from './ngo/StatsCards';
import DonationTable from './ngo/DonationTable';
import ReservationDialog from './ngo/ReservationDialog';
import MyReservations from './ngo/MyReservations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAvailableDonations } from './ngo/hooks/useAvailableDonations';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { Donation } from './ngo/types/DonationTypes';

const NgoDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  
  const {
    donations,
    isLoading,
    isRefetching,
    reservingDonation,
    reservationLoading,
    reservationError,
    handleReserveDonation,
    refetchDonations
  } = useAvailableDonations();

  const openReservationConfirm = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowConfirmDialog(true);
  };

  const confirmReservation = async (donationId: string) => {
    const success = await handleReserveDonation(donationId);
    if (success) {
      setShowConfirmDialog(false);
    }
  };

  // Handle refetch with a proper click handler function
  const handleRefetchClick = () => {
    refetchDonations();
  };

  // Calculate stats based on current donations data
  const stats = {
    available: donations?.length || 0,
    reserved: 0,  // This would need to be fetched separately
    completed: 0  // This would need to be fetched separately
  };

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
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleRefetchClick}
            disabled={isRefetching}
          >
            {isRefetching ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            {isRefetching ? "Refreshing..." : "Browse Donations"}
          </Button>
        </div>
      </div>

      {reservationError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{reservationError}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <StatsCards stats={stats} loading={isLoading} />

      {/* Tabs for Available Donations and My Reservations */}
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="available">Available Donations</TabsTrigger>
          <TabsTrigger value="reservations">My Reservations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available">
          <Card>
            <CardHeader>
              <CardTitle>Available Donations</CardTitle>
              <CardDescription>Browse and reserve available food donations</CardDescription>
            </CardHeader>
            <CardContent>
              <DonationTable 
                donations={donations || []} 
                loading={isLoading || isRefetching} 
                reservingDonation={reservingDonation}
                onReserve={openReservationConfirm}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reservations">
          <Card>
            <CardHeader>
              <CardTitle>My Reservations</CardTitle>
              <CardDescription>Manage your reserved food donations</CardDescription>
            </CardHeader>
            <CardContent>
              <MyReservations />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reservation Confirmation Dialog */}
      <ReservationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        selectedDonation={selectedDonation}
        reservationLoading={reservationLoading}
        onConfirm={confirmReservation}
      />
    </div>
  );
};

export default NgoDashboard;
