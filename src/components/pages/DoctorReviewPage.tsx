import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  Edit3,
  Building,
  User,
  ArrowRight,
  AlertTriangle,
  Phone,
  ArrowLeft,
  FileText,
  Stethoscope,
} from 'lucide-react';
import { UrgencyBadge } from '../common/Badge';
import { getReceivingDoctorsForHospital } from '../../database/doctorDatabase';

export const DoctorReviewPage: React.FC = () => {
  const {
    draftPatient,
    draftRequirements,
    draftSelectedMatch,
    draftReferralReason,
    approveDraftReferral,
    rejectDraftReferral,
    navigateTo,
    doctor,
    selectedReceivingDoctorId,
    setSelectedReceivingDoctorId,
  } = useApp();

  const [reviewNotes, setReviewNotes] = useState(
    'Clinical capability verified by attending physician. Transfer recommended for immediate advanced intervention.'
  );

  const receivingDoctors = draftSelectedMatch
    ? getReceivingDoctorsForHospital(draftSelectedMatch.hospital.id)
    : [];

  const activeReceivingDocId =
    selectedReceivingDoctorId || (receivingDoctors[0]?.doctor_id ?? '');

  const assignedDoc =
    receivingDoctors.find((d) => d.doctor_id === activeReceivingDocId) ||
    receivingDoctors[0];

  if (!draftSelectedMatch || !draftPatient) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)]">
        <p className="text-[#60758A] mb-4">No pending referral recommendation for review.</p>
        <button
          onClick={() => navigateTo('new-referral')}
          className="px-4 py-2 bg-[#176B87] hover:bg-[#12566C] text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
        >
          Initiate New Referral
        </button>
      </div>
    );
  }

  const handleApprove = () => {
    approveDraftReferral(reviewNotes);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Navigation */}
      <button
        onClick={() => navigateTo('ai-analysis')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#60758A] hover:text-[#17324D] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Hospital Recommendations</span>
      </button>

      {/* Primary Verification Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#176B87] bg-[#EDF5FA] border border-[#C9DCE8] px-2 py-0.5 rounded">
              Physician Sign-Off Required
            </span>
            <span className="text-xs text-[#60758A]">Step 4 of 4</span>
          </div>
          <h2 className="text-lg font-bold text-[#17324D] tracking-tight mt-1">
            Review AI Recommendation
          </h2>
          <p className="text-xs text-[#60758A]">
            Verify clinical concordance and formally authorize patient transfer.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#17324D] bg-[#F4F8FC] px-3 py-2 rounded-xl border border-[#DCE8F0]">
          <ShieldCheck className="w-4 h-4 text-[#176B87]" />
          <span>Reviewing as: <strong>{doctor.name}</strong></span>
        </div>
      </div>

      {/* Safety Mandatory Notice */}
      <div className="bg-[#E9A23B]/10 border border-[#E9A23B]/30 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#E9A23B] shrink-0 mt-0.5" />
        <div className="text-xs text-[#17324D] leading-relaxed">
          <span className="font-bold text-[#17324D]">Important Clinical Mandate:</span> Final transfer and clinical decision is made solely by the doctor. ReferralSync AI provides facility matching recommendations only and does not diagnose or replace clinical judgment.
        </div>
      </div>

      {/* Section 1: Patient & Referral Requirement */}
      <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#60758A] flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-[#176B87]" /> Patient & Clinical Need
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0] text-xs">
          <div>
            <span className="text-[11px] text-[#60758A] block mb-0.5">Patient Details</span>
            <strong className="text-[#17324D] text-sm block">{draftPatient.name}</strong>
            <span className="text-[#60758A]">{draftPatient.id} • {draftPatient.age}y {draftPatient.gender}</span>
          </div>

          <div>
            <span className="text-[11px] text-[#60758A] block mb-0.5">Origin Facility</span>
            <span className="text-[#17324D] font-medium block">{draftPatient.currentHospital}</span>
            <span className="text-[#60758A]">Attending: {doctor.name}</span>
          </div>

          <div>
            <span className="text-[11px] text-[#60758A] block mb-0.5">Clinical Urgency</span>
            <div>
              <UrgencyBadge urgency={draftRequirements?.urgency || draftPatient.urgency} />
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0] text-xs">
          <span className="text-[11px] text-[#60758A] font-medium block mb-1">
            Referral Requirement:
          </span>
          <p className="text-[#17324D] font-medium leading-relaxed">
            {draftReferralReason || draftPatient.referralRequirement}
          </p>
        </div>
      </div>

      {/* Section 2: Selected Recommended Hospital */}
      <div className="bg-white rounded-2xl border border-[#176B87]/30 shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#17324D] flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#176B87]" /> Recommended Receiving Hospital
          </h3>
          <span className="text-xs font-bold text-[#176B87] bg-[#EDF5FA] border border-[#C9DCE8] px-2.5 py-1 rounded-lg">
            {draftSelectedMatch.matchScore}% Prototype Match Score
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#EDF5FA]/60 border border-[#C9DCE8]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#DCE8F0]">
            <div>
              <h4 className="text-base font-bold text-[#17324D]">
                {draftSelectedMatch.hospital.name}
              </h4>
              <p className="text-xs text-[#60758A]">
                {draftSelectedMatch.hospital.address} ({draftSelectedMatch.hospital.distanceKm} km away • Est. {draftSelectedMatch.transitTimeEstimate})
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-[#C9DCE8] text-[#176B87] w-fit">
              {draftSelectedMatch.hospital.availabilityStatus} ({draftSelectedMatch.hospital.icuBedsAvailable} ICU beds)
            </span>
          </div>

          <div className="pt-3 space-y-2 text-xs">
            {draftSelectedMatch.matchedCapabilities && draftSelectedMatch.matchedCapabilities.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pb-1">
                {draftSelectedMatch.matchedCapabilities.map((cap, cIdx) => (
                  <span
                    key={cIdx}
                    className="px-2 py-0.5 rounded-md bg-white border border-[#C9DCE8] text-[#176B87] text-[11px] font-semibold"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            )}
            <div className="font-semibold text-[#17324D]">Reasons for recommendation:</div>
            <ul className="space-y-1 text-[#60758A]">
              {draftSelectedMatch.matchedReasons.map((reason, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E9D68] shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 pt-3 border-t border-[#DCE8F0] text-[11px] text-[#60758A] flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-[#176B87]" />
                Coordinator: {draftSelectedMatch.hospital.referralContact.coordinator}
              </span>
              <span>Hotline: {draftSelectedMatch.hospital.referralContact.hotline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Select Receiving Doctor at Hospital */}
      <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#17324D] flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-[#176B87]" /> Assign Receiving Physician / Department Lead *
          </h3>
          <span className="text-[11px] font-semibold text-[#60758A]">
            Registered at {draftSelectedMatch.hospital.name}
          </span>
        </div>

        <p className="text-xs text-[#60758A]">
          Select the verified receiving doctor who will receive this referral packet and coordinate bed intake.
        </p>

        <div className="space-y-3">
          <select
            value={activeReceivingDocId}
            onChange={(e) => setSelectedReceivingDoctorId(e.target.value)}
            className="w-full p-3 bg-white border border-[#C9DCE8] rounded-xl text-xs font-bold text-[#17324D] focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87] cursor-pointer"
          >
            {receivingDoctors.map((doc) => (
              <option key={doc.doctor_id} value={doc.doctor_id}>
                {doc.doctor_name} — {doc.specialization} ({doc.registration_number})
              </option>
            ))}
          </select>

          {assignedDoc && (
            <div className="p-3.5 rounded-xl bg-[#EDF5FA]/60 border border-[#C9DCE8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white border border-[#C9DCE8] flex items-center justify-center text-base shadow-xs select-none">
                  👨‍⚕️
                </div>
                <div>
                  <strong className="text-[#17324D] block font-bold text-sm">{assignedDoc.doctor_name}</strong>
                  <span className="text-[#60758A] text-[11px]">
                    {assignedDoc.department} • Reg: {assignedDoc.registration_number}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2E9D68] bg-[#2E9D68]/10 border border-[#2E9D68]/30 px-2.5 py-1 rounded-lg w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E9D68] animate-pulse" />
                <span>On-Call & Triage Active</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 4: Physician Notes & Authorization */}
      <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-6 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#60758A] flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#176B87]" /> Attending Physician Authorization Notes
        </h3>
        <textarea
          rows={3}
          value={reviewNotes}
          onChange={(e) => setReviewNotes(e.target.value)}
          className="w-full p-3 bg-white border border-[#C9DCE8] rounded-xl text-xs text-[#17324D] placeholder-[#60758A]/60 focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87]"
          placeholder="Enter sign-off comments, specific clinical warnings, or transport escort requirements..."
        />
      </div>

      {/* Doctor Action Buttons */}
      <div className="p-5 bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => navigateTo('ai-analysis')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#DCE8F0] text-[#17324D] hover:bg-[#F4F8FC] font-semibold text-xs transition-colors cursor-pointer"
          >
            Choose Another Hospital
          </button>
          <button
            onClick={() => navigateTo('new-referral')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#DCE8F0] text-[#17324D] hover:bg-[#F4F8FC] font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Referral</span>
          </button>
          <button
            onClick={() => rejectDraftReferral('Physician rejected recommendation.')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#D9534F]/30 text-[#D9534F] hover:bg-[#D9534F]/10 font-semibold text-xs transition-colors cursor-pointer"
          >
            Reject Recommendation
          </button>
        </div>

        <button
          onClick={handleApprove}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#176B87] hover:bg-[#12566C] text-white font-bold text-sm shadow-md transition-all cursor-pointer active:scale-[0.99]"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Approve Recommendation & Transmit</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

