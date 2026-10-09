import React from 'react';
import type { AiActivityRecord } from '../../types/dashboard';
import {
  Sparkles,
  CheckCircle,
  Clock,
  UserCheck,
  BrainCircuit,
  Zap,
} from 'lucide-react';

interface AiActivityFeedProps {
  activities: AiActivityRecord[];
  onSelectActivity?: (activity: AiActivityRecord) => void;
}

export const AiActivityFeed: React.FC<AiActivityFeedProps> = ({
  activities,
  onSelectActivity,
}) => {
  const getBadgeStyle = (record: AiActivityRecord) => {
    switch (record.type) {
      case 'analysis_complete':
        return {
          pill: 'bg-[#F0F6FE] text-[#2C62CE] border-[#5B8DEF]/30 font-semibold',
          icon: CheckCircle,
          iconColor: 'text-[#5B8DEF]',
        };
      case 'match_suggestion':
        return {
          pill: 'bg-[#2E9D68]/10 text-[#1F7A4D] border-[#2E9D68]/30 font-semibold',
          icon: Zap,
          iconColor: 'text-[#2E9D68]',
        };
      case 'pending_review':
        return {
          pill: 'bg-[#E9A23B]/10 text-[#B8771A] border-[#E9A23B]/30 font-semibold',
          icon: Clock,
          iconColor: 'text-[#E9A23B]',
        };
      default:
        return {
          pill: 'bg-[#EDF5FA] text-[#176B87] border-[#DCE8F0]',
          icon: Sparkles,
          iconColor: 'text-[#176B87]',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-5 sm:p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DCE8F0] mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#F0F6FE] border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#17324D] tracking-tight flex items-center gap-1.5">
              Recent AI Referral Activity
              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#F0F6FE] text-[#5B8DEF] border border-[#5B8DEF]/30">
                LIVE
              </span>
            </h2>
            <p className="text-[11px] text-[#60758A]">
              Autonomous clinical insights & capacity matching
            </p>
          </div>
        </div>
      </div>

      {/* Activity Items List */}
      <div className="space-y-3.5 flex-1">
        {activities.map((item) => {
          const badgeConfig = getBadgeStyle(item);
          const BadgeIcon = badgeConfig.icon;

          return (
            <div
              key={item.id}
              onClick={() => onSelectActivity?.(item)}
              className="p-3.5 rounded-xl border border-[#DCE8F0] bg-[#F4F8FC] hover:bg-[#F0F6FE] hover:border-[#5B8DEF]/40 transition-all duration-200 cursor-pointer group"
            >
              {/* Top row: Title and time */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="text-xs sm:text-sm font-semibold text-[#17324D] group-hover:text-[#176B87] transition-colors leading-snug">
                  {item.title}
                </h3>
                <span className="text-[11px] text-[#60758A] whitespace-nowrap shrink-0">
                  {item.timestamp}
                </span>
              </div>

              {/* Patient and Status/Match Row */}
              <div className="flex flex-wrap items-center gap-2 my-2">
                {/* Patient Pill */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white border border-[#DCE8F0] text-xs text-[#17324D]">
                  <UserCheck className="w-3 h-3 text-[#60758A]" />
                  <span className="font-medium text-[#60758A]">Patient:</span>
                  <span className="font-bold text-[#17324D]">{item.patientName}</span>
                </div>

                {/* Status or Match Pill */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border text-xs ${badgeConfig.pill}`}
                >
                  <BadgeIcon className={`w-3 h-3 ${badgeConfig.iconColor}`} />
                  <span>{item.statusOrMatch}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#60758A] leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
