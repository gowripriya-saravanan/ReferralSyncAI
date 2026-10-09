import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, Plus, ArrowRight } from 'lucide-react';
import { StatusBadge, UrgencyBadge } from '../common/Badge';

export const PatientsPage: React.FC = () => {
  const { patients, navigateTo, startReferralForPatient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      !searchTerm ||
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.requiredSpecialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.referralRequirement.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || patient.referralStatus === statusFilter;

    const matchesUrgency =
      urgencyFilter === 'All' || patient.urgency === urgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#17324D] tracking-tight">
            Patient Management & Referral Triage
          </h2>
          <p className="text-xs text-[#60758A]">
            Select a patient to inspect clinical care logs or initiate AI-assisted facility matching.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigateTo('new-referral')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#176B87] hover:bg-[#12566C] text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Referral Intake</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#60758A]" />
          <input
            type="text"
            placeholder="Search by name, ID, specialty, or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white text-xs text-[#17324D] placeholder-[#60758A]/60 rounded-xl border border-[#C9DCE8] focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-[#60758A]">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[#C9DCE8] text-[#17324D] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#176B87]"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="AI Recommended">AI Recommended</option>
              <option value="Doctor Approved">Doctor Approved</option>
              <option value="Hospital Accepted">Hospital Accepted</option>
              <option value="In Transfer">In Transfer</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#60758A]">
            <span>Urgency:</span>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="bg-white border border-[#C9DCE8] text-[#17324D] text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#176B87]"
            >
              <option value="All">All Urgencies</option>
              <option value="Emergency">Emergency</option>
              <option value="Urgent">Urgent</option>
              <option value="Routine">Routine</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F8FC] border-b border-[#DCE8F0] text-[11px] font-bold uppercase tracking-wider text-[#60758A]">
                <th className="py-3 px-5">Patient</th>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-3">Age/Sex</th>
                <th className="py-3 px-4">Current Hospital</th>
                <th className="py-3 px-5">Condition / Referral Need</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Referral Status</th>
                <th className="py-3 px-4">Last Updated</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE8F0] text-xs">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#60758A]">
                    No patients match your current filter parameters.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-[#F4F8FC] transition-colors group"
                  >
                    {/* Patient */}
                    <td className="py-3.5 px-5">
                      <div
                        onClick={() => navigateTo('patient-details', { patientId: patient.id })}
                        className="font-bold text-[#17324D] group-hover:text-[#176B87] cursor-pointer flex items-center gap-1.5"
                      >
                        {patient.name}
                      </div>
                      <div className="text-[11px] text-[#60758A]">
                        {patient.phone || 'Contact on file'}
                      </div>
                    </td>

                    {/* Patient ID */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-semibold px-2 py-0.5 rounded bg-[#EDF5FA] text-[#176B87] border border-[#C9DCE8]">
                        {patient.id}
                      </span>
                    </td>

                    {/* Age / Gender */}
                    <td className="py-3.5 px-3 whitespace-nowrap text-[#60758A]">
                      {patient.age}y / {patient.gender[0]}
                    </td>

                    {/* Current Hospital */}
                    <td className="py-3.5 px-4 text-[#60758A] max-w-[150px] truncate">
                      {patient.currentHospital}
                    </td>

                    {/* Condition / Referral Need */}
                    <td className="py-3.5 px-5 max-w-[260px]">
                      <div className="font-medium text-[#17324D] line-clamp-1">
                        {patient.referralRequirement}
                      </div>
                      <div className="text-[11px] text-[#176B87] font-semibold mt-0.5">
                        Needs: {patient.requiredSpecialty} • {patient.requiredEquipment}
                      </div>
                    </td>

                    {/* Urgency */}
                    <td className="py-3.5 px-4">
                      <UrgencyBadge urgency={patient.urgency} />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={patient.referralStatus} />
                    </td>

                    {/* Last Updated */}
                    <td className="py-3.5 px-4 text-[#60758A] whitespace-nowrap">
                      {patient.lastUpdated}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigateTo('patient-details', { patientId: patient.id })}
                          className="px-2.5 py-1.5 rounded-lg border border-[#DCE8F0] text-[#17324D] hover:bg-[#F4F8FC] font-medium text-[11px] transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => startReferralForPatient(patient.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#176B87] hover:bg-[#12566C] text-white font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <span>Refer</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#F4F8FC] border-t border-[#DCE8F0] flex items-center justify-between text-xs text-[#60758A]">
          <span>Showing {filteredPatients.length} of {patients.length} admitted patients</span>
          <span className="text-[11px] text-[#60758A]">Synthetic clinical records</span>
        </div>
      </div>
    </div>
  );
};

