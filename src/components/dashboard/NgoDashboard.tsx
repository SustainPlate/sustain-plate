
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import NgoDashboardContent from './ngo/NgoDashboardContent';
import { useAvailableDonations } from './ngo/hooks/useAvailableDonations';

const NgoDashboard: React.FC = () => {
  const { fetchAvailableDonations } = useAvailableDonations();

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Button variant="outline" className="gap-2" onClick={fetchAvailableDonations}>
          <Search className="h-4 w-4" />
          Browse Donations
        </Button>
      </div>
      
      <NgoDashboardContent />
    </div>
  );
};

export default NgoDashboard;
