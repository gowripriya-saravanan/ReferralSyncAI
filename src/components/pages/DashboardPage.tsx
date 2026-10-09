import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  ExternalLink,
  Building,
  BrainCircuit,
} from 'lucide-react';
import { StatusBadge } from '../common/Badge';

export const DashboardPage: React.FC = () => {
  const { referrals, navigateTo, startReferralForPatient } = useApp();
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter referrals
  const filteredReferrals = referrals.slice(0, 5).filter((item) => {
    const matchesStatus =
      statusFilter === 'All' || item.status === statusFilter;
    return matchesStatus;
  });

  const aiActivities = [
    {
      id: 'act-1',
      title: 'AI identified referral requirement',
      patientName: 'Arjun Kumar',
      patientId: 'PAT-2026-081',
      statusOrMatch: 'Analysis Complete',
      type: 'complete',
      timestamp: '12 mins ago',
      details: 'Identified refractory troponin elevation requiring emergency tertiary Cath Lab within 90 mins.',
    },
    {
      id: 'act-2',
      title: 'AI suggested suitable receiving facility',
      patientName: 'Priya Sharma',
      patientId: 'PAT-2026-079',
      statusOrMatch: 'Match: 94%',
      type: 'match',
      timestamp: '38 mins ago',
      details: 'Regional Neuro & Trauma Hospital matched with active 3T MRI, 24/7 Stroke Unit, and 4 Neuro-ICU beds.',
    },
    {
      id: 'act-3',
      title: 'Recommendation awaiting doctor review',
      patientName: 'Rahul Kumar',
      patientId: 'PAT-2026-075',
      statusOrMatch: 'Pending Review',
      type: 'review',
      timestamp: '1 hour ago',
      details: 'High-energy pelvic trauma transfer dossier ready for attending physician sign-off.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Quick Action Bar */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDF5FA] text-[#176B87] border border-[#DCE8F0]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E9D68] animate-pulse" />
              Live Coordination Hub
            </span>
            <span className="text-xs text-[#60758A] font-medium hidden md:inline">
              | Coimbatore Regional Network
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-[#17324D] tracking-tight">
            Referral Coordination Command Center
          </h2>
          <p className="text-xs sm:text-sm text-[#60758A] max-w-xl">
            Evaluate specialist, equipment, and facility requirements to coordinate patient transfers to verified receiving hospitals.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('new-referral')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#176B87] hover:bg-[#12566C] text-white font-semibold text-sm shadow-xs hover:shadow transition-all duration-150 cursor-pointer active:scale-[0.99]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Create New Referral</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Active Patients */}
        <div
          onClick={() => navigateTo('patients')}
          className="bg-white rounded-2xl p-5 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#60758A]">
                Active Patients
              </span>
              <div className="mt-2 text-3xl font-extrabold text-[#17324D] tracking-tight">
                24
              </div>
            </div>
            <div className="p-3 rounded-xl border bg-[#EDF5FA] text-[#176B87] border-[#DCE8F0] group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#DCE8F0] flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-[#176B87] bg-[#EDF5FA] px-2 py-0.5 rounded-full border border-[#DCE8F0]">
              <TrendingUp className="w-3 h-3 text-[#176B87]" />
              +3 new this shift
            </span>
            <span className="text-[11px] text-[#60758A]">8 in department</span>
          </div>
        </div>

        {/* Pending Referrals */}
        <div
          onClick={() => navigateTo('referrals')}
          className="bg-white rounded-2xl p-5 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#60758A]">
                Pending Referrals
              </span>
              <div className="mt-2 text-3xl font-extrabold text-[#17324D] tracking-tight">
                08
              </div>
            </div>
            <div className="p-3 rounded-xl border bg-[#E9A23B]/10 text-[#E9A23B] border-[#E9A23B]/30 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#DCE8F0] flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-[#B8771A] bg-[#E9A23B]/10 px-2 py-0.5 rounded-full border border-[#E9A23B]/30">
              <AlertTriangle className="w-3 h-3 text-[#E9A23B]" />
              2 urgent triage
            </span>
            <span className="text-[11px] text-[#60758A]">Awaiting action</span>
          </div>
        </div>

        {/* AI Recommendations */}
        <div
          onClick={() => navigateTo('ai-assistant')}
          className="bg-white rounded-2xl p-5 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#60758A]">
                AI Recommendations
              </span>
              <div className="mt-2 text-3xl font-extrabold text-[#17324D] tracking-tight">
                15
              </div>
            </div>
            <div className="p-3 rounded-xl border bg-[#F0F6FE] text-[#5B8DEF] border-[#5B8DEF]/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#DCE8F0] flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-[#2C62CE] bg-[#F0F6FE] px-2 py-0.5 rounded-full border border-[#5B8DEF]/30">
              <TrendingUp className="w-3 h-3 text-[#5B8DEF]" />
              94% avg match
            </span>
            <span className="text-[11px] text-[#60758A]">Verified capability</span>
          </div>
        </div>

        {/* Completed Referrals */}
        <div
          onClick={() => navigateTo('analytics')}
          className="bg-white rounded-2xl p-5 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#60758A]">
                Completed Referrals
              </span>
              <div className="mt-2 text-3xl font-extrabold text-[#17324D] tracking-tight">
                32
              </div>
            </div>
            <div className="p-3 rounded-xl border bg-[#2A9D8F]/10 text-[#2A9D8F] border-[#2A9D8F]/30 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-5 h-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#DCE8F0] flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1 font-semibold text-[#1B6F65] bg-[#2A9D8F]/10 px-2 py-0.5 rounded-full border border-[#2A9D8F]/30">
              <TrendingUp className="w-3 h-3 text-[#2A9D8F]" />
              +18% this month
            </span>
            <span className="text-[11px] text-[#60758A]">100% handover</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Referrals & AI Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Referrals Table */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-[#DCE8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#17324D] tracking-tight">
                  Recent Referrals
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#EDF5FA] text-[#176B87] border border-[#DCE8F0]">
                  {referrals.length} active
                </span>
              </div>
              <p className="text-xs text-[#60758A] mt-0.5">
                Real-time tracking of patient transfers across receiving network
              </p>
            </div>

            <div className="flex items-center gap-2">
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

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EDF5FA]/60 border-b border-[#DCE8F0] text-[11px] font-bold uppercase tracking-wider text-[#60758A]">
                  <th className="py-3 px-5">Patient</th>
                  <th className="py-3 px-5">Patient ID</th>
                  <th className="py-3 px-5">Current Hospital</th>
                  <th className="py-3 px-5">Receiving Hospital</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE8F0] text-sm">
                {filteredReferrals.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => navigateTo('referral-details', { referralId: item.id })}
                    className="hover:bg-[#F4F8FC]/80 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-[#17324D] group-hover:text-[#176B87] transition-colors flex items-center gap-1.5">
                        {item.patientName}
                        <ExternalLink className="w-3 h-3 text-[#60758A] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-[11px] text-[#60758A] font-normal">
                        {item.requiredSpecialty}
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#EDF5FA] text-[#17324D] border border-[#DCE8F0]">
                        {item.id}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5 text-xs text-[#60758A]">
                        <Building className="w-3.5 h-3.5 text-[#60758A] shrink-0" />
                        <span className="truncate max-w-[140px] text-[#17324D] font-medium">{item.currentHospital}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5 text-xs text-[#17324D] font-semibold">
                        <ArrowRight className="w-3.5 h-3.5 text-[#176B87] shrink-0" />
                        <span className="truncate max-w-[150px]">{item.receivingHospital}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="py-3.5 px-5 text-right text-xs text-[#60758A] whitespace-nowrap">
                      {item.createdDate.split(' ')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-[#EDF5FA]/40 border-t border-[#DCE8F0] flex items-center justify-between text-xs">
            <button
              onClick={() => navigateTo('referrals')}
              className="text-[#176B87] hover:text-[#12566C] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View all active & completed referrals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[#60758A] text-[11px]">Regional coordination network</span>
          </div>
        </div>

        {/* AI Activity Section */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#DCE8F0] mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#F0F6FE] border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#17324D] tracking-tight flex items-center gap-1.5">
                  Recent AI Referral Activity
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#F0F6FE] text-[#5B8DEF] border border-[#5B8DEF]/30">
                    LIVE
                  </span>
                </h3>
                <p className="text-[11px] text-[#60758A]">
                  Autonomous capability matching insights
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            {aiActivities.map((act) => (
              <div
                key={act.id}
                onClick={() => {
                  startReferralForPatient(act.patientId);
                }}
                className="p-3.5 rounded-xl border border-[#DCE8F0] bg-[#F4F8FC] hover:bg-[#F0F6FE] hover:border-[#5B8DEF]/40 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-xs font-bold text-[#17324D] group-hover:text-[#176B87] transition-colors">
                    {act.title}
                  </h4>
                  <span className="text-[10px] text-[#60758A] shrink-0">{act.timestamp}</span>
                </div>

                <div className="flex items-center gap-2 my-1.5">
                  <span className="text-xs font-semibold text-[#17324D] bg-white px-2 py-0.5 rounded border border-[#DCE8F0]">
                    Patient: {act.patientName}
                  </span>
                  <span className="text-xs font-bold text-[#2C62CE] bg-[#F0F6FE] px-2 py-0.5 rounded border border-[#5B8DEF]/30">
                    {act.statusOrMatch}
                  </span>
                </div>

                <p className="text-[11px] text-[#60758A] leading-relaxed mt-1">
                  {act.details}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#DCE8F0] text-center">
            <button
              onClick={() => navigateTo('ai-assistant')}
              className="text-xs font-semibold text-[#5B8DEF] hover:text-[#2C62CE] inline-flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Referral Assistant about facilities</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
