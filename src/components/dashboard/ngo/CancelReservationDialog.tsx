
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
import { ReservedDonation } from './types/ReservationTypes';

interface CancelReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDonation: ReservedDonation | null;
  cancellingDonation: string | null;
  onCancel: (donationId: string) => void;
}

const CancelReservationDialog: React.FC<CancelReservationDialogProps> = ({
  open,
  onOpenChange,
  selectedDonation,
  cancellingDonation,
  onCancel,
}) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
        <AlertDialogDescription>
          {selectedDonation && (
            <>
              Are you sure you want to cancel your reservation for "{selectedDonation.food_name}"? 
              This will make the donation available to other NGOs.
            </>
          )}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => selectedDonation && onCancel(selectedDonation.id)}
          className="bg-red-500 hover:bg-red-600"
          disabled={cancellingDonation === selectedDonation?.id}
        >
          {cancellingDonation === selectedDonation?.id ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cancelling...
            </>
          ) : (
            "Cancel Reservation"
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default CancelReservationDialog;
