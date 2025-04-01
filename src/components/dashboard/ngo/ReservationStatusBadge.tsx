
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ReservationStatusBadgeProps {
  status: string;
}

const ReservationStatusBadge: React.FC<ReservationStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-500">Pending Pickup</Badge>;
    case 'in_transit':
      return <Badge className="bg-blue-500">In Transit</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default ReservationStatusBadge;
