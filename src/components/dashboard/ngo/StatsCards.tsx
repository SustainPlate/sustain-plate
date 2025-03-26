
import React from 'react';
import StatsCard from './StatsCard';

interface StatsCardsProps {
  stats: {
    available: number;
    reserved: number;
    completed: number;
  };
  loading: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Available Donations"
        description="Donations ready to be claimed"
        value={stats.available}
        loading={loading}
      />
      <StatsCard
        title="Reserved Items"
        description="Donations you've reserved"
        value={stats.reserved}
        loading={loading}
      />
      <StatsCard
        title="Completed Donations"
        description="Successfully received items"
        value={stats.completed}
        loading={loading}
      />
    </div>
  );
};

export default StatsCards;
