import React from 'react';
import { Users, Clock, Sparkles, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import type { OverviewCardData } from '../../types/dashboard';

interface StatCardProps {
  card: OverviewCardData;
}

export const StatCard: React.FC<StatCardProps> = ({ card }) => {
  const getIconConfig = (type: OverviewCardData['icon']) => {
    switch (type) {
      case 'patients':
        return {
          icon: Users,
          bg: 'bg-[#EDF5FA] text-[#176B87] border-[#DCE8F0]',
          accent: 'hover:border-[#176B87]/40',
        };
      case 'pending':
        return {
          icon: Clock,
          bg: 'bg-[#E9A23B]/10 text-[#E9A23B] border-[#E9A23B]/30',
          accent: 'hover:border-[#E9A23B]/40',
        };
      case 'ai':
        return {
          icon: Sparkles,
          bg: 'bg-[#F0F6FE] text-[#5B8DEF] border-[#5B8DEF]/30',
          accent: 'hover:border-[#5B8DEF]/40',
        };
      case 'completed':
        return {
          icon: CheckCircle2,
          bg: 'bg-[#2A9D8F]/10 text-[#2A9D8F] border-[#2A9D8F]/30',
          accent: 'hover:border-[#2A9D8F]/40',
        };
    }
  };

  const { icon: Icon, bg, accent } = getIconConfig(card.icon);

  return (
    <div
      className={`bg-white rounded-2xl p-5 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] hover:shadow-md transition-all duration-200 group relative overflow-hidden ${accent}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#60758A]">
            {card.title}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#17324D] tracking-tight">
              {card.value}
            </span>
          </div>
        </div>

        <div className={`p-3 rounded-xl border ${bg} transition-transform group-hover:scale-105 duration-200`}>
          <Icon className="w-5 h-5 stroke-[2]" />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#DCE8F0] flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {card.changeType === 'urgent' ? (
            <span className="inline-flex items-center gap-1 font-semibold text-[#B8771A] bg-[#E9A23B]/10 px-2 py-0.5 rounded-full border border-[#E9A23B]/30">
              <AlertTriangle className="w-3 h-3 text-[#E9A23B]" />
              {card.change}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-semibold text-[#176B87] bg-[#EDF5FA] px-2 py-0.5 rounded-full border border-[#DCE8F0]">
              <TrendingUp className="w-3 h-3 text-[#176B87]" />
              {card.change}
            </span>
          )}
        </div>
        <span className="text-[11px] text-[#60758A] font-medium hidden sm:inline">
          Live metric
        </span>
      </div>
    </div>
  );
};
