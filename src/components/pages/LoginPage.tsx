import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_CREDENTIALS } from '../../services/authService';
import {
  Lock,
  Mail,
  ShieldCheck,
  Building2,
  Stethoscope,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  ArrowRight,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('referral.doctor@demo.com');
  const [password, setPassword] = useState('Doctor@123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'REFERRAL' | 'RECEIVING'>('REFERRAL');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your professional email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch {
      setErrorMessage('A network or internal error occurred while validating credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (role: 'REFERRAL' | 'RECEIVING') => {
    setActiveTab(role);
    setErrorMessage(null);
    if (role === 'REFERRAL') {
      setEmail(DEMO_CREDENTIALS.referralDoctor.email);
      setPassword(DEMO_CREDENTIALS.referralDoctor.password);
    } else {
      setEmail(DEMO_CREDENTIALS.receivingDoctor.email);
      setPassword(DEMO_CREDENTIALS.receivingDoctor.password);
    }
  };

  const handleDirectDemoLogin = async (role: 'REFERRAL' | 'RECEIVING') => {
    setActiveTab(role);
    setErrorMessage(null);
    setIsLoading(true);
    const creds =
      role === 'REFERRAL' ? DEMO_CREDENTIALS.referralDoctor : DEMO_CREDENTIALS.receivingDoctor;
    setEmail(creds.email);
    setPassword(creds.password);

    try {
      const res = await login(creds.email, creds.password);
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to authenticate demo account.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-xl w-full space-y-6">
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="font-bold text-2xl sm:text-3xl tracking-tight text-[#17324D]">
              ReferralSync
            </span>
            <span className="px-2 py-0.5 text-xs font-black uppercase tracking-wider bg-[#5B8DEF] text-white rounded-md shadow-xs">
              AI
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#60758A] tracking-tight">
            AI-assisted Healthcare Referral Coordination & Triage Gateway
          </p>
        </div>

        {/* Auth Main Card */}
        <div className="bg-white rounded-3xl border border-[#DCE8F0] shadow-[0_4px_24px_rgba(23,107,135,0.06)] overflow-hidden">
          {/* Card Header */}
          <div className="p-6 sm:p-7 border-b border-[#DCE8F0] bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#176B87] bg-[#EDF5FA] border border-[#C9DCE8] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#176B87]" /> Secure Role Portal
              </span>
              <span className="text-xs text-[#60758A] font-medium">Healthcare Staff Only</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#17324D] tracking-tight">
              Sign In to Your Station
            </h2>
            <p className="text-xs sm:text-sm text-[#60758A] mt-1">
              Select your clinical role or enter your verified credentials to proceed.
            </p>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 mt-5 p-1 bg-[#EDF5FA] border border-[#DCE8F0] rounded-2xl">
              <button
                type="button"
                onClick={() => handleQuickFill('REFERRAL')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'REFERRAL'
                    ? 'bg-white text-[#17324D] shadow-xs border border-[#C9DCE8]'
                    : 'text-[#60758A] hover:text-[#17324D] hover:bg-white/60'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-[#176B87] shrink-0" />
                <span className="truncate">Referral Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('RECEIVING')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'RECEIVING'
                    ? 'bg-white text-[#17324D] shadow-xs border border-[#C9DCE8]'
                    : 'text-[#60758A] hover:text-[#17324D] hover:bg-white/60'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#2A9D8F] shrink-0" />
                <span className="truncate">Receiving Doctor</span>
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-7 space-y-5">
            {/* Active Role Preview Callout */}
            <div className="p-3.5 rounded-2xl bg-[#F4F8FC] border border-[#DCE8F0] text-xs text-[#17324D] flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-white border border-[#DCE8F0] flex items-center justify-center shrink-0 shadow-xs text-base">
                {activeTab === 'REFERRAL' ? '👨‍⚕️' : '🏥'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-[#17324D] flex items-center justify-between">
                  <span>
                    {activeTab === 'REFERRAL'
                      ? DEMO_CREDENTIALS.referralDoctor.doctorName
                      : DEMO_CREDENTIALS.receivingDoctor.doctorName}
                  </span>
                  <span className="text-[10px] text-[#176B87] font-semibold bg-white px-2 py-0.5 rounded border border-[#C9DCE8]">
                    {activeTab === 'REFERRAL'
                      ? DEMO_CREDENTIALS.referralDoctor.roleName
                      : DEMO_CREDENTIALS.receivingDoctor.roleName}
                  </span>
                </div>
                <p className="text-[11px] text-[#60758A] mt-0.5 truncate">
                  {activeTab === 'REFERRAL'
                    ? DEMO_CREDENTIALS.referralDoctor.hospital
                    : DEMO_CREDENTIALS.receivingDoctor.hospital}
                </p>
                <p className="text-[11px] text-[#2A9D8F] font-semibold mt-0.5">
                  Specialty: {activeTab === 'REFERRAL'
                    ? DEMO_CREDENTIALS.referralDoctor.specialty
                    : DEMO_CREDENTIALS.receivingDoctor.specialty}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-[#D9534F]/10 border border-[#D9534F]/30 text-[#D9534F] text-xs flex items-start gap-2.5 animate-in fade-in-50">
                <AlertCircle className="w-4 h-4 text-[#D9534F] shrink-0 mt-0.5" />
                <div className="font-medium leading-relaxed">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#17324D] block">
                  Staff Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#60758A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doctor@hospital.org"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F4F8FC] focus:bg-white text-sm text-[#17324D] rounded-xl border border-[#C9DCE8] focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87] transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#17324D] block">
                    Password
                  </label>
                  <span className="text-[11px] text-[#60758A]">
                    Default demo: <code className="bg-[#EDF5FA] px-1 py-0.5 rounded text-[#17324D] font-mono border border-[#DCE8F0]">Doctor@123</code>
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#60758A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-[#F4F8FC] focus:bg-white text-sm text-[#17324D] rounded-xl border border-[#C9DCE8] focus:outline-none focus:ring-2 focus:ring-[#176B87]/20 focus:border-[#176B87] transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#60758A] hover:text-[#17324D] cursor-pointer p-1"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#176B87] hover:bg-[#12566C] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 active:scale-[0.99]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick 1-Click Test Buttons */}
            <div className="pt-4 border-t border-[#DCE8F0] space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#60758A] block text-center mb-2">
                1-Click Instant Demo Login
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDirectDemoLogin('REFERRAL')}
                  disabled={isLoading}
                  className="p-3 rounded-xl border border-[#C9DCE8] bg-[#F4F8FC] hover:bg-[#EDF5FA] hover:border-[#176B87]/60 text-left transition-all cursor-pointer group active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#17324D] group-hover:text-[#176B87]">
                      👨‍⚕️ Referral Doctor
                    </span>
                    <span className="text-[10px] text-[#176B87] font-semibold bg-white px-1.5 py-0.5 rounded border border-[#C9DCE8]">
                      Login
                    </span>
                  </div>
                  <p className="text-[11px] text-[#60758A] mt-1 truncate">
                    Dr. Ananya Rao (Metro Care)
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectDemoLogin('RECEIVING')}
                  disabled={isLoading}
                  className="p-3 rounded-xl border border-[#C9DCE8] bg-[#F4F8FC] hover:bg-[#EDF5FA] hover:border-[#2A9D8F]/60 text-left transition-all cursor-pointer group active:scale-[0.99]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#17324D] group-hover:text-[#2A9D8F]">
                      🏥 Receiving Doctor
                    </span>
                    <span className="text-[10px] text-[#2A9D8F] font-semibold bg-white px-1.5 py-0.5 rounded border border-[#C9DCE8]">
                      Login
                    </span>
                  </div>
                  <p className="text-[11px] text-[#60758A] mt-1 truncate">
                    Dr. Arun Kumar (Regional Neuro)
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Card Footer Security Guarantee */}
          <div className="p-4 bg-[#EDF5FA] border-t border-[#DCE8F0] flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#60758A] font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E9D68]" /> SHA-256 Salted Passwords
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E9D68]" /> Role-Guarded Access
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2E9D68]" /> Audit Logging
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

