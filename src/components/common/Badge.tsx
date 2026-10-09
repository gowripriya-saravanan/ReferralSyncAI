import React from 'react';
import type { ReferralStatus, UrgencyLevel } from '../../types/referral';

interface BadgeProps {
  status: ReferralStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, size = 'sm' }) => {
  const getBadgeStyle = (val: string) => {
    switch (val) {
      case 'Pending':
        return {
          container: 'bg-[#E9A23B]/10 text-[#B8771A] border-[#E9A23B]/30',
          dot: 'bg-[#E9A23B]',
        };
      case 'AI Recommended':
        return {
          container: 'bg-[#5B8DEF]/10 text-[#2C62CE] border-[#5B8DEF]/30',
          dot: 'bg-[#5B8DEF]',
        };
      case 'Doctor Approved':
        return {
          container: 'bg-[#176B87]/10 text-[#176B87] border-[#176B87]/30',
          dot: 'bg-[#176B87]',
        };
      case 'Hospital Accepted':
      case 'Accepted':
        return {
          container: 'bg-[#2E9D68]/10 text-[#1F7A4D] border-[#2E9D68]/30',
          dot: 'bg-[#2E9D68]',
        };
      case 'In Transfer':
      case 'In Progress':
        return {
          container: 'bg-[#5B8DEF]/10 text-[#2C62CE] border-[#5B8DEF]/30',
          dot: 'bg-[#5B8DEF] animate-pulse',
        };
      case 'Completed':
        return {
          container: 'bg-[#2A9D8F]/10 text-[#1B6F65] border-[#2A9D8F]/30',
          dot: 'bg-[#2A9D8F]',
        };
      case 'Rejected':
        return {
          container: 'bg-[#D9534F]/10 text-[#B83632] border-[#D9534F]/30',
          dot: 'bg-[#D9534F]',
        };
      default:
        return {
          container: 'bg-[#EDF5FA] text-[#60758A] border-[#DCE8F0]',
          dot: 'bg-[#60758A]',
        };
    }
  };

  const style = getBadgeStyle(status);
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border transition-all ${style.container} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
};

export const UrgencyBadge: React.FC<{ urgency: UrgencyLevel | string; size?: 'sm' | 'md' }> = ({
  urgency,
  size = 'sm',
}) => {
  const getStyle = () => {
    switch (urgency) {
      case 'Emergency':
        return 'bg-[#D9534F]/10 text-[#B83632] border-[#D9534F]/30 font-bold';
      case 'Urgent':
        return 'bg-[#E9A23B]/10 text-[#B8771A] border-[#E9A23B]/30 font-semibold';
      default:
        return 'bg-[#EDF5FA] text-[#176B87] border-[#DCE8F0] font-medium';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded-md border ${getStyle()} ${sizeClasses}`}>
      {urgency}
    </span>
  );
};
