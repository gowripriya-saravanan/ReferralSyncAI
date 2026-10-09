import React from 'react';
import type { OverviewCardData } from '../../types/dashboard';
import { StatCard } from './StatCard';

interface StatsGridProps {
  cards: OverviewCardData[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => (
        <StatCard key={card.id} card={card} />
      ))}
    </div>
  );
};

