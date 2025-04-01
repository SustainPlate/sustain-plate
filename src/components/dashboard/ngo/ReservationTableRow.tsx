
import React from 'react';
import { format } from 'date-fns';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ReservationStatusBadge from './ReservationStatusBadge';
import { ReservedDonation } from './types/ReservationTypes';

interface ReservationTableRowProps {
  donation: ReservedDonation;
  onOpenCancelDialog: (donation: ReservedDonation) => void;
}

const ReservationTableRow: React.FC<ReservationTableRowProps> = ({
  donation,
  onOpenCancelDialog,
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <TableRow key={donation.id}>
      <TableCell className="font-medium">{donation.food_name}</TableCell>
      <TableCell>
        {donation.quantity} {donation.unit}
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
          {formatDate(donation.expiry_date)}
        </div>
      </TableCell>
      <TableCell>
        <ReservationStatusBadge status={donation.status} />
      </TableCell>
      <TableCell>{donation.reserved_at ? formatDate(donation.reserved_at) : 'N/A'}</TableCell>
      <TableCell className="text-right">
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onOpenCancelDialog(donation)}
          >
            <X className="h-4 w-4 text-red-500 mr-2" />
            Cancel
          </Button>
        </AlertDialogTrigger>
      </TableCell>
    </TableRow>
  );
};

export default ReservationTableRow;
