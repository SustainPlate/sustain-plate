
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Donation } from './types/DonationTypes';

interface ReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donation: Donation | null;
  onSuccess: () => void;
}

const ReservationDialog: React.FC<ReservationDialogProps> = ({
  open,
  onOpenChange,
  donation,
  onSuccess,
}) => {
  const [isReserving, setIsReserving] = useState(false);
  const { toast } = useToast();

  const handleReserve = async () => {
    if (!donation) return;
    
    setIsReserving(true);
    
    try {
      // Try the RPC function first for best reliability
      const { data, error } = await supabase.rpc('reserve_donation', {
        donation_id: donation.id,
        ngo_id: (await supabase.auth.getUser()).data.user?.id
      });
      
      if (error) {
        console.error('Error reserving donation using RPC:', error);
        throw error;
      }
      
      if (data === true) {
        toast({
          title: 'Reservation Successful',
          description: `You have successfully reserved "${donation.food_name}"`,
        });
        onSuccess();
        onOpenChange(false);
      } else {
        toast({
          title: 'Reservation Failed',
          description: 'Unable to reserve this donation. It may have already been reserved.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Exception during reservation:', error);
      toast({
        title: 'Error',
        description: error.message || 'An error occurred during reservation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsReserving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Reservation</DialogTitle>
          <DialogDescription>
            Are you sure you want to reserve this food donation?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <h3 className="font-medium">Donation Details</h3>
          <dl className="mt-2 divide-y divide-gray-100 border-t border-b">
            <div className="flex justify-between py-2">
              <dt className="text-sm font-medium text-gray-500">Food Item</dt>
              <dd className="text-sm text-gray-900">{donation?.food_name}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-sm font-medium text-gray-500">Quantity</dt>
              <dd className="text-sm text-gray-900">{donation?.quantity} {donation?.unit}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
              <dd className="text-sm text-gray-900">
                {donation?.expiry_date ? new Date(donation.expiry_date).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isReserving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleReserve}
            disabled={isReserving}
          >
            {isReserving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reserving...
              </>
            ) : (
              'Confirm Reservation'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDialog;
