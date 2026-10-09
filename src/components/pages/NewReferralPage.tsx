import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  User,
  Building,
  Stethoscope,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import type { UrgencyLevel } from '../../types/referral';

export const NewReferralPage: React.FC = () => {
  const { patients, draftPatient, runAiRequirementAnalysis, showToast } = useApp();

  const [patientName, setPatientName] = useState(
    draftPatient?.name || ''
  );

  // Form fields
  const [currentHospital, setCurrentHospital] = useState(
    draftPatient?.currentHospital || 'Metro Care General Hospital'
  );
  const [requiredSpecialty, setRequiredSpecialty] = useState(
    draftPatient?.requiredSpecialty || 'Neurology'
  );
  const [requiredEquipment, setRequiredEquipment] = useState(
    draftPatient?.requiredEquipment || '3T MRI'
  );
  const [requiredFacility, setRequiredFacility] = useState(
    draftPatient?.requiredFacility || 'Neuro-ICU'
  );
  const [requiredServices, setRequiredServices] = useState(
    'Emergency Resuscitation & Triage'
  );
  const [urgency, setUrgency] = useState<UrgencyLevel>(draftPatient?.urgency || 'Urgent');
  const [doctorNotes, setDoctorNotes] = useState(
    draftPatient?.currentCare || ''
  );

  // Large free-text input for AI extraction
  const [freeTextRequirement, setFreeTextRequirement] = useState(
    draftPatient?.referralRequirement ||
    'Patient requires neurological evaluation and advanced imaging. Current facility does not have a neurologist or MRI facility. Emergency-capable receiving hospital preferred.'
  );

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      showToast('Validation Error', "Please enter the patient's full name.", 'error');
      return;
    }

    if (!freeTextRequirement.trim()) {
      showToast('Validation Error', 'Please enter the referral requirement description.', 'error');
      return;
    }

    const matchedPatient = patients.find(
      (p) => p.name.toLowerCase() === patientName.toLowerCase().trim()
    );

    runAiRequirementAnalysis(
      freeTextRequirement,
      {
        specialty: requiredSpecialty,
        equipment: [requiredEquipment],
        facility: [requiredFacility],
        services: [requiredServices],
        urgency,
      },
      matchedPatient ? matchedPatient.id : patientName.trim(),
      currentHospital
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="bg-white rounded-2xl p-5 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#17324D] tracking-tight">
            Create New Hospital Referral
          </h2>
          <p className="text-xs text-[#60758A]">
            Define patient care needs. The AI assistant extracts capabilities and ranks matching receiving hospitals.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EDF5FA] border border-[#DCE8F0] text-[#176B87] text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-[#176B87]" />
          <span>Doctor Verification Enforced</span>
        </div>
      </div>

      <form onSubmit={handleAnalyze} className="space-y-6">
        {/* Section 1: Patient & Origin Facility */}
        <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-xs p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#60758A] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#176B87]" /> 1. Patient & Origin Facility
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#17324D] mb-1.5">
                Patient Name <span className="text-[#D9534F]">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#60758A]" />
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient's full name"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#C9DCE8] text-[#17324D] text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87] font-medium placeholder:text-[#60758A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17324D] mb-1.5">
                Current Hospital (Origin)
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#60758A]" />
                <input
                  type="text"
                  value={currentHospital}
                  onChange={(e) => setCurrentHospital(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#C9DCE8] text-[#17324D] text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Requirements & Urgency */}
        <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-xs p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#60758A] flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-[#176B87]" /> 2. Clinical Care Requirements
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#17324D] mb-1.5">
                Required Specialty <span className="text-[#D9534F]">*</span>
              </label>
              <select
                value={requiredSpecialty}
                onChange={(e) => setRequiredSpecialty(e.target.value)}
                className="w-full bg-white border border-[#C9DCE8] text-[#17324D] text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87]"
              >
                <option value="Neurology">Neurology</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Trauma & Orthopedics">Trauma & Orthopedics</option>
                <option value="Pulmonology">Pulmonology</option>
                <option value="Medical Oncology">Medical Oncology</option>
                <option value="Critical Care">Critical Care</option>
                <option value="Vascular Surgery">Vascular Surgery</option>
                <option value="Nephrology">Nephrology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17324D] mb-1.5">
                Required Equipment
              </label>
              <select
                value={requiredEquipment}
                onChange={(e) => setRequiredEquipment(e.target.value)}
                className="w-full bg-white border border-[#C9DCE8] text-[#17324D] text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87]"
              >
                <option value="3T MRI">3T MRI</option>
                <option value="1.5T MRI">1.5T MRI</option>
                <option value="128-Slice CT">128-Slice CT</option>
                <option value="Cath Lab">Cath Lab</option>
                <option value="ECMO Machine">ECMO Machine</option>
                <option value="Advanced Ventilators">Advanced Ventilators</option>
                <option value="Continuous Dialysis">Continuous Dialysis</option>
                <option value="PET-CT Scanner">PET-CT Scanner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17324D] mb-1.5">
                Required Facility Tier
              </label>
              <select
                value={requiredFacility}
                onChange={(e) => setRequiredFacility(e.target.value)}
                className="w-full bg-white border border-[#C9DCE8] text-[#17324D] text-xs rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87]"
              >
                <option value="Neuro-ICU">Neuro-ICU</option>
                <option value="Coronary Care Unit (CCU)">Coronary Care Unit (CCU)</option>
                <option value="Level 1 Trauma Center">Level 1 Trauma Center</option>
                <option value="Medical ICU">Medical ICU</option>
                <option value="Respiratory ICU">Respiratory ICU</option>
                <option value="Bone Marrow Transplant Unit">Bone Marrow Transplant Unit</option>
                <option value="24/7 Stroke Unit">24/7 Stroke Unit</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#17324D] mb-1.5">
                Required Services
              </label>
              <input
                type="text"
                value={requiredServices}
                onChange={(e) => setRequiredServices(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#C9DCE8] text-[#17324D] text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87]"
                placeholder="e.g. Mechanical Thrombectomy, Emergency Resuscitation"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17324D] mb-1.5">
                Triage Urgency <span className="text-[#D9534F]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Routine', 'Urgent', 'Emergency'] as UrgencyLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setUrgency(level)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      urgency === level
                        ? level === 'Emergency'
                          ? 'bg-[#D9534F] text-white border-[#D9534F] shadow-xs'
                          : level === 'Urgent'
                          ? 'bg-[#E9A23B] text-white border-[#E9A23B] shadow-xs'
                          : 'bg-[#176B87] text-white border-[#176B87] shadow-xs'
                        : 'bg-[#EDF5FA] text-[#60758A] border-[#DCE8F0] hover:bg-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Free-Text Referral Description for AI Extraction */}
        <div className="bg-gradient-to-b from-white to-[#F0F6FE]/60 rounded-2xl border border-[#5B8DEF]/40 shadow-xs p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#17324D] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#5B8DEF]" />
              3. Describe the Referral Requirement (Free-Text Input)
            </h3>
            <span className="text-[11px] font-bold text-[#5B8DEF] bg-[#F0F6FE] border border-[#5B8DEF]/30 px-2 py-0.5 rounded">
              AI NLP Parsing Ready
            </span>
          </div>

          <p className="text-xs text-[#60758A]">
            Type or dictate natural clinical requirements. The AI extractor parses required specialists, equipment, facilities, and urgency.
          </p>

          <textarea
            rows={4}
            value={freeTextRequirement}
            onChange={(e) => setFreeTextRequirement(e.target.value)}
            className="w-full p-3.5 bg-white border border-[#C9DCE8] rounded-xl text-xs sm:text-sm text-[#17324D] focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87] font-normal leading-relaxed"
            placeholder="e.g. Patient requires neurological evaluation and advanced imaging. Current facility does not have a neurologist or MRI facility. Emergency-capable receiving hospital preferred."
          />

          {/* Quick preset chips */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="text-[11px] text-[#60758A] font-medium">Quick Presets:</span>
            <button
              type="button"
              onClick={() =>
                setFreeTextRequirement(
                  'Patient requires neurological evaluation and advanced imaging. Current facility does not have a neurologist or 3T MRI facility. Emergency-capable receiving hospital preferred.'
                )
              }
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#EDF5FA] hover:bg-[#F0F6FE] hover:text-[#176B87] text-[#60758A] transition-colors cursor-pointer border border-[#DCE8F0]"
            >
              Neuro + 3T MRI + Stroke Unit
            </button>
            <button
              type="button"
              onClick={() =>
                setFreeTextRequirement(
                  'Patient requires urgent cardiac catheterization lab and coronary care bed within 90 minutes. High troponin elevation.'
                )
              }
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#EDF5FA] hover:bg-[#F0F6FE] hover:text-[#176B87] text-[#60758A] transition-colors cursor-pointer border border-[#DCE8F0]"
            >
              Cardio + Cath Lab + CCU
            </button>
            <button
              type="button"
              onClick={() =>
                setFreeTextRequirement(
                  'Open pelvic fracture with hemodynamically stabilized shock. Requires Level 1 trauma surgery center and 128-slice CT.'
                )
              }
              className="text-[11px] px-2.5 py-1 rounded-lg bg-[#EDF5FA] hover:bg-[#F0F6FE] hover:text-[#176B87] text-[#60758A] transition-colors cursor-pointer border border-[#DCE8F0]"
            >
              Trauma + 128-Slice CT
            </button>
          </div>
        </div>

        {/* Section 4: Doctor Bedside Notes */}
        <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-xs p-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#60758A] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#176B87]" /> 4. Attending Doctor Bedside Notes
          </h3>
          <textarea
            rows={2}
            value={doctorNotes}
            onChange={(e) => setDoctorNotes(e.target.value)}
            className="w-full p-3 bg-white border border-[#C9DCE8] rounded-xl text-xs text-[#17324D] focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87]"
            placeholder="Clinical notes, medications in transit, baseline vitals..."
          />
        </div>

        {/* Submit Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#EDF5FA] rounded-2xl border border-[#DCE8F0]">
          <div className="text-xs text-[#60758A] flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#176B87]" />
            <span>AI will match requirements against 6 regional hospital facilities</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#176B87] hover:bg-[#12566C] text-white font-bold text-sm shadow-md transition-all cursor-pointer active:scale-[0.99]"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Analyze Referral Requirements</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
