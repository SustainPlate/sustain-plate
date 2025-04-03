
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Loader2, Package } from 'lucide-react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Donation } from './types/DonationTypes';

interface DonationTableProps {
  donations: Donation[];
  loading: boolean;
  reservingDonation: string | null;
  onReserve: (donation: Donation) => void;
}

const DonationTable: React.FC<DonationTableProps> = ({ 
  donations, 
  loading, 
  reservingDonation, 
  onReserve 
}) => {
  // Helper function to format the date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!donations || donations.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium">No donations available</h3>
        <p className="text-sm text-gray-500 mt-1">
          There are currently no food donations available. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Food Item</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Expiry Date</TableHead>
            <TableHead>Pickup Address</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.map((donation) => (
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
              <TableCell className="max-w-xs truncate" title={donation.pickup_address}>
                {donation.pickup_address || 'No address provided'}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onReserve(donation)}
                  disabled={!!reservingDonation}
                >
                  {reservingDonation === donation.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Reserving...
                    </>
                  ) : (
                    'Reserve'
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DonationTable;
