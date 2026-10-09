import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { LoginPage } from './components/pages/LoginPage';
import { ReceivingDoctorDashboard } from './components/pages/ReceivingDoctorDashboard';
import { DashboardPage } from './components/pages/DashboardPage';
import { PatientsPage } from './components/pages/PatientsPage';
import { PatientDetailsPage } from './components/pages/PatientDetailsPage';
import { NewReferralPage } from './components/pages/NewReferralPage';
import { AiAnalysisPage } from './components/pages/AiAnalysisPage';
import { DoctorReviewPage } from './components/pages/DoctorReviewPage';
import { ReferralsPage } from './components/pages/ReferralsPage';
import { ReferralTrackingPage } from './components/pages/ReferralTrackingPage';
import { HospitalsPage } from './components/pages/HospitalsPage';
import { AiAssistantPage } from './components/pages/AiAssistantPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { SettingsPage } from './components/pages/SettingsPage';

const AppContent: React.FC = () => {
  const { activePage, session, currentUser, isReceivingDoctor } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // If unauthenticated or on login page, present the role-based login gateway
  if (!session || !currentUser || activePage === 'login') {
    return (
      <div className="min-h-screen bg-[#F4F8FC] text-[#17324D]">
        <LoginPage />
        <ToastContainer />
      </div>
    );
  }

  const renderActivePage = () => {
    // If receiving doctor, redirect dashboard queries to the receiving dashboard
    if (isReceivingDoctor && (activePage === 'dashboard' || activePage === 'receiving-dashboard' || activePage === 'receiving-accepted')) {
      return <ReceivingDoctorDashboard />;
    }

    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'receiving-dashboard':
      case 'receiving-accepted':
        return <ReceivingDoctorDashboard />;
      case 'patients':
        return <PatientsPage />;
      case 'patient-details':
        return <PatientDetailsPage />;
      case 'new-referral':
        return <NewReferralPage />;
      case 'ai-analysis':
      case 'hospital-matching':
        return <AiAnalysisPage />;
      case 'doctor-review':
        return <DoctorReviewPage />;
      case 'referrals':
        return <ReferralsPage />;
      case 'referral-details':
        return <ReferralTrackingPage />;
      case 'hospitals':
        return <HospitalsPage />;
      case 'ai-assistant':
        return <AiAssistantPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return isReceivingDoctor ? <ReceivingDoctorDashboard /> : <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#17324D] flex">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Global Notifications */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
