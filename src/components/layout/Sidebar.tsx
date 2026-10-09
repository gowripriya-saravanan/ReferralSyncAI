import React from 'react';
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  FileText,
  Building2,
  Bot,
  BarChart3,
  Settings,
  ChevronRight,
  Inbox,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { AppPage } from '../../context/AppContext';

interface SidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: AppPage;
  label: string;
  icon: React.ElementType;
  badge?: string;
  isAction?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile,
  onCloseMobile,
}) => {
  const { activePage, navigateTo, doctor, referrals, patients, isReceivingDoctor, currentDoctorProfile } = useApp();

  const pendingCount = referrals.filter(
    (r) => r.status === 'Pending' || r.doctorApprovalStatus === 'Pending Review'
  ).length;

  const receivingPendingCount = referrals.filter(
    (r) =>
      (r.status === 'Pending' || r.hospitalResponse === 'Pending') &&
      (r.receivingHospitalId === (currentDoctorProfile?.hospital_id || 'hosp-001') ||
        (r.receivingHospital && r.receivingHospital.toLowerCase().includes((doctor.hospital || '').toLowerCase())))
  ).length;

  const navItems: NavItem[] = isReceivingDoctor
    ? [
        {
          id: 'receiving-dashboard',
          label: 'Incoming Referrals',
          icon: Inbox,
          badge: receivingPendingCount > 0 ? `${receivingPendingCount} Action` : undefined,
        },
        { id: 'referrals', label: 'Facility Referrals', icon: FileText },
        { id: 'hospitals', label: 'Regional Directory', icon: Building2 },
        { id: 'settings', label: 'Station Settings', icon: Settings },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'patients', label: 'Patients', icon: Users, badge: `${patients.length}` },
        { id: 'new-referral', label: 'New Referral', icon: PlusCircle, isAction: true },
        { id: 'referrals', label: 'Referrals', icon: FileText, badge: `${pendingCount} Pending` },
        { id: 'hospitals', label: 'Hospitals', icon: Building2 },
        { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'Live Triage' },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-[#17324D]/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#EDF5FA] border-r border-[#DCE8F0] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#DCE8F0] bg-white/70">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-[#17324D]">
                ReferralSync
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-[#5B8DEF] text-white rounded shadow-xs">
                AI
              </span>
            </div>
            <p className="text-[11px] text-[#60758A] font-medium tracking-tight">
              AI-assisted Referral Coordination
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-3.5 py-4 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-[#60758A]">
            {isReceivingDoctor ? 'Receiving Station' : 'Clinical Navigation'}
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                activePage === item.id ||
                (item.id === 'patients' && activePage === 'patient-details') ||
                (item.id === 'referrals' && activePage === 'referral-details') ||
                (item.id === 'new-referral' &&
                  (activePage === 'ai-analysis' ||
                    activePage === 'hospital-matching' ||
                    activePage === 'doctor-review'));

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-[#176B87] text-white shadow-sm font-semibold'
                      : 'text-[#60758A] hover:text-[#17324D] hover:bg-white/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-white stroke-[2.2]'
                          : 'text-[#60758A] group-hover:text-[#17324D] stroke-[1.8]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.id === 'ai-assistant'
                          ? 'bg-[#F0F6FE] text-[#5B8DEF] border border-[#5B8DEF]/30 font-bold'
                          : 'bg-white text-[#60758A] border border-[#DCE8F0]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {!item.badge && !isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#C9DCE8] opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Doctor Information Bar at bottom */}
        <div className="p-3.5 mx-3 mb-4 rounded-2xl bg-white border border-[#DCE8F0] shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[#EDF5FA] border border-[#DCE8F0] flex items-center justify-center text-base shadow-xs select-none">
                <span role="img" aria-label="Doctor">{isReceivingDoctor ? '🏥' : '👨‍⚕️'}</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2E9D68] border-2 border-white rounded-full shadow-xs" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-xs font-bold text-[#17324D] truncate">
                  {doctor.name}
                </h4>
              </div>
              <p className="text-[11px] text-[#60758A] truncate">
                {isReceivingDoctor ? 'Receiving Lead' : 'Referring Doctor'}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E9D68] animate-pulse" />
                <span className="text-[10px] font-semibold text-[#2E9D68]">Online & Verified</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
