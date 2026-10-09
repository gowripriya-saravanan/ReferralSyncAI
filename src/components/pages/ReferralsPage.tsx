import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Plus } from 'lucide-react';
import { StatusBadge } from '../common/Badge';

export const ReferralsPage: React.FC = () => {
  const { referrals, navigateTo, isReceivingDoctor } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredReferrals = referrals.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.currentHospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.receivingHospital.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Pending' && item.status === 'Pending') ||
      (statusFilter === 'Approved' && item.status === 'Doctor Approved') ||
      (statusFilter === 'Accepted' && (item.status === 'Hospital Accepted' || item.status === 'Accepted')) ||
      (statusFilter === 'In Transfer' && (item.status === 'In Transfer' || item.status === 'In Progress')) ||
      (statusFilter === 'Completed' && item.status === 'Completed') ||
      (statusFilter === 'Rejected' && item.status === 'Rejected');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#17324D] tracking-tight">
            Referral Coordination Management
          </h2>
          <p className="text-xs text-[#60758A]">
            Audit logs and transmission status across all regional hospital transfer records.
          </p>
        </div>

        {isReceivingDoctor ? (
          <button
            onClick={() => navigateTo('receiving-dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#176B87] hover:bg-[#12566C] text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <span>View Incoming Triage Queue</span>
          </button>
        ) : (
          <button
            onClick={() => navigateTo('new-referral')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#176B87] hover:bg-[#12566C] text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Referral Intake</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#60758A]" />
          <input
            type="text"
            placeholder="Search by ID, patient, hospital..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white text-xs text-[#17324D] placeholder-[#60758A]/60 rounded-xl border border-[#C9DCE8] focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center p-1 bg-[#EDF5FA] rounded-xl text-xs font-medium text-[#60758A]">
            {['All', 'Pending', 'Approved', 'Accepted', 'In Transfer', 'Completed', 'Rejected'].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === tab
                      ? 'bg-[#176B87] text-white font-semibold shadow-xs'
                      : 'text-[#60758A] hover:text-[#17324D]'
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Referrals Table */}
      <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F8FC] border-b border-[#DCE8F0] text-[11px] font-bold uppercase tracking-wider text-[#60758A]">
                <th className="py-3 px-5">Referral ID</th>
                <th className="py-3 px-5">Patient</th>
                <th className="py-3 px-4">Current Hospital</th>
                <th className="py-3 px-4">Receiving Hospital</th>
                <th className="py-3 px-4">AI Rec Score</th>
                <th className="py-3 px-4">Doctor Approval</th>
                <th className="py-3 px-4">Hospital Response</th>
                <th className="py-3 px-4">Transfer Status</th>
                <th className="py-3 px-5 text-right">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE8F0] text-xs">
              {filteredReferrals.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#60758A]">
                    No referrals found for this filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReferrals.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigateTo('referral-details', { referralId: item.id })}
                    className="hover:bg-[#F4F8FC] transition-colors group cursor-pointer"
                  >
                    {/* Referral ID */}
                    <td className="py-3.5 px-5">
                      <span className="font-mono font-bold text-[#176B87] bg-[#EDF5FA] px-2 py-0.5 rounded border border-[#C9DCE8]">
                        {item.id}
                      </span>
                    </td>

                    {/* Patient */}
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-[#17324D] group-hover:text-[#176B87] transition-colors">
                        {item.patientName}
                      </div>
                      <div className="text-[11px] text-[#60758A] font-normal">
                        {item.requiredSpecialty}
                      </div>
                    </td>

                    {/* Current Hospital */}
                    <td className="py-3.5 px-4 text-[#60758A] max-w-[140px] truncate">
                      {item.currentHospital}
                    </td>

                    {/* Receiving Hospital */}
                    <td className="py-3.5 px-4 font-medium text-[#17324D] max-w-[160px] truncate">
                      {item.receivingHospital}
                    </td>

                    {/* AI Rec Score */}
                    <td className="py-3.5 px-4">
                      {item.aiRecommendationScore ? (
                        <span className="text-xs font-bold text-[#176B87] bg-[#EDF5FA] px-2 py-0.5 rounded-full border border-[#C9DCE8]">
                          {item.aiRecommendationScore}% Match
                        </span>
                      ) : (
                        <span className="text-[#60758A]">—</span>
                      )}
                    </td>

                    {/* Doctor Approval */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold ${
                          item.doctorApprovalStatus.includes('Approved')
                            ? 'text-[#2E9D68]'
                            : 'text-[#E9A23B]'
                        }`}
                      >
                        {item.doctorApprovalStatus}
                      </span>
                    </td>

                    {/* Hospital Response */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          item.hospitalResponse === 'Accepted'
                            ? 'bg-[#2E9D68]/10 text-[#2E9D68] border border-[#2E9D68]/30'
                            : item.hospitalResponse === 'Reviewing Beds'
                            ? 'bg-[#5B8DEF]/10 text-[#176B87] border border-[#5B8DEF]/30'
                            : 'bg-[#E9A23B]/10 text-[#E9A23B] border border-[#E9A23B]/30'
                        }`}
                      >
                        {item.hospitalResponse}
                      </span>
                    </td>

                    {/* Transfer Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-5 text-right text-[#60758A] whitespace-nowrap">
                      {item.createdDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#F4F8FC] border-t border-[#DCE8F0] flex items-center justify-between text-xs text-[#60758A]">
          <span>Showing {filteredReferrals.length} of {referrals.length} total referrals</span>
          <span className="text-[11px] text-[#60758A]">Click any row to open full timeline & tracking</span>
        </div>
      </div>
    </div>
  );
};

