
import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Donation } from './DonationTable';

interface ReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDonation: Donation | null;
  reservationLoading: boolean;
  onConfirm: (donationId: string) => void;
}

const ReservationDialog: React.FC<ReservationDialogProps> = ({
  open,
  onOpenChange,
  selectedDonation,
  reservationLoading,
  onConfirm,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Reservation</AlertDialogTitle>
          <AlertDialogDescription>
            {selectedDonation && (
              <>
                <p>
                  Are you sure you want to reserve {selectedDonation.quantity} {selectedDonation.unit} of {selectedDonation.food_name}?
                </p>
                <p className="mt-2">
                  By reserving this donation, you commit to arranging pickup from the specified address.
                </p>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={reservationLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => selectedDonation && onConfirm(selectedDonation.id)}
            disabled={reservationLoading}
          >
            {reservationLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reserving...
              </>
            ) : (
              'Confirm Reservation'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReservationDialog;
