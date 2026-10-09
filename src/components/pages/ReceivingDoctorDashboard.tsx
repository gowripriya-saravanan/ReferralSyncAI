import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Referral } from '../../types/referral';
import { StatusBadge, UrgencyBadge } from '../common/Badge';
import {
  Inbox,
  CheckCircle2,
  XCircle,
  Clock,
  Truck,
  Send,
  Building2,
  Stethoscope,
  ShieldAlert,
  Bed,
  Phone,
  FileText,
  UserCheck,
  CheckCheck,
} from 'lucide-react';

export const ReceivingDoctorDashboard: React.FC = () => {
  const {
    referrals,
    respondToReferral,
    currentDoctorProfile,
    referralMessages,
    sendReferralMessage,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'COMPLETED'>('ALL');
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

  // Modal states for action dialogs
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [assignedBedInput, setAssignedBedInput] = useState('Neuro-ICU Bed #04');
  const [responseNotesInput, setResponseNotesInput] = useState('');
  const [rejectionReasonInput, setRejectionReasonInput] = useState(
    'No ICU / Neuro-ICU beds currently available'
  );
  const [customRejectionText, setCustomRejectionText] = useState('');
  const [replyMessageText, setReplyMessageText] = useState('');

  const doctorHospitalId = currentDoctorProfile?.hospital_id || 'hosp-001';
  const doctorHospitalName = currentDoctorProfile?.hospital_name || 'Regional Neuro & Trauma Hospital';

  // Filter referrals dispatched to this doctor's hospital or assigned to this doctor
  const receivingReferrals = referrals.filter((r) => {
    // If targeted to this hospital ID or matching hospital name or explicitly assigned to this doctor
    if (r.receivingHospitalId && r.receivingHospitalId === doctorHospitalId) return true;
    if (r.receivingHospital && r.receivingHospital.toLowerCase().includes(doctorHospitalName.toLowerCase())) return true;
    if (r.receivingDoctorId && currentDoctorProfile?.doctor_id && r.receivingDoctorId === currentDoctorProfile.doctor_id) return true;
    return false;
  });

  const pendingReferrals = receivingReferrals.filter(
    (r) => r.status === 'Pending' || r.status === 'AI Recommended' || r.status === 'Doctor Approved' || r.hospitalResponse === 'Pending'
  );
  const acceptedReferrals = receivingReferrals.filter(
    (r) => r.status === 'Accepted' || r.status === 'Hospital Accepted' || r.status === 'In Progress' || r.status === 'In Transfer'
  );
  const completedReferrals = receivingReferrals.filter((r) => r.status === 'Completed');

  // Filtered list based on active tab
  const displayedReferrals = receivingReferrals.filter((r) => {
    if (activeTab === 'PENDING') {
      return r.status === 'Pending' || r.status === 'AI Recommended' || r.status === 'Doctor Approved' || r.hospitalResponse === 'Pending';
    }
    if (activeTab === 'ACCEPTED') {
      return r.status === 'Accepted' || r.status === 'Hospital Accepted' || r.status === 'In Progress' || r.status === 'In Transfer';
    }
    if (activeTab === 'COMPLETED') {
      return r.status === 'Completed';
    }
    return true;
  });

  const activeSelected = selectedReferral
    ? referrals.find((r) => r.id === selectedReferral.id) || selectedReferral
    : receivingReferrals[0] || null;

  const currentMessages = activeSelected
    ? referralMessages.filter((m) => m.referralId === activeSelected.id)
    : [];

  const handleOpenAccept = (ref: Referral) => {
    setSelectedReferral(ref);
    setAssignedBedInput(ref.assignedBed || 'Neuro-ICU Bed #04');
    setResponseNotesInput('Intake acknowledged. Critical care team notified and standby.');
    setShowAcceptModal(true);
  };

  const handleConfirmAccept = () => {
    if (!activeSelected) return;
    respondToReferral(activeSelected.id, 'accept', {
      assignedBed: assignedBedInput,
      responseNotes: responseNotesInput,
    });
    setShowAcceptModal(false);
  };

  const handleOpenReject = (ref: Referral) => {
    setSelectedReferral(ref);
    setRejectionReasonInput('No ICU / Neuro-ICU beds currently available');
    setCustomRejectionText('');
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    if (!activeSelected) return;
    const finalReason =
      rejectionReasonInput === 'Other clinical reason' && customRejectionText.trim()
        ? customRejectionText.trim()
        : rejectionReasonInput;

    respondToReferral(activeSelected.id, 'reject', {
      rejectionReason: finalReason,
      responseNotes: customRejectionText || undefined,
    });
    setShowRejectModal(false);
  };

  const handleMarkInProgress = (refId: string) => {
    respondToReferral(refId, 'in_progress');
  };

  const handleMarkCompleted = (refId: string) => {
    respondToReferral(refId, 'complete');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSelected || !replyMessageText.trim()) return;
    sendReferralMessage(activeSelected.id, replyMessageText);
    setReplyMessageText('');
  };

  return (
    <div className="space-y-6">
      {/* Receiving Doctor Station Banner */}
      <div className="bg-white rounded-3xl p-6 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EDF5FA] border border-[#C9DCE8] flex items-center justify-center text-3xl shadow-xs shrink-0 select-none">
            🏥
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#176B87] bg-[#EDF5FA] border border-[#C9DCE8] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#176B87]" /> Receiving Facility Station
              </span>
              <span className="text-[11px] font-semibold text-[#2E9D68] bg-[#2E9D68]/10 border border-[#2E9D68]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E9D68] animate-pulse" /> Intake Live
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#17324D] tracking-tight">
              {currentDoctorProfile?.doctor_name || 'Dr. Arun Kumar'}
            </h1>
            <p className="text-xs sm:text-sm text-[#60758A] font-medium">
              {currentDoctorProfile?.specialization || 'Neurology & Stroke Critical Care'} •{' '}
              <strong className="text-[#17324D]">
                {currentDoctorProfile?.hospital_name || 'Regional Neuro & Trauma Hospital'}
              </strong>{' '}
              ({currentDoctorProfile?.registration_number || 'REG-TN-48201'})
            </p>
          </div>
        </div>

        {/* Quick facility metrics */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-[#F4F8FC] border border-[#DCE8F0] text-right">
            <span className="text-[11px] text-[#60758A] font-bold block uppercase tracking-wider">
              Department Beds
            </span>
            <span className="text-sm font-bold text-[#17324D] flex items-center justify-end gap-1.5">
              <Bed className="w-4 h-4 text-[#176B87]" /> 4 Neuro-ICU Available
            </span>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-[#F4F8FC] border border-[#DCE8F0] text-right">
            <span className="text-[11px] text-[#60758A] font-bold block uppercase tracking-wider">
              Direct Triage Desk
            </span>
            <span className="text-sm font-bold text-[#17324D] flex items-center justify-end gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#176B87]" /> +91 422 249 8100
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#60758A] block mb-1">
              Incoming Total
            </span>
            <span className="text-2xl font-extrabold text-[#17324D]">{receivingReferrals.length}</span>
            <p className="text-[11px] text-[#60758A] mt-0.5">Dispatched to this hospital</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#EDF5FA] border border-[#C9DCE8] flex items-center justify-center text-[#176B87]">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E9A23B]/40 shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E9A23B] block mb-1 flex items-center gap-1">
              Action Required
            </span>
            <span className="text-2xl font-extrabold text-[#E9A23B]">{pendingReferrals.length}</span>
            <p className="text-[11px] text-[#E9A23B]/80 mt-0.5">Awaiting triage decision</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E9A23B]/10 border border-[#E9A23B]/30 flex items-center justify-center text-[#E9A23B]">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#2E9D68]/40 shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E9D68] block mb-1">
              Accepted / Beds Held
            </span>
            <span className="text-2xl font-extrabold text-[#2E9D68]">{acceptedReferrals.length}</span>
            <p className="text-[11px] text-[#2E9D68]/80 mt-0.5">Reserved and prepared</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#2E9D68]/10 border border-[#2E9D68]/30 flex items-center justify-center text-[#2E9D68]">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#5B8DEF]/40 shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B8DEF] block mb-1">
              In Transit / Completed
            </span>
            <span className="text-2xl font-extrabold text-[#5B8DEF]">
              {completedReferrals.length + acceptedReferrals.filter(r => r.status === 'In Progress' || r.status === 'In Transfer').length}
            </span>
            <p className="text-[11px] text-[#5B8DEF]/80 mt-0.5">En route or admitted</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F0F6FE] border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF]">
            <Truck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Referrals List */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] overflow-hidden flex flex-col">
          {/* Tabs Filter Header */}
          <div className="p-4 border-b border-[#DCE8F0] flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-[#17324D] flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[#176B87]" /> Incoming Referrals Queue
            </h3>

            <div className="flex items-center gap-1 p-1 bg-[#EDF5FA] rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'ALL'
                    ? 'bg-[#176B87] text-white shadow-xs'
                    : 'text-[#60758A] hover:text-[#17324D]'
                }`}
              >
                All ({receivingReferrals.length})
              </button>
              <button
                onClick={() => setActiveTab('PENDING')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'PENDING'
                    ? 'bg-[#E9A23B] text-white shadow-xs'
                    : 'text-[#60758A] hover:text-[#17324D]'
                }`}
              >
                Pending ({pendingReferrals.length})
              </button>
              <button
                onClick={() => setActiveTab('ACCEPTED')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'ACCEPTED'
                    ? 'bg-[#2E9D68] text-white shadow-xs'
                    : 'text-[#60758A] hover:text-[#17324D]'
                }`}
              >
                Accepted ({acceptedReferrals.length})
              </button>
            </div>
          </div>

          {/* Referral Items List */}
          <div className="divide-y divide-[#DCE8F0] max-h-[700px] overflow-y-auto">
            {displayedReferrals.length === 0 ? (
              <div className="p-8 text-center text-[#60758A] text-xs">
                No referrals found for the selected view.
              </div>
            ) : (
              displayedReferrals.map((r) => {
                const isSelected = activeSelected?.id === r.id;
                const isPendingAction =
                  r.status === 'Pending' ||
                  r.status === 'AI Recommended' ||
                  r.status === 'Doctor Approved' ||
                  r.hospitalResponse === 'Pending';

                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedReferral(r)}
                    className={`p-4 transition-all cursor-pointer hover:bg-[#F4F8FC] ${
                      isSelected ? 'bg-[#EDF5FA]/60 border-l-4 border-[#176B87]' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-[#17324D]">
                            {r.patientName}
                          </strong>
                          {r.patientAge && (
                            <span className="text-xs text-[#60758A]">
                              {r.patientAge}y {r.patientGender}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#60758A] font-mono block">
                          {r.id} • {r.createdDate}
                        </span>
                      </div>
                      <StatusBadge status={r.status} />
                    </div>

                    <p className="text-xs text-[#60758A] line-clamp-2 mb-2 font-medium">
                      {r.referralReason}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
                      <div className="flex items-center gap-1.5">
                        <UrgencyBadge urgency={r.urgency} size="sm" />
                        <span className="text-[#60758A] font-medium">
                          {r.requiredSpecialty}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[#60758A] font-medium">
                        <span>From:</span>
                        <strong className="text-[#17324D] truncate max-w-[130px]">
                          {r.currentHospital}
                        </strong>
                      </div>
                    </div>

                    {isPendingAction && (
                      <div className="mt-3 pt-2.5 border-t border-[#DCE8F0] flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold uppercase text-[#E9A23B] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Triage Action Required
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenReject(r);
                            }}
                            className="px-2 py-1 rounded-lg text-[11px] font-bold text-[#D9534F] bg-[#D9534F]/10 hover:bg-[#D9534F]/20 border border-[#D9534F]/30 transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAccept(r);
                            }}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-[#2E9D68] hover:bg-[#258256] transition-colors cursor-pointer"
                          >
                            Accept Referral
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Referral Case Review & Action Station */}
        <div className="lg:col-span-7 space-y-6">
          {activeSelected ? (
            <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-6 space-y-6">
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DCE8F0]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono text-[#176B87] bg-[#EDF5FA] border border-[#C9DCE8] px-2 py-0.5 rounded font-bold">
                      {activeSelected.id}
                    </span>
                    <StatusBadge status={activeSelected.status} />
                    <UrgencyBadge urgency={activeSelected.urgency} />
                  </div>
                  <h2 className="text-xl font-bold text-[#17324D] tracking-tight">
                    {activeSelected.patientName}
                  </h2>
                  <p className="text-xs text-[#60758A]">
                    Patient ID: {activeSelected.patientId} • Age: {activeSelected.patientAge || 34}y • Gender:{' '}
                    {activeSelected.patientGender || 'Female'}
                  </p>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <span className="text-[11px] text-[#60758A] block mb-0.5">Dispatched At</span>
                  <strong className="text-[#17324D] block">{activeSelected.createdDate}</strong>
                  <span className="text-[#60758A]">Match Score: {activeSelected.aiRecommendationScore}%</span>
                </div>
              </div>

              {/* Action Bar for Receiving Doctor */}
              <div className="p-4 rounded-2xl bg-[#F4F8FC] border border-[#DCE8F0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#60758A]">
                    Physician Triage Decision & Bed Allocation
                  </span>
                  {activeSelected.assignedBed && (
                    <span className="text-xs font-bold text-[#176B87] bg-[#EDF5FA] border border-[#C9DCE8] px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-[#176B87]" /> {activeSelected.assignedBed}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Accept / Bed reserve button */}
                  {(activeSelected.status === 'Pending' ||
                    activeSelected.status === 'AI Recommended' ||
                    activeSelected.status === 'Doctor Approved' ||
                    activeSelected.hospitalResponse === 'Pending') && (
                    <>
                      <button
                        onClick={() => handleOpenAccept(activeSelected)}
                        className="px-4 py-2.5 rounded-xl bg-[#2E9D68] hover:bg-[#258256] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.99]"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Referral & Reserve Bed</span>
                      </button>

                      <button
                        onClick={() => handleOpenReject(activeSelected)}
                        className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#D9534F]/10 text-[#D9534F] border border-[#D9534F]/30 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject Referral</span>
                      </button>
                    </>
                  )}

                  {/* If Accepted, option to mark In Progress or Completed */}
                  {(activeSelected.status === 'Accepted' || activeSelected.status === 'Hospital Accepted') && (
                    <button
                      onClick={() => handleMarkInProgress(activeSelected.id)}
                      className="px-4 py-2.5 rounded-xl bg-[#5B8DEF] hover:bg-[#4372D4] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Mark Transfer En Route</span>
                    </button>
                  )}

                  {(activeSelected.status === 'In Progress' ||
                    activeSelected.status === 'In Transfer' ||
                    activeSelected.transferStatus === 'Ambulance En Route') && (
                    <button
                      onClick={() => handleMarkCompleted(activeSelected.id)}
                      className="px-4 py-2.5 rounded-xl bg-[#2E9D68] hover:bg-[#258256] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span>Mark Patient Admitted & Handover Completed</span>
                    </button>
                  )}

                  {activeSelected.status === 'Completed' && (
                    <div className="flex items-center gap-2 text-xs font-bold text-[#2E9D68] bg-[#2E9D68]/10 px-3 py-2 rounded-xl border border-[#2E9D68]/30">
                      <CheckCircle2 className="w-4 h-4 text-[#2E9D68]" />
                      <span>Patient Transfer & Electronic Handover Fully Completed</span>
                    </div>
                  )}

                  {activeSelected.status === 'Rejected' && (
                    <div className="flex items-center gap-2 text-xs font-bold text-[#D9534F] bg-[#D9534F]/10 px-3 py-2 rounded-xl border border-[#D9534F]/30">
                      <ShieldAlert className="w-4 h-4 text-[#D9534F]" />
                      <span>Referral Declined: {activeSelected.rejectionReason}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Patient Clinical Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0] space-y-1">
                  <span className="text-[11px] text-[#60758A] font-bold block uppercase tracking-wider">
                    Origin Hospital & Referring Doctor
                  </span>
                  <strong className="text-[#17324D] block text-sm">
                    {activeSelected.currentHospital}
                  </strong>
                  <p className="text-[#60758A] flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5 text-[#176B87]" /> Attending:{' '}
                    <strong className="text-[#17324D]">{activeSelected.referringDoctorName || 'Dr. Ananya Rao'}</strong>
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0] space-y-1">
                  <span className="text-[11px] text-[#60758A] font-bold block uppercase tracking-wider">
                    Requested Specialty & Facilities
                  </span>
                  <strong className="text-[#17324D] block text-sm">
                    {activeSelected.requiredSpecialty}
                  </strong>
                  <p className="text-[#60758A]">
                    Assigned Receiving Specialist:{' '}
                    <strong className="text-[#17324D]">{activeSelected.receivingDoctorName || currentDoctorProfile?.doctor_name}</strong>
                  </p>
                </div>
              </div>

              {/* Reason for referral */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#60758A] block">
                  Clinical Reason for Transfer & Medical Condition
                </span>
                <div className="p-4 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0] text-[#17324D] leading-relaxed font-medium">
                  {activeSelected.referralReason}
                </div>
              </div>

              {/* Attending physician notes */}
              {activeSelected.doctorNotes && (
                <div className="space-y-1.5 text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#60758A] block">
                    Origin Physician Notes & Transport Instructions
                  </span>
                  <div className="p-3.5 rounded-xl bg-[#EDF5FA]/60 border border-[#C9DCE8] text-[#17324D] text-xs">
                    {activeSelected.doctorNotes}
                  </div>
                </div>
              )}

              {/* Doctor-to-Doctor Messaging Panel */}
              <div className="border-t border-[#DCE8F0] pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#17324D] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#176B87]" /> Inter-Hospital Doctor Communication Log
                  </h3>
                  <span className="text-[11px] text-[#60758A]">
                    Direct Channel with {activeSelected.referringDoctorName || 'Dr. Ananya Rao'}
                  </span>
                </div>

                {/* Messages conversation scroll */}
                <div className="bg-[#F4F8FC] rounded-2xl p-4 border border-[#DCE8F0] max-h-56 overflow-y-auto space-y-2.5 text-xs">
                  {currentMessages.length === 0 ? (
                    <p className="text-[#60758A] text-center py-4">
                      No communication records yet. Send a response note to the referring doctor below.
                    </p>
                  ) : (
                    currentMessages.map((m) => {
                      const isMe = m.senderRole === 'RECEIVING_DOCTOR';
                      return (
                        <div
                          key={m.id}
                          className={`p-3 rounded-xl max-w-[85%] ${
                            isMe
                              ? 'ml-auto bg-[#176B87] text-white shadow-xs'
                              : 'mr-auto bg-white border border-[#DCE8F0] text-[#17324D]'
                          }`}
                        >
                          <div
                            className={`flex items-center justify-between gap-3 text-[10px] font-bold mb-1 ${
                              isMe ? 'text-white/80' : 'text-[#60758A]'
                            }`}
                          >
                            <span>{m.senderName} ({m.senderRole === 'RECEIVING_DOCTOR' ? 'Receiving Lead' : 'Referring Doctor'})</span>
                            <span>{m.timestamp}</span>
                          </div>
                          <p className="leading-relaxed">{m.messageText}</p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={replyMessageText}
                    onChange={(e) => setReplyMessageText(e.target.value)}
                    placeholder="Send a clinical response or bed coordination note to referring physician..."
                    className="flex-1 p-2.5 bg-white text-xs text-[#17324D] placeholder-[#60758A]/60 rounded-xl border border-[#C9DCE8] focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!replyMessageText.trim()}
                    className="px-4 py-2.5 bg-[#176B87] hover:bg-[#12566C] disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#DCE8F0] p-12 text-center text-[#60758A] text-xs">
              Select an incoming referral on the left to review full details and take action.
            </div>
          )}
        </div>
      </div>

      {/* Accept Referral Dialog Modal */}
      {showAcceptModal && activeSelected && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#DCE8F0] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#DCE8F0] pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#2E9D68]" />
                <h3 className="text-base font-bold text-[#17324D]">
                  Accept Referral & Confirm Bed Allocation
                </h3>
              </div>
              <button
                onClick={() => setShowAcceptModal(false)}
                className="text-[#60758A] hover:text-[#17324D] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-[#60758A] space-y-2">
              <p>
                Authorizing admission for <strong className="text-[#17324D]">{activeSelected.patientName}</strong> from{' '}
                <strong className="text-[#17324D]">{activeSelected.currentHospital}</strong>.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#17324D] block">
                Allocate Specific Bed / Unit *
              </label>
              <select
                value={assignedBedInput}
                onChange={(e) => setAssignedBedInput(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#C9DCE8] rounded-xl text-xs text-[#17324D] font-semibold focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87]"
              >
                <option value="Neuro-ICU Bed #04">Neuro-ICU Bed #04 (Ventilator & Monitor Ready)</option>
                <option value="Neuro-ICU Bed #05">Neuro-ICU Bed #05 (Ventilator & Monitor Ready)</option>
                <option value="Stroke Step-Down Bed #02">Stroke Step-Down Bed #02</option>
                <option value="Emergency Resuscitation Bay #01">Emergency Resuscitation Bay #01</option>
                <option value="OT-1 Trauma Reserved">OT-1 Trauma Reserved (Surgical Team on Call)</option>
                <option value="General Acute Ward Bed #12">General Acute Ward Bed #12</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#17324D] block">
                Physician Acceptance Notes to Referring Doctor
              </label>
              <textarea
                rows={2}
                value={responseNotesInput}
                onChange={(e) => setResponseNotesInput(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#C9DCE8] rounded-xl text-xs text-[#17324D] placeholder-[#60758A]/60 focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87]"
                placeholder="E.g., 3T MRI team activated. Please dispatch with 2 units PRBC escort."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DCE8F0]">
              <button
                type="button"
                onClick={() => setShowAcceptModal(false)}
                className="px-4 py-2 rounded-xl border border-[#DCE8F0] text-[#60758A] font-bold text-xs hover:bg-[#F4F8FC] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAccept}
                className="px-5 py-2 rounded-xl bg-[#2E9D68] hover:bg-[#258256] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Acceptance & Transmit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Referral Dialog Modal */}
      {showRejectModal && activeSelected && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#DCE8F0] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#DCE8F0] pb-3">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-[#D9534F]" />
                <h3 className="text-base font-bold text-[#17324D]">
                  Decline Incoming Patient Referral
                </h3>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-[#60758A] hover:text-[#17324D] text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#60758A]">
              Please specify the clinical reason for declining the referral for{' '}
              <strong className="text-[#17324D]">{activeSelected.patientName}</strong> so the referring physician can immediately seek alternative facilities.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#17324D] block">
                Primary Reason for Rejection *
              </label>
              {[
                'No ICU / Neuro-ICU beds currently available',
                'Specialist / Surgical team currently engaged in emergency OT',
                'Required imaging / 3T MRI undergoing maintenance',
                'Patient clinical acuity exceeds facility transport tolerance',
                'Other clinical reason',
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2.5 p-2 rounded-xl border border-[#DCE8F0] hover:bg-[#F4F8FC] text-xs text-[#17324D] cursor-pointer font-medium"
                >
                  <input
                    type="radio"
                    name="rejectionReason"
                    value={reason}
                    checked={rejectionReasonInput === reason}
                    onChange={(e) => setRejectionReasonInput(e.target.value)}
                    className="text-[#D9534F] focus:ring-[#D9534F]"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            {rejectionReasonInput === 'Other clinical reason' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#17324D] block">
                  Specify Clinical Reason *
                </label>
                <textarea
                  rows={2}
                  value={customRejectionText}
                  onChange={(e) => setCustomRejectionText(e.target.value)}
                  placeholder="Enter detailed reason..."
                  className="w-full p-2.5 bg-white border border-[#C9DCE8] rounded-xl text-xs text-[#17324D] placeholder-[#60758A]/60 focus:outline-none focus:ring-2 focus:ring-[#D9534F]/20 focus:border-[#D9534F]"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DCE8F0]">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl border border-[#DCE8F0] text-[#60758A] font-bold text-xs hover:bg-[#F4F8FC] cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl bg-[#D9534F] hover:bg-[#C9302C] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Confirm Decline & Notify Doctor</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
