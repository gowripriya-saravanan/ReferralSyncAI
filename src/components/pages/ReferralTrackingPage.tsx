import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { StatusBadge, UrgencyBadge } from '../common/Badge';

export const ReferralTrackingPage: React.FC = () => {
  const { selectedReferral, referrals, navigateTo, updateReferralStatus } = useApp();

  const referral = selectedReferral || referrals[0];

  if (!referral) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)]">
        <p className="text-[#60758A] mb-4">No referral selected.</p>
        <button
          onClick={() => navigateTo('referrals')}
          className="px-4 py-2 bg-[#176B87] hover:bg-[#12566C] text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
        >
          View Referrals Table
        </button>
      </div>
    );
  }

  const handleSimulateAdvance = () => {
    if (referral.status === 'Doctor Approved') {
      updateReferralStatus(referral.id, 'Hospital Accepted', 'Pending Dispatch');
    } else if (referral.status === 'Hospital Accepted') {
      updateReferralStatus(referral.id, 'In Transfer', 'Ambulance En Route');
    } else if (referral.status === 'In Transfer') {
      updateReferralStatus(referral.id, 'Completed', 'Completed');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateTo('referrals')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#60758A] hover:text-[#17324D] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Referrals</span>
        </button>

        <span className="text-xs text-[#60758A] font-mono">
          Audit Trail Token: #TRK-{referral.id.replace('REF-', '')}-SEC
        </span>
      </div>

      {/* Main Referral Info Card */}
      <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#DCE8F0]">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-xs font-bold text-[#176B87] bg-[#EDF5FA] px-2.5 py-1 rounded-md border border-[#C9DCE8]">
                {referral.id}
              </span>
              <StatusBadge status={referral.status} />
              <UrgencyBadge urgency={referral.urgency} />
            </div>
            <h2 className="text-xl font-bold text-[#17324D] mt-2">
              Patient: {referral.patientName}
            </h2>
            <p className="text-xs text-[#60758A]">
              Specialty: <strong className="text-[#17324D]">{referral.requiredSpecialty}</strong> • Created on {referral.createdDate}
            </p>
          </div>

          {/* Quick Simulation controls for Demo */}
          <div className="flex flex-col sm:items-end gap-2">
            <span className="text-[11px] font-semibold text-[#60758A]">Demo State Trigger:</span>
            {referral.status !== 'Completed' && (
              <button
                onClick={handleSimulateAdvance}
                className="px-4 py-2 bg-[#176B87] hover:bg-[#12566C] text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>
                  {referral.status === 'Doctor Approved'
                    ? 'Simulate Hospital Acceptance'
                    : referral.status === 'Hospital Accepted'
                    ? 'Dispatch Ambulance (In Transfer)'
                    : 'Confirm Handover (Complete)'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            {referral.status === 'Completed' && (
              <span className="text-xs font-semibold text-[#2E9D68] bg-[#2E9D68]/10 px-3 py-1.5 rounded-xl border border-[#2E9D68]/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Handover Complete
              </span>
            )}
          </div>
        </div>

        {referral.rejectionReason && (
          <div className="mt-4 p-4 rounded-xl bg-[#D9534F]/10 border border-[#D9534F]/30 text-xs text-[#D9534F]">
            <span className="font-bold block mb-1">Notice: Referral Declined by Receiving Facility:</span>
            <p className="font-medium">{referral.rejectionReason}</p>
            {referral.responseNotes && <p className="mt-1 text-[#D9534F]/80 italic">Notes: {referral.responseNotes}</p>}
          </div>
        )}

        {/* Transfer Route */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-6 border-b border-[#DCE8F0] text-xs">
          <div className="p-4 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0]">
            <span className="text-[11px] text-[#60758A] font-semibold block mb-1">
              Origin Facility
            </span>
            <div className="font-bold text-[#17324D] text-sm">{referral.currentHospital}</div>
            <div className="text-[#60758A] mt-1">
              Attending: <strong>{referral.referringDoctorName || 'Dr. Ananya Rao'}</strong>
            </div>
            <div className="text-[#60758A]">Status: Records packaged & signed off</div>
          </div>

          <div className="p-4 rounded-xl bg-[#EDF5FA]/60 border border-[#C9DCE8]">
            <span className="text-[11px] text-[#176B87] font-semibold block mb-1">
              Receiving Destination
            </span>
            <div className="font-bold text-[#17324D] text-sm">{referral.receivingHospital}</div>
            <div className="text-[#60758A] mt-1">
              Receiving Doctor:{' '}
              <strong className="text-[#176B87]">
                {referral.receivingDoctorName || 'Receiving Department Lead'}
              </strong>
            </div>
            {referral.assignedBed && (
              <div className="text-[#176B87] font-semibold mt-0.5">
                Bed Allocation: <span className="bg-white px-2 py-0.5 rounded border border-[#C9DCE8]">{referral.assignedBed}</span>
              </div>
            )}
            <div className="text-[#60758A] mt-0.5">
              Hospital Response: <strong>{referral.hospitalResponse}</strong>
            </div>
          </div>
        </div>

        {/* Doctor Notes & Reason */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-bold text-[#17324D] block mb-1">Clinical Referral Reason</span>
            <p className="text-[#60758A] leading-relaxed bg-[#F4F8FC] p-3 rounded-xl border border-[#DCE8F0]">
              {referral.referralReason}
            </p>
          </div>

          <div>
            <span className="font-bold text-[#17324D] block mb-1">Doctor Verification & Notes</span>
            <p className="text-[#60758A] leading-relaxed bg-[#F4F8FC] p-3 rounded-xl border border-[#DCE8F0]">
              {referral.doctorNotes || 'Physician capability match approved.'}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Referral Timeline */}
      <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE8F0] mb-6">
          <div>
            <h3 className="text-base font-bold text-[#17324D] tracking-tight">
              Referral Lifecycle Timeline
            </h3>
            <p className="text-xs text-[#60758A]">
              End-to-end verification and transfer tracking log
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EDF5FA] text-[#176B87] border border-[#C9DCE8]">
            Live Synchronized
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DCE8F0]">
          {referral.timeline.map((item, idx) => {
            const isCompleted = item.status === 'completed';
            const isCurrent = item.status === 'current';

            return (
              <div key={idx} className="relative group">
                {/* Node icon */}
                <div
                  className={`absolute -left-[27px] sm:-left-[35px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#176B87] border-[#176B87] text-white'
                      : isCurrent
                      ? 'bg-white border-[#176B87] text-[#176B87] ring-4 ring-[#176B87]/15'
                      : 'bg-white border-[#DCE8F0] text-[#60758A]'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[10px]">{idx + 1}</span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4
                    className={`text-xs sm:text-sm font-bold ${
                      isCompleted || isCurrent ? 'text-[#17324D]' : 'text-[#60758A]'
                    }`}
                  >
                    {item.step}
                  </h4>
                  <div className="text-[11px] text-[#60758A] flex items-center gap-2">
                    <span>{item.timestamp}</span>
                    <span>•</span>
                    <span className="font-medium text-[#17324D]">{item.actor}</span>
                  </div>
                </div>

                <p className="text-xs text-[#60758A] mt-1 leading-relaxed">
                  {item.notes}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

