import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { referrals } = useApp();

  const totalReferrals = referrals.length + 32; // Includes historical demo data
  const completedCount = referrals.filter((r) => r.status === 'Completed').length + 30;
  const pendingCount = referrals.filter((r) => r.status === 'Pending' || r.doctorApprovalStatus === 'Pending Review').length + 2;

  const statusDistribution = [
    { label: 'Completed', count: 32, percentage: '52%', color: 'bg-[#2E9D68]' },
    { label: 'In Transfer', count: 8, percentage: '14%', color: 'bg-[#5B8DEF]' },
    { label: 'Hospital Accepted', count: 11, percentage: '18%', color: 'bg-[#2A9D8F]' },
    { label: 'Doctor Approved', count: 6, percentage: '10%', color: 'bg-[#176B87]' },
    { label: 'Pending Review', count: 4, percentage: '6%', color: 'bg-[#E9A23B]' },
  ];

  const monthlyTrends = [
    { month: 'May', count: 18, height: '45%' },
    { month: 'Jun', count: 24, height: '60%' },
    { month: 'Jul', count: 29, height: '72%' },
    { month: 'Aug', count: 34, height: '85%' },
    { month: 'Sep', count: 38, height: '95%' },
    { month: 'Oct (MTD)', count: 26, height: '65%' },
  ];

  const hospitalDestinationRankings = [
    { name: 'Regional Neuro & Trauma Hospital', referrals: 24, matchRate: '94%', beds: '4 Neuro-ICU' },
    { name: 'Coimbatore Advanced Care Hospital', referrals: 19, matchRate: '91%', beds: '6 Medical-ICU' },
    { name: 'Kongu Heart & Emergency Hospital', referrals: 15, matchRate: '96%', beds: '3 CCU' },
    { name: 'Kovai Multispeciality Centre', referrals: 8, matchRate: '86%', beds: '1 Resp-ICU' },
    { name: 'Western Ghats Medical Institute', referrals: 5, matchRate: '92%', beds: '2 Onco-ICU' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#17324D] tracking-tight">
            Referral Velocity & Clinical Network Analytics
          </h2>
          <p className="text-xs text-[#60758A]">
            Performance indicators for regional referral handovers, response latency, and facility matching concordance.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#EDF5FA] border border-[#C9DCE8] text-[#176B87] w-fit flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#176B87]" />
          <span>Synthetic Audit Dataset (Demo Mode)</span>
        </span>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#60758A] block">
            Total Referrals
          </span>
          <div className="text-2xl font-extrabold text-[#17324D] mt-1">
            {totalReferrals}
          </div>
          <span className="text-[11px] font-semibold text-[#176B87] mt-1 block">+12% vs last mo</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#60758A] block">
            Completed
          </span>
          <div className="text-2xl font-extrabold text-[#2E9D68] mt-1">
            {completedCount}
          </div>
          <span className="text-[11px] text-[#60758A] mt-1 block">100% transfer handoff</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#60758A] block">
            Pending Triage
          </span>
          <div className="text-2xl font-extrabold text-[#E9A23B] mt-1">
            0{pendingCount}
          </div>
          <span className="text-[11px] text-[#E9A23B] font-semibold mt-1 block">Awaiting sign-off</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#60758A] block">
            Avg Coordination
          </span>
          <div className="text-2xl font-extrabold text-[#17324D] mt-1">
            18<span className="text-xs font-normal text-[#60758A]"> mins</span>
          </div>
          <span className="text-[11px] text-[#176B87] font-semibold mt-1 block">42m faster than baseline</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#60758A] block">
            AI Recommendations
          </span>
          <div className="text-2xl font-extrabold text-[#176B87] mt-1">
            48
          </div>
          <span className="text-[11px] text-[#60758A] mt-1 block">94% average match</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)]">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#60758A] block">
            Doctor Approval Rate
          </span>
          <div className="text-2xl font-extrabold text-[#17324D] mt-1">
            96.4%
          </div>
          <span className="text-[11px] text-[#176B87] font-semibold mt-1 block">High concordance</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Referral Trends */}
        <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#DCE8F0] mb-6">
            <div>
              <h3 className="text-base font-bold text-[#17324D]">Monthly Referral Trends</h3>
              <p className="text-xs text-[#60758A]">Volume of patient transfers across all acute services</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDF5FA] text-[#176B87] border border-[#C9DCE8]">
              Last 6 Months
            </span>
          </div>

          {/* Bar Visualization */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {monthlyTrends.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-bold text-[#60758A] group-hover:text-[#176B87] transition-colors">
                  {item.count}
                </span>
                <div className="w-full max-w-[42px] bg-[#EDF5FA] rounded-t-xl overflow-hidden h-40 flex items-end">
                  <div
                    style={{ height: item.height }}
                    className="w-full bg-[#176B87] group-hover:bg-[#12566C] transition-all rounded-t-lg"
                  />
                </div>
                <span className="text-[11px] font-medium text-[#60758A]">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-[#DCE8F0] text-[11px] text-[#60758A] flex items-center justify-between">
            <span>Peak referral demand: September (38 transfers)</span>
            <span className="font-semibold text-[#176B87]">Steady +18% QoQ Growth</span>
          </div>
        </div>

        {/* Chart 2: Referral Status Distribution */}
        <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#DCE8F0] mb-5">
              <div>
                <h3 className="text-base font-bold text-[#17324D]">Referral Status Distribution</h3>
                <p className="text-xs text-[#60758A]">Current active lifecycle distribution across network</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDF5FA] text-[#176B87] border border-[#C9DCE8]">
                Active Registry
              </span>
            </div>

            {/* Stacked bar visualization */}
            <div className="w-full h-4 rounded-full overflow-hidden flex mb-6">
              {statusDistribution.map((st, idx) => (
                <div
                  key={idx}
                  style={{ width: st.percentage }}
                  className={`${st.color} h-full transition-all`}
                  title={`${st.label}: ${st.count}`}
                />
              ))}
            </div>

            {/* Legend list */}
            <div className="space-y-3 text-xs">
              {statusDistribution.map((st, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0]">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${st.color}`} />
                    <span className="font-medium text-[#17324D]">{st.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#17324D]">{st.count} records</span>
                    <span className="text-[11px] text-[#60758A] w-10 text-right">{st.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#DCE8F0] text-[11px] text-[#60758A]">
            Synthetic demo distribution representative of acute care regional networks.
          </div>
        </div>
      </div>

      {/* Section 3: Receiving Hospital Volume & Match Score */}
      <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-6">
        <h3 className="text-base font-bold text-[#17324D] mb-1">
          Receiving Hospital Utilization & Match Concordance
        </h3>
        <p className="text-xs text-[#60758A] mb-5">
          Top destinations for patient transfers routed by ReferralSync AI
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F4F8FC] border-b border-[#DCE8F0] text-[11px] font-bold uppercase tracking-wider text-[#60758A]">
                <th className="py-3 px-4">Receiving Facility</th>
                <th className="py-3 px-4">Referrals Received</th>
                <th className="py-3 px-4">Avg AI Match Score</th>
                <th className="py-3 px-4">Key Dedicated Capacity</th>
                <th className="py-3 px-4 text-right">Acceptance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE8F0]">
              {hospitalDestinationRankings.map((h, idx) => (
                <tr key={idx} className="hover:bg-[#F4F8FC]">
                  <td className="py-3.5 px-4 font-bold text-[#17324D]">{h.name}</td>
                  <td className="py-3.5 px-4 font-semibold text-[#17324D]">{h.referrals} transfers</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#176B87] bg-[#EDF5FA] px-2 py-0.5 rounded border border-[#C9DCE8]">
                      {h.matchRate}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#60758A]">{h.beds}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#2E9D68]">100%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

