import React, { useState } from 'react';
import { Search, Bell, Menu, Shield, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { doctor, navigateTo, activePage, showToast, logout, isReceivingDoctor } = useApp();
  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const getPageTitle = () => {
    switch (activePage) {
      case 'dashboard':
        return { title: 'Good Morning, Doctor', subtitle: "Here's your referral coordination overview." };
      case 'receiving-dashboard':
        return {
          title: 'Receiving Hospital Intake Station',
          subtitle: `Incoming clinical triage & bed allocation • ${doctor.hospital}`,
        };
      case 'receiving-accepted':
        return {
          title: 'Accepted & In-Transit Patients',
          subtitle: `Active admissions and transfer tracking • ${doctor.hospital}`,
        };
      case 'patients':
        return { title: 'Patient Directory', subtitle: 'Manage active patient cases and referral needs' };
      case 'patient-details':
        return { title: 'Patient Clinical Profile', subtitle: 'Clinical status and transfer requirement specification' };
      case 'new-referral':
        return { title: 'New Referral Intake', subtitle: 'Enter patient requirements or provide clinical free-text for AI extraction' };
      case 'ai-analysis':
        return { title: 'Referral Requirement Analysis', subtitle: 'Structured capability extraction and facility evaluation' };
      case 'hospital-matching':
        return { title: 'Recommended Receiving Hospitals', subtitle: 'Prototype capability ranking based on verified regional data' };
      case 'doctor-review':
        return { title: 'Review AI Recommendation', subtitle: 'Physician verification & formal transfer authorization' };
      case 'referrals':
        return { title: 'Active & Historical Referrals', subtitle: 'Cross-facility tracking and clinical coordination logs' };
      case 'referral-details':
        return { title: 'Referral Timeline & Tracking', subtitle: 'End-to-end patient transfer audit log and facility response' };
      case 'hospitals':
        return { title: 'Regional Hospital Directory', subtitle: 'Verified hospital capabilities, equipment, and bed capacity' };
      case 'ai-assistant':
        return { title: 'Clinical Referral AI Assistant', subtitle: 'Interactive facility matching and capability inquiry support' };
      case 'analytics':
        return { title: 'Referral Velocity & Capacity Analytics', subtitle: 'Coordination metrics, facility distribution, and review performance' };
      case 'settings':
        return { title: 'Settings & Clinical Preferences', subtitle: 'Physician profile, notification parameters, and regional routing rules' };
      default:
        return { title: 'Referral Coordination System', subtitle: 'Metro Care General Hospital Network' };
    }
  };

  const { title, subtitle } = getPageTitle();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    showToast('Search executed', `Filtered regional records for "${searchVal}"`, 'info');
    if (activePage !== 'patients' && activePage !== 'referrals' && activePage !== 'hospitals') {
      navigateTo('patients');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-[#176B87] to-[#2A9D8F] text-white border-b border-[#12566C]/30 shadow-xs px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Dynamic page heading */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {title}
              </h1>
              {activePage === 'dashboard' && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-white/15 px-2 py-0.5 rounded-full border border-white/25">
                  <Shield className="w-3 h-3 text-white" /> Attending
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-white/80 font-normal">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right: Search, Notification popover, Doctor profile */}
        <div className="flex items-center gap-3 sm:gap-4 relative">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-64 lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70" />
            <input
              type="text"
              placeholder="Search patients, hospitals, IDs..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/15 hover:bg-white/20 focus:bg-white text-sm text-white focus:text-[#17324D] placeholder-white/70 rounded-xl border border-white/25 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all font-medium"
            />
          </form>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5 stroke-[1.8]" />
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[1rem] px-1 items-center justify-center rounded-full bg-[#E9A23B] text-white text-[10px] font-bold shadow-xs">
                3
              </span>
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#DCE8F0] p-4 z-50 text-[#17324D] animate-in fade-in-50 zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-[#DCE8F0] mb-3">
                  <h3 className="text-sm font-bold text-[#17324D]">Coordination Alerts</h3>
                  <span className="text-[11px] text-[#176B87] bg-[#EDF5FA] font-semibold px-2 py-0.5 rounded-md border border-[#DCE8F0]">
                    3 unread
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      navigateTo('referrals', { referralId: 'REF-2026-079' });
                    }}
                    className="p-2.5 rounded-xl bg-[#EDF5FA] hover:bg-[#EDF5FA]/80 border border-[#DCE8F0] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between font-semibold text-[#176B87]">
                      <span>Hospital Acceptance</span>
                      <span className="text-[10px] text-[#60758A] font-normal">8 mins ago</span>
                    </div>
                    <p className="text-[#60758A] mt-1">
                      Regional Neuro & Trauma Hospital accepted referral for <b>Priya Sharma</b>.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      navigateTo('referrals', { referralId: 'REF-2026-081' });
                    }}
                    className="p-2.5 rounded-xl bg-[#F0F6FE] hover:bg-[#F0F6FE]/80 border border-[#5B8DEF]/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between font-semibold text-[#5B8DEF]">
                      <span>Ambulance En Route</span>
                      <span className="text-[10px] text-[#60758A] font-normal">14 mins ago</span>
                    </div>
                    <p className="text-[#60758A] mt-1">
                      ALS-04 dispatched with patient <b>Arjun Kumar</b> to Kongu Heart.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setShowNotifications(false);
                      navigateTo('new-referral');
                    }}
                    className="p-2.5 rounded-xl bg-[#E9A23B]/10 hover:bg-[#E9A23B]/15 border border-[#E9A23B]/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between font-semibold text-[#B8771A]">
                      <span>Doctor Review Required</span>
                      <span className="text-[10px] text-[#60758A] font-normal">25 mins ago</span>
                    </div>
                    <p className="text-[#60758A] mt-1">
                      Pelvic trauma intake for <b>Rahul Kumar</b> requires physician authorization.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Doctor Profile */}
          <div
            onClick={() => navigateTo('settings')}
            className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-white/20 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 border border-white/25 group-hover:border-white flex items-center justify-center text-base sm:text-lg shadow-xs select-none transition-colors">
                <span role="img" aria-label="Doctor">{isReceivingDoctor ? '🏥' : '👨‍⚕️'}</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#2E9D68] border-2 border-[#176B87] rounded-full shadow-xs" />
            </div>

            <div className="hidden xl:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white transition-colors">
                  {doctor.name}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-white/20 text-white border-white/30">
                  {isReceivingDoctor ? 'Receiving' : 'Referring'}
                </span>
              </div>
              <p className="text-[11px] text-white/80 font-medium leading-none mt-0.5 truncate max-w-[170px]">
                {doctor.department}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            title="Sign out of ReferralSync AI"
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-white hover:bg-white/15 border border-white/25 transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
          >
            <LogOut className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
