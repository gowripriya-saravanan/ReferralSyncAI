import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  ShieldCheck,
  ArrowRight,
  MapPin,
  X,
} from 'lucide-react';
import type { Hospital } from '../../types/referral';

export const HospitalsPage: React.FC = () => {
  const { hospitals, runAiRequirementAnalysis } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [selectedHospitalForModal, setSelectedHospitalForModal] = useState<Hospital | null>(null);

  const filteredHospitals = hospitals.filter((hosp) => {
    const matchesSearch =
      !searchTerm ||
      hosp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hosp.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hosp.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hosp.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      hosp.equipment.some((e) => e.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCity = cityFilter === 'All' || hosp.city === cityFilter;
    const matchesType = typeFilter === 'All' || hosp.type === typeFilter;
    const matchesSpecialty =
      specialtyFilter === 'All' ||
      hosp.specialties.some((s) => s.toLowerCase().includes(specialtyFilter.toLowerCase()));
    const matchesAvailability =
      availabilityFilter === 'All' || hosp.availabilityStatus === availabilityFilter;

    return matchesSearch && matchesCity && matchesType && matchesSpecialty && matchesAvailability;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#17324D] tracking-tight">
            Regional Hospital Capability Directory
          </h2>
          <p className="text-xs text-[#60758A]">
            Verified equipment, clinical sub-specialties, and acute bed readiness across network facilities.
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#EDF5FA] border border-[#C9DCE8] text-[#176B87] w-fit flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#176B87]" />
          <span>Synthetic / Demo Hospital Data</span>
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#60758A]" />
          <input
            type="text"
            placeholder="Search hospitals, equipment, specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white text-xs text-[#17324D] placeholder-[#60758A]/60 rounded-xl border border-[#C9DCE8] focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* City */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="bg-white border border-[#C9DCE8] text-[#17324D] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#176B87]"
          >
            <option value="All">All Cities</option>
            <option value="Coimbatore">Coimbatore</option>
            <option value="Tiruppur">Tiruppur</option>
          </select>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-[#C9DCE8] text-[#17324D] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#176B87]"
          >
            <option value="All">All Types</option>
            <option value="Government">Government</option>
            <option value="Private">Private</option>
            <option value="Multi-specialty">Multi-specialty</option>
            <option value="Specialty">Specialty</option>
          </select>

          {/* Specialty */}
          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="bg-white border border-[#C9DCE8] text-[#17324D] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#176B87]"
          >
            <option value="All">All Specialties</option>
            <option value="Neurology">Neurology</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Trauma">Trauma & Orthopedics</option>
            <option value="Pulmonology">Pulmonology</option>
            <option value="Oncology">Oncology</option>
          </select>

          {/* Availability */}
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="bg-white border border-[#C9DCE8] text-[#17324D] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#176B87]"
          >
            <option value="All">All Availability</option>
            <option value="Beds Available">Beds Available</option>
            <option value="Limited Capacity">Limited Capacity</option>
            <option value="Critical Only">Critical Only</option>
          </select>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] hover:border-[#176B87]/50 transition-all p-5 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EDF5FA] text-[#60758A] border border-[#DCE8F0]">
                      {hosp.type}
                    </span>
                    {hosp.emergency24x7Available && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#2E9D68]/10 text-[#2E9D68] border border-[#2E9D68]/30">
                        24x7 Emergency
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-[#17324D]">{hosp.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-[#60758A] mt-0.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#60758A]" />
                      {hosp.city} ({hosp.distanceKm} km from Metro Care)
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                    hosp.availabilityStatus === 'Beds Available'
                      ? 'bg-[#2E9D68]/10 text-[#2E9D68] border border-[#2E9D68]/30'
                      : 'bg-[#E9A23B]/10 text-[#E9A23B] border border-[#E9A23B]/30'
                  }`}
                >
                  {hosp.availabilityStatus} ({hosp.icuBedsAvailable} ICU beds)
                </span>
              </div>

              {/* Specialties */}
              <div className="mt-3.5 space-y-2 text-xs">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#60758A] block mb-1">
                    Specialties
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {hosp.specialties.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#F4F8FC] text-[#60758A] border border-[#DCE8F0]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#60758A] block mb-1">
                    Verified Equipment
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {hosp.equipment.map((eq, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#EDF5FA] text-[#176B87] font-medium border border-[#C9DCE8]"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#60758A] block mb-1">
                    Facilities & Emergency
                  </span>
                  <div className="flex items-center gap-2 text-[#60758A]">
                    <span>{hosp.facilities.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#DCE8F0] flex items-center justify-between text-xs">
              <span className="text-[#60758A] text-[11px]">Updated {hosp.lastUpdated}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedHospitalForModal(hosp)}
                  className="px-3 py-1.5 rounded-lg border border-[#DCE8F0] text-[#17324D] hover:bg-[#F4F8FC] font-semibold cursor-pointer transition-colors"
                >
                  Details
                </button>
                <button
                  onClick={() => {
                    runAiRequirementAnalysis(
                      `Referral to ${hosp.name} for specialist care.`,
                      { specialty: hosp.specialties[0] }
                    );
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#176B87] hover:bg-[#12566C] text-white font-semibold cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <span>Select for Referral</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
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
                {selectedHospitalForModal.type} Hospital
              </span>
              <span className="text-[10px] text-[#60758A]">
                ABDM Compatible Record • {selectedHospitalForModal.id}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#17324D]">{selectedHospitalForModal.name}</h3>
            <p className="text-xs text-[#60758A] mb-3">{selectedHospitalForModal.address}</p>

            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0] text-[11px] mb-3">
              <div>
                <span className="text-[#60758A] block">Location Coordinates</span>
                <span className="font-semibold text-[#17324D]">
                  {selectedHospitalForModal.latitude}, {selectedHospitalForModal.longitude}
                </span>
              </div>
              <div>
                <span className="text-[#60758A] block">Bed Readiness</span>
                <span className="font-semibold text-[#17324D]">
                  {selectedHospitalForModal.bedAvailability} ({selectedHospitalForModal.icuBedsAvailable} ICU)
                </span>
              </div>
              <div>
                <span className="text-[#60758A] block">24x7 Emergency</span>
                <span className="font-semibold text-[#2E9D68]">
                  {selectedHospitalForModal.emergency24x7Available ? 'Verified Active' : 'Daytime Only'}
                </span>
              </div>
              <div>
                <span className="text-[#60758A] block">Ambulance Service</span>
                <span className="font-semibold text-[#17324D]">
                  {selectedHospitalForModal.ambulanceAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0]">
                <span className="font-bold text-[#17324D] block mb-1">Clinical Specialties</span>
                <p className="text-[#60758A]">{selectedHospitalForModal.specialties.join(', ')}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0]">
                <span className="font-bold text-[#17324D] block mb-1">Available Equipment</span>
                <p className="text-[#60758A]">{selectedHospitalForModal.equipment.join(', ')}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0]">
                <span className="font-bold text-[#17324D] block mb-1">Clinical Facilities</span>
                <p className="text-[#60758A]">{selectedHospitalForModal.facilities.join(', ')}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#EDF5FA] border border-[#C9DCE8]">
                <span className="font-bold text-[#176B87] block mb-1">Referral Intake Contact</span>
                <p className="text-[#17324D]">Coordinator: {selectedHospitalForModal.referralContact.coordinator}</p>
                <p className="text-[#17324D]">Phone: {selectedHospitalForModal.referralContact.phone}</p>
                <p className="text-[#17324D]">Triage Hotline: {selectedHospitalForModal.referralContact.hotline}</p>
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
                  const target = selectedHospitalForModal;
                  setSelectedHospitalForModal(null);
                  runAiRequirementAnalysis(
                    `Referral to ${target.name} for specialist care.`,
                    { specialty: target.specialties[0] }
                  );
                }}
                className="px-4 py-2 rounded-xl bg-[#176B87] text-white text-xs font-semibold hover:bg-[#12566C] cursor-pointer transition-colors"
              >
                Select for Referral
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

