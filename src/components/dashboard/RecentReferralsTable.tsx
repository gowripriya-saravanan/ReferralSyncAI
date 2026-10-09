import React, { useState } from 'react';
import type { ReferralRecord } from '../../types/dashboard';
import { StatusBadge } from '../common/Badge';
import { ArrowRight, ExternalLink, Calendar, Building } from 'lucide-react';

interface RecentReferralsTableProps {
  referrals: ReferralRecord[];
  onViewDetails?: (referral: ReferralRecord) => void;
  searchFilter?: string;
}

export const RecentReferralsTable: React.FC<RecentReferralsTableProps> = ({
  referrals,
  onViewDetails,
  searchFilter = '',
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Filter referrals based on search query and status filter tab
  const filteredReferrals = referrals.filter((item) => {
    const matchesSearch =
      !searchFilter ||
      item.patientName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.patientId.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.currentHospital.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.receivingHospital.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] overflow-hidden">
      {/* Header Bar */}
      <div className="p-5 sm:p-6 border-b border-[#DCE8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#17324D] tracking-tight">
              Recent Referrals
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EDF5FA] text-[#176B87] border border-[#DCE8F0]">
              {filteredReferrals.length} active records
            </span>
          </div>
          <p className="text-xs text-[#60758A] mt-0.5">
            Real-time patient transfer coordination and receiving facility acceptance
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center p-1 bg-[#EDF5FA] rounded-xl text-xs font-medium text-[#60758A] border border-[#DCE8F0]">
            {['All', 'Pending', 'In Transfer', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-white text-[#176B87] font-bold shadow-xs border border-[#DCE8F0]'
                    : 'text-[#60758A] hover:text-[#17324D]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#EDF5FA]/60 border-b border-[#DCE8F0] text-[11px] font-bold uppercase tracking-wider text-[#60758A]">
              <th className="py-3.5 px-6">Patient</th>
              <th className="py-3.5 px-6">Patient ID</th>
              <th className="py-3.5 px-6">Current Hospital</th>
              <th className="py-3.5 px-6">Receiving Hospital</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCE8F0] text-sm">
            {filteredReferrals.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-[#60758A] text-sm">
                  No referrals match the current search or filter.
                </td>
              </tr>
            ) : (
              filteredReferrals.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onViewDetails?.(item)}
                  className="hover:bg-[#F4F8FC]/80 transition-colors group cursor-pointer"
                >
                  {/* Patient Name & details */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#EDF5FA] text-[#176B87] font-bold flex items-center justify-center text-xs group-hover:bg-[#176B87] group-hover:text-white transition-colors border border-[#DCE8F0]">
                        {item.patientName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <div className="font-semibold text-[#17324D] group-hover:text-[#176B87] transition-colors flex items-center gap-1.5">
                          {item.patientName}
                          <ExternalLink className="w-3 h-3 text-[#60758A] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        {item.specialty && (
                          <div className="text-[11px] text-[#60758A] font-normal">
                            {item.specialty}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Patient ID */}
                  <td className="py-4 px-6">
                    <span className="font-mono text-xs font-semibold px-2 py-1 rounded-md bg-[#EDF5FA] text-[#17324D] border border-[#DCE8F0]">
                      {item.patientId}
                    </span>
                  </td>

                  {/* Current Hospital */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-[#60758A]">
                      <Building className="w-3.5 h-3.5 text-[#60758A] shrink-0" />
                      <span className="text-xs font-medium text-[#17324D]">
                        {item.currentHospital}
                      </span>
                    </div>
                  </td>

                  {/* Receiving Hospital */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-[#60758A]">
                      <ArrowRight className="w-3.5 h-3.5 text-[#176B87] shrink-0" />
                      <span className="text-xs font-semibold text-[#17324D]">
                        {item.receivingHospital}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6">
                    <StatusBadge status={item.status} />
                  </td>

                  {/* Date */}
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-1.5 text-xs text-[#60758A] font-medium">
                      <Calendar className="w-3 h-3 text-[#60758A]" />
                      {item.date}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info bar */}
      <div className="px-6 py-3 bg-[#EDF5FA]/40 border-t border-[#DCE8F0] flex items-center justify-between text-xs text-[#60758A]">
        <span>Showing 5 recent patient transfers</span>
        <span className="text-[#60758A] font-medium">Auto-synced with regional triage net</span>
      </div>
    </div>
  );
};
