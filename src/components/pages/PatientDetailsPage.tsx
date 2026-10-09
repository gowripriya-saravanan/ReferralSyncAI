import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  PlusCircle,
  User,
  AlertCircle,
  Stethoscope,
  Activity,
  Phone,
  Droplet,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { StatusBadge, UrgencyBadge } from '../common/Badge';

export const PatientDetailsPage: React.FC = () => {
  const { selectedPatient, navigateTo, startReferralForPatient } = useApp();

  if (!selectedPatient) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)]">
        <p className="text-[#60758A] mb-4">No patient selected.</p>
        <button
          onClick={() => navigateTo('patients')}
          className="px-4 py-2 bg-[#176B87] hover:bg-[#12566C] text-white rounded-xl text-sm font-semibold cursor-pointer transition-colors"
        >
          Back to Patients Directory
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back and Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigateTo('patients')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#60758A] hover:text-[#17324D] transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Patients Directory</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => startReferralForPatient(selectedPatient.id)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#176B87] hover:bg-[#12566C] text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Referral for {selectedPatient.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-[#E9A23B]/10 border border-[#E9A23B]/30 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#E9A23B] shrink-0 mt-0.5" />
        <div className="text-xs text-[#17324D] leading-relaxed">
          <span className="font-bold text-[#17324D]">Clinical Care Note:</span> Diagnosis and active clinical care decisions remain under the sole authority of the treating physician ({selectedPatient.assignedDoctor}). ReferralSync AI only facilitates facility capability matching and receiving hospital capacity coordination.
        </div>
      </div>

      {/* Patient Profile Card */}
      <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#DCE8F0]">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EDF5FA] border border-[#C9DCE8] text-[#176B87] flex items-center justify-center font-bold text-lg select-none">
              {selectedPatient.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-[#17324D]">
                  {selectedPatient.name}
                </h2>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#EDF5FA] text-[#176B87] border border-[#C9DCE8]">
                  {selectedPatient.id}
                </span>
                <StatusBadge status={selectedPatient.referralStatus} />
              </div>

              <div className="flex items-center gap-4 text-xs text-[#60758A] mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#60758A]" />
                  {selectedPatient.age} years old • {selectedPatient.gender}
                </span>
                {selectedPatient.bloodGroup && (
                  <span className="flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-[#D9534F]" />
                    Blood Group: <strong className="text-[#17324D]">{selectedPatient.bloodGroup}</strong>
                  </span>
                )}
                {selectedPatient.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-[#60758A]" />
                    {selectedPatient.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-left md:text-right">
            <div className="text-xs text-[#60758A]">Assigned Facility & Attending</div>
            <div className="font-semibold text-sm text-[#17324D] mt-0.5">
              {selectedPatient.currentHospital}
            </div>
            <div className="text-xs text-[#176B87] font-medium">
              Attending: {selectedPatient.assignedDoctor}
            </div>
          </div>
        </div>

        {/* Clinical Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Current Care */}
          <div className="p-4 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#60758A] flex items-center gap-1.5 mb-2">
              <Activity className="w-3.5 h-3.5 text-[#176B87]" /> Current Bedside Care & Status
            </h3>
            <p className="text-xs text-[#17324D] leading-relaxed">
              {selectedPatient.currentCare}
            </p>
          </div>

          {/* Referral Requirement */}
          <div className="p-4 rounded-xl bg-[#EDF5FA]/60 border border-[#C9DCE8]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#176B87] flex items-center gap-1.5 mb-2">
              <Stethoscope className="w-3.5 h-3.5 text-[#176B87]" /> Clinical Referral Requirement
            </h3>
            <p className="text-xs text-[#17324D] font-medium leading-relaxed">
              {selectedPatient.referralRequirement}
            </p>
          </div>
        </div>

        {/* Structured Capability Checklist */}
        <div className="mt-6 pt-6 border-t border-[#DCE8F0]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#60758A] mb-4">
            Required Receiving Hospital Capabilities
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl border border-[#DCE8F0] bg-[#F4F8FC]">
              <span className="text-[11px] text-[#60758A] block mb-1">Required Specialty</span>
              <span className="text-xs font-bold text-[#17324D]">{selectedPatient.requiredSpecialty}</span>
            </div>

            <div className="p-3.5 rounded-xl border border-[#DCE8F0] bg-[#F4F8FC]">
              <span className="text-[11px] text-[#60758A] block mb-1">Required Equipment</span>
              <span className="text-xs font-bold text-[#17324D]">{selectedPatient.requiredEquipment}</span>
            </div>

            <div className="p-3.5 rounded-xl border border-[#DCE8F0] bg-[#F4F8FC]">
              <span className="text-[11px] text-[#60758A] block mb-1">Required Facility Tier</span>
              <span className="text-xs font-bold text-[#17324D]">{selectedPatient.requiredFacility}</span>
            </div>

            <div className="p-3.5 rounded-xl border border-[#DCE8F0] bg-[#F4F8FC]">
              <span className="text-[11px] text-[#60758A] block mb-1">Clinical Urgency</span>
              <div>
                <UrgencyBadge urgency={selectedPatient.urgency} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 pt-6 border-t border-[#DCE8F0] flex items-center justify-between">
          <span className="text-xs text-[#60758A] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Last clinical record update: {selectedPatient.lastUpdated}
          </span>

          <button
            onClick={() => startReferralForPatient(selectedPatient.id)}
            className="px-5 py-2.5 rounded-xl bg-[#176B87] hover:bg-[#12566C] text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <span>Proceed to AI Hospital Matching</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

