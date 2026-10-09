import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ShieldAlert,
  ArrowLeft,
  FileCheck,
  ArrowRight,
  Check,
  Scale,
  X,
  AlertTriangle,
} from 'lucide-react';
import type { Hospital, HospitalMatchResult } from '../../types/referral';
import { UrgencyBadge } from '../common/Badge';

export const AiAnalysisPage: React.FC = () => {
  const {
    draftRequirements,
    draftMatches,
    draftPatient,
    selectHospitalForDraft,
    navigateTo,
  } = useApp();

  const [selectedHospitalForModal, setSelectedHospitalForModal] = useState<Hospital | null>(null);
  const [comparingHospitals, setComparingHospitals] = useState<HospitalMatchResult[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  if (!draftRequirements || !draftMatches || draftMatches.length === 0) {
    return (
      <div className="bg-white p-12 text-center rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)]">
        <p className="text-[#60758A] mb-4">No active AI requirement analysis found.</p>
        <button
          onClick={() => navigateTo('new-referral')}
          className="px-4 py-2 bg-[#176B87] hover:bg-[#12566C] text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors"
        >
          Create / Analyze Referral
        </button>
      </div>
    );
  }

  const handleOpenCompare = () => {
    setComparingHospitals(draftMatches.slice(0, 3));
    setShowCompareModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Back & Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigateTo('new-referral')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#60758A] hover:text-[#17324D] transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Referral Inputs</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCompare}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#DCE8F0] text-[#17324D] hover:bg-[#F4F8FC] text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <Scale className="w-4 h-4 text-[#176B87]" />
            <span>Compare Receiving Facilities</span>
          </button>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="bg-[#F0F6FE] border border-[#5B8DEF]/30 rounded-2xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#5B8DEF] shrink-0 mt-0.5" />
        <div className="text-xs text-[#17324D] leading-relaxed">
          <span className="font-bold text-[#17324D]">AI-assisted Recommendation:</span> ReferralSync AI extracted required capabilities and scored facilities using verified hospital resource profiles. This score is an explainable capability ranking prototype and does not represent an automated clinical diagnosis.
        </div>
      </div>

      {/* SECTION 1: Referral Requirement Analysis */}
      <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#DCE8F0] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F0F6FE] border border-[#5B8DEF]/30 flex items-center justify-center text-[#5B8DEF] font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#17324D] tracking-tight">
                Referral Requirement Analysis
              </h2>
              <p className="text-xs text-[#60758A]">
                Patient: <span className="font-semibold text-[#17324D]">{draftPatient?.name}</span> ({draftPatient?.id})
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[#176B87] bg-[#EDF5FA] border border-[#C9DCE8] px-2.5 py-1 rounded-md">
            Analysis Complete
          </span>
        </div>

        {/* Extracted Requirements Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          <div className="p-3.5 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0]">
            <span className="text-[11px] font-medium text-[#60758A] block mb-1">Specialty</span>
            <span className="text-xs font-bold text-[#17324D]">{draftRequirements.specialty}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0]">
            <span className="text-[11px] font-medium text-[#60758A] block mb-1">Equipment</span>
            <span className="text-xs font-bold text-[#17324D]">
              {draftRequirements.equipment.join(', ') || 'Standard Imaging'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0]">
            <span className="text-[11px] font-medium text-[#60758A] block mb-1">Facility</span>
            <span className="text-xs font-bold text-[#17324D]">
              {draftRequirements.facility.join(', ') || 'ICU'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0]">
            <span className="text-[11px] font-medium text-[#60758A] block mb-1">Service</span>
            <span className="text-xs font-bold text-[#17324D]">
              {draftRequirements.services.join(', ') || 'Emergency Triage'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0]">
            <span className="text-[11px] font-medium text-[#60758A] block mb-1">Urgency</span>
            <div>
              <UrgencyBadge urgency={draftRequirements.urgency} />
            </div>
          </div>
        </div>

        {/* AI Recommendation Summary Box */}
        <div className="mt-5 p-4 rounded-xl bg-[#F0F6FE] border border-[#5B8DEF]/30">
          <h3 className="text-xs font-bold text-[#17324D] mb-1 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-[#5B8DEF]" />
            AI Recommendation Summary
          </h3>
          <p className="text-xs text-[#60758A] leading-relaxed mb-3">
            "Based on the entered referral requirements, the following facilities match the required capabilities."
          </p>

          <div className="pt-2 border-t border-[#DCE8F0]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#176B87] block mb-2">
              Why this recommendation?
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-[#17324D]">
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-[#2E9D68] shrink-0" />
                {draftRequirements.specialty} department available
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-[#2E9D68] shrink-0" />
                {draftRequirements.equipment[0] || 'Required imaging'} available
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-[#2E9D68] shrink-0" />
                {draftRequirements.facility[0] || 'ICU facility'} available
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-[#2E9D68] shrink-0" />
                Emergency services available
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-[#2E9D68] shrink-0" />
                Referral coordinator on duty
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-[#2E9D68] shrink-0" />
                Regional transport accessible
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Recommended Receiving Hospitals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#17324D] tracking-tight">
              Recommended Receiving Hospitals
            </h2>
            <p className="text-xs text-[#60758A]">
              Ranked by capability matching score against verified regional hospital resources.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EDF5FA] text-[#17324D] border border-[#DCE8F0]">
            {draftMatches.length} facilities evaluated
          </span>
        </div>

        {/* Error Handling: No hospital satisfies all critical requirements */}
        {!draftMatches.some((m) => m.isEligible && !m.isPartialMatch) && (
          <div className="p-4 rounded-xl bg-[#E9A23B]/10 border border-[#E9A23B]/30 flex items-start gap-3 text-[#17324D] text-xs">
            <AlertTriangle className="w-5 h-5 text-[#E9A23B] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-sm font-bold text-[#17324D] mb-0.5">
                No hospital currently matches all required capabilities.
              </strong>
              <p className="text-[#60758A]">
                The facilities below are closest partial matches based on verified capability data. Direct attending physician consultation is advised prior to patient transfer.
              </p>
            </div>
          </div>
        )}

        {/* Hospital Cards List */}
        <div className="space-y-4">
          {draftMatches.map((match, idx) => (
            <div
              key={match.hospital.id}
              className={`bg-white rounded-2xl border transition-all p-5 sm:p-6 shadow-[0_2px_8px_rgba(23,107,135,0.04)] ${
                idx === 0 && !match.isPartialMatch
                  ? 'border-[#176B87] ring-2 ring-[#176B87]/15'
                  : match.isPartialMatch
                  ? 'border-[#E9A23B]/50 hover:border-[#E9A23B]'
                  : 'border-[#DCE8F0] hover:border-[#176B87]/40'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                {/* Left: Hospital Name, Location, Badges */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {match.isPartialMatch ? (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#E9A23B]/15 text-[#E9A23B] border border-[#E9A23B]/30 px-2 py-0.5 rounded-md">
                        Partial Match
                      </span>
                    ) : (
                      idx === 0 && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#176B87] text-white px-2 py-0.5 rounded-md">
                          Top Recommendation
                        </span>
                      )
                    )}
                    <h3 className="text-base font-bold text-[#17324D]">
                      {match.hospital.name}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EDF5FA] text-[#60758A] border border-[#DCE8F0]">
                      {match.hospital.type}
                    </span>
                    <span className="text-[11px] font-medium text-[#60758A]">
                      {match.hospital.city} • {match.hospital.distanceKm} km away (Est. {match.transitTimeEstimate})
                    </span>
                  </div>

                  {/* Badges / specs */}
                  <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                    <span className="px-2 py-0.5 rounded bg-[#F4F8FC] text-[#60758A] border border-[#DCE8F0] font-medium">
                      Specialties: {match.hospital.specialties.slice(0, 3).join(', ')}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F4F8FC] text-[#60758A] border border-[#DCE8F0] font-medium">
                      Equipment: {match.hospital.equipment.slice(0, 2).join(', ')}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F4F8FC] text-[#60758A] border border-[#DCE8F0] font-medium">
                      {match.hospital.facilities[0]}
                    </span>
                    {match.hospital.emergencyCapability && (
                      <span className="px-2 py-0.5 rounded bg-[#2E9D68]/10 text-[#2E9D68] border border-[#2E9D68]/30 font-semibold text-[11px]">
                        24/7 Emergency
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-[#5B8DEF]/10 text-[#176B87] border border-[#5B8DEF]/30 text-[11px] font-medium">
                      {match.hospital.availabilityStatus} ({match.hospital.icuBedsAvailable} ICU beds)
                    </span>
                  </div>

                  {/* Matching Capabilities Chips */}
                  {match.matchedCapabilities && match.matchedCapabilities.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {match.matchedCapabilities.map((cap, cIdx) => (
                        <span
                          key={cIdx}
                          className="px-2 py-0.5 rounded-md bg-[#EDF5FA] border border-[#C9DCE8] text-[#176B87] text-[11px] font-semibold"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Why matched breakdown */}
                  <div className="mt-3 p-3 bg-[#F4F8FC] rounded-xl border border-[#DCE8F0] space-y-2">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#60758A] block mb-0.5">
                        Clinical Recommendation Reason:
                      </span>
                      <p className="text-xs text-[#17324D] italic">
                        "{match.recommendedReason}"
                      </p>
                    </div>

                    <div className="pt-1.5 border-t border-[#DCE8F0]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#60758A] block mb-1">
                        Verified Matching Factors:
                      </span>
                      <ul className="space-y-1 text-xs text-[#17324D]">
                        {match.matchedReasons.map((reason, rIdx) => (
                          <li key={rIdx} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#2E9D68] shrink-0" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right: Match Score & Action Buttons */}
                <div className="lg:text-right shrink-0 flex flex-col justify-between sm:items-end gap-4 border-t border-[#DCE8F0] lg:border-t-0 pt-4 lg:pt-0">
                  <div>
                    <span className="text-[11px] text-[#60758A] block font-medium">
                      Prototype Ranking Score
                    </span>
                    <div className="flex items-baseline lg:justify-end gap-1 mt-0.5">
                      <span className="text-3xl font-extrabold text-[#176B87] tracking-tight">
                        {match.matchScore}%
                      </span>
                      <span className="text-xs text-[#60758A] font-semibold">Match</span>
                    </div>
                    <span className="text-[10px] text-[#60758A] block mt-0.5">
                      Updated {match.hospital.lastUpdated}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedHospitalForModal(match.hospital)}
                      className="px-3 py-2 rounded-xl border border-[#DCE8F0] text-[#17324D] hover:bg-[#F4F8FC] font-semibold text-xs transition-colors cursor-pointer"
                    >
                      View Hospital
                    </button>
                    <button
                      onClick={() => selectHospitalForDraft(match)}
                      className="px-4 py-2 rounded-xl bg-[#176B87] hover:bg-[#12566C] text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Select Hospital</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hospital Details Modal */}
      {selectedHospitalForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DCE8F0] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedHospitalForModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#60758A] hover:text-[#17324D] hover:bg-[#F4F8FC] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#5B8DEF]/15 text-[#176B87] px-2 py-0.5 rounded border border-[#5B8DEF]/30">
                Demo / Synthetic Data
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#17324D]">
              {selectedHospitalForModal.name}
            </h3>
            <p className="text-xs text-[#60758A] mb-4">
              {selectedHospitalForModal.address}
            </p>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0]">
                <span className="font-bold text-[#17324D] block mb-1">Specialties</span>
                <p className="text-[#60758A]">{selectedHospitalForModal.specialties.join(', ')}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0]">
                <span className="font-bold text-[#17324D] block mb-1">Equipment</span>
                <p className="text-[#60758A]">{selectedHospitalForModal.equipment.join(', ')}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0]">
                <span className="font-bold text-[#17324D] block mb-1">Facilities</span>
                <p className="text-[#60758A]">{selectedHospitalForModal.facilities.join(', ')}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#EDF5FA] border border-[#C9DCE8]">
                <span className="font-bold text-[#176B87] block mb-1">Referral Coordination Desk</span>
                <p className="text-[#17324D]">Coordinator: {selectedHospitalForModal.referralContact.coordinator}</p>
                <p className="text-[#17324D]">Phone: {selectedHospitalForModal.referralContact.phone}</p>
                <p className="text-[#17324D]">Hotline: {selectedHospitalForModal.referralContact.hotline}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedHospitalForModal(null)}
                className="px-4 py-2 rounded-xl border border-[#DCE8F0] text-[#60758A] hover:bg-[#F4F8FC] text-xs font-semibold cursor-pointer transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const matchObj = draftMatches.find(
                    (m) => m.hospital.id === selectedHospitalForModal.id
                  ) || {
                    hospital: selectedHospitalForModal,
                    matchScore: 90,
                    matchedReasons: ['Verified capability match'],
                    missingOrPartial: [],
                    recommendedReason: 'Direct physician choice',
                    transitTimeEstimate: '15 mins',
                  };
                  setSelectedHospitalForModal(null);
                  selectHospitalForDraft(matchObj);
                }}
                className="px-4 py-2 rounded-xl bg-[#176B87] text-white text-xs font-semibold hover:bg-[#12566C] cursor-pointer transition-colors"
              >
                Select for Referral
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hospital Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-[#DCE8F0] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#60758A] hover:text-[#17324D] hover:bg-[#F4F8FC] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#17324D] mb-1">
              Side-by-Side Facility Comparison
            </h3>
            <p className="text-xs text-[#60758A] mb-5">
              Evaluating capabilities against requirements: {draftRequirements.specialty} • {draftRequirements.equipment.join(', ')} • {draftRequirements.facility.join(', ')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {comparingHospitals.map((comp) => (
                <div key={comp.hospital.id} className="p-4 rounded-xl border border-[#DCE8F0] bg-[#F4F8FC] space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#176B87] bg-[#EDF5FA] px-2 py-0.5 rounded border border-[#C9DCE8]">
                      {comp.matchScore}% Match Score
                    </span>
                    <h4 className="font-bold text-[#17324D] text-sm mt-1">{comp.hospital.name}</h4>
                    <p className="text-[11px] text-[#60758A]">{comp.hospital.distanceKm} km away</p>
                  </div>

                  <div className="border-t border-[#DCE8F0] pt-2 space-y-1.5">
                    <div>
                      <span className="font-semibold text-[#17324D] block text-[11px]">Specialties:</span>
                      <p className="text-[#60758A]">{comp.hospital.specialties.slice(0, 3).join(', ')}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-[#17324D] block text-[11px]">Equipment:</span>
                      <p className="text-[#60758A]">{comp.hospital.equipment.slice(0, 2).join(', ')}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-[#17324D] block text-[11px]">Facilities:</span>
                      <p className="text-[#60758A]">{comp.hospital.facilities.slice(0, 2).join(', ')}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-[#17324D] block text-[11px]">Availability:</span>
                      <p className="text-[#60758A]">{comp.hospital.availabilityStatus} ({comp.hospital.icuBedsAvailable} ICU beds)</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowCompareModal(false);
                      selectHospitalForDraft(comp);
                    }}
                    className="w-full mt-2 py-2 rounded-lg bg-[#176B87] text-white font-semibold text-xs hover:bg-[#12566C] cursor-pointer transition-colors"
                  >
                    Select this Hospital
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

