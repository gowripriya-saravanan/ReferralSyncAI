import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Bell,
  Lock,
  Building,
  Save,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { doctor, showToast } = useApp();

  const [notifications, setNotifications] = useState({
    urgentTransfers: true,
    bedCapacityChanges: true,
    statusUpdates: true,
    aiSuggestions: true,
  });

  const [referralPrefs, setReferralPrefs] = useState({
    maxRadiusKm: 50,
    preferredBedTier: 'ICU / CCU',
    defaultUrgency: 'Urgent',
    requireSecondPhysicianSignoff: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'Doctor clinical profile and referral preferences updated.', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#17324D] tracking-tight">
            System Settings & Clinical Preferences
          </h2>
          <p className="text-xs text-[#60758A]">
            Configure physician credentials, regional referral radius, and automated notification thresholds.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#176B87] hover:bg-[#12566C] text-white font-semibold text-xs shadow-xs cursor-pointer transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Doctor Profile */}
        <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#60758A] flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#176B87]" /> 1. Doctor Profile & Credentials
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0]">
            <div className="w-16 h-16 rounded-full bg-white border border-[#DCE8F0] flex items-center justify-center text-3xl shadow-xs select-none">
              <span role="img" aria-label="Doctor">👨‍⚕️</span>
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1">
              <h4 className="text-base font-bold text-[#17324D]">{doctor.name}</h4>
              <p className="text-xs text-[#60758A] font-medium">{doctor.title}</p>
              <p className="text-xs text-[#60758A]">{doctor.hospital} • {doctor.department}</p>
              <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                <span className="text-[10px] font-bold text-[#2E9D68] bg-[#2E9D68]/10 px-2 py-0.5 rounded border border-[#2E9D68]/20">
                  Medical License Verified
                </span>
                <span className="text-[10px] font-bold text-[#176B87] bg-[#176B87]/10 px-2 py-0.5 rounded border border-[#176B87]/20">
                  Attending Physician
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Referral Coordination Preferences */}
        <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#60758A] flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-[#176B87]" /> 2. Referral Routing Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#17324D] mb-1.5">
                Default Search Radius (km)
              </label>
              <input
                type="number"
                value={referralPrefs.maxRadiusKm}
                onChange={(e) =>
                  setReferralPrefs({ ...referralPrefs, maxRadiusKm: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-[#F4F8FC] border border-[#C9DCE8] focus:border-[#176B87] focus:ring-1 focus:ring-[#176B87] rounded-xl text-[#17324D]"
              />
              <span className="text-[11px] text-[#60758A] mt-1 block">
                Receiving hospitals within this distance are prioritized.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-[#17324D] mb-1.5">
                Default Intake Urgency
              </label>
              <select
                value={referralPrefs.defaultUrgency}
                onChange={(e) =>
                  setReferralPrefs({ ...referralPrefs, defaultUrgency: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#F4F8FC] border border-[#C9DCE8] focus:border-[#176B87] focus:ring-1 focus:ring-[#176B87] rounded-xl text-[#17324D]"
              >
                <option value="Emergency">Emergency</option>
                <option value="Urgent">Urgent</option>
                <option value="Routine">Routine</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Notification Preferences */}
        <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#60758A] flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-[#176B87]" /> 3. Alert & Notification Preferences
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0] cursor-pointer">
              <div>
                <span className="font-bold text-[#17324D] block">Urgent Transfer Alerts</span>
                <span className="text-[#60758A] text-[11px]">Instant chime when emergency transfer request arrives</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.urgentTransfers}
                onChange={(e) =>
                  setNotifications({ ...notifications, urgentTransfers: e.target.checked })
                }
                className="w-4 h-4 text-[#176B87] rounded focus:ring-[#176B87] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0] cursor-pointer">
              <div>
                <span className="font-bold text-[#17324D] block">Receiving Facility Acceptance Alerts</span>
                <span className="text-[#60758A] text-[11px]">Notify when destination hospital confirms ICU bed reservation</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.bedCapacityChanges}
                onChange={(e) =>
                  setNotifications({ ...notifications, bedCapacityChanges: e.target.checked })
                }
                className="w-4 h-4 text-[#176B87] rounded focus:ring-[#176B87] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0] cursor-pointer">
              <div>
                <span className="font-bold text-[#17324D] block">AI Capability Insights</span>
                <span className="text-[#60758A] text-[11px]">Notify when automated hospital matching updates ranking scores</span>
              </div>
              <input
                type="checkbox"
                checked={notifications.aiSuggestions}
                onChange={(e) =>
                  setNotifications({ ...notifications, aiSuggestions: e.target.checked })
                }
                className="w-4 h-4 text-[#176B87] rounded focus:ring-[#176B87] cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 4: Security & Clinical Privacy */}
        <div className="bg-white rounded-2xl border border-[#DCE8F0] shadow-[0_2px_8px_rgba(23,107,135,0.04)] p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#60758A] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#176B87]" /> 4. Security, HIPAA & Data Privacy
          </h3>

          <div className="p-4 rounded-xl bg-[#F4F8FC] border border-[#DCE8F0] space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-[#17324D] block">Two-Factor Physician Authentication</span>
                <span className="text-[#60758A] text-[11px]">Required for formal referral authorization sign-offs</span>
              </div>
              <span className="text-[11px] font-bold text-[#2E9D68] bg-[#2E9D68]/10 px-2 py-0.5 rounded border border-[#2E9D68]/20">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#DCE8F0]">
              <div>
                <span className="font-bold text-[#17324D] block">Synthetic Prototype Mode</span>
                <span className="text-[#60758A] text-[11px]">Using mock clinical data for safe hackathon demonstration</span>
              </div>
              <span className="text-[11px] font-bold text-[#5B8DEF] bg-[#F0F6FE] px-2 py-0.5 rounded border border-[#5B8DEF]/30">
                Demo Active
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

