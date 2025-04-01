
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { AlertDialog } from "@/components/ui/alert-dialog";
import { useReservations } from './hooks/useReservations';
import { ReservedDonation } from './types/ReservationTypes';
import ReservationTableRow from './ReservationTableRow';
import CancelReservationDialog from './CancelReservationDialog';

const MyReservations: React.FC = () => {
  const { 
    reservedDonations, 
    isLoading, 
    cancellingDonation,
    setCancellingDonation,
    handleCancelReservation 
  } = useReservations();
  
  const [selectedDonation, setSelectedDonation] = useState<ReservedDonation | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const openCancelConfirm = (donation: ReservedDonation) => {
    setSelectedDonation(donation);
    setShowConfirmDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!reservedDonations || reservedDonations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You haven't reserved any donations yet.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Food Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reserved On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservedDonations.map((donation) => (
              <AlertDialog open={showConfirmDialog && selectedDonation?.id === donation.id} onOpenChange={setShowConfirmDialog} key={donation.id}>
                <ReservationTableRow 
                  donation={donation} 
                  onOpenCancelDialog={openCancelConfirm} 
                />
                <CancelReservationDialog 
                  open={showConfirmDialog && selectedDonation?.id === donation.id}
                  onOpenChange={setShowConfirmDialog}
                  selectedDonation={selectedDonation}
                  cancellingDonation={cancellingDonation}
                  onCancel={handleCancelReservation}
                />
              </AlertDialog>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MyReservations;
