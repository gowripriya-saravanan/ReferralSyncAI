import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  DoctorProfile,
  ExtractedRequirements,
  Hospital,
  HospitalMatchResult,
  Patient,
  Referral,
  ReferralStatus,
} from '../types/referral';
import type {
  AuthSession,
  DoctorProfileRecord,
  ReferralMessageRecord,
  UserAccount,
  UserRole,
} from '../types/auth';
import {
  currentDoctor,
  initialReferrals,
  syntheticHospitals,
  syntheticPatients,
} from '../data/mockData';
import {
  authenticateUser,
  clearSession,
  getSavedSession,
} from '../services/authService';
import {
  INITIAL_REFERRAL_MESSAGES,
  getReceivingDoctorsForHospital,
} from '../database/doctorDatabase';
import { extractRequirementsFromText, rankHospitalsForRequirements } from '../services/aiMatcher';

export type AppPage =
  | 'dashboard'
  | 'patients'
  | 'patient-details'
  | 'new-referral'
  | 'ai-analysis'
  | 'hospital-matching'
  | 'doctor-review'
  | 'referrals'
  | 'referral-details'
  | 'hospitals'
  | 'ai-assistant'
  | 'analytics'
  | 'settings'
  | 'login'
  | 'receiving-dashboard'
  | 'receiving-accepted';

interface ToastNotice {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

const STORAGE_REFERRALS_KEY = 'referralsync_referrals_v1';
const STORAGE_MESSAGES_KEY = 'referralsync_messages_v1';

interface AppContextType {
  // Navigation & Authentication
  activePage: AppPage;
  navigateTo: (page: AppPage, params?: { patientId?: string; referralId?: string; hospitalId?: string }) => void;
  session: AuthSession | null;
  currentUser: UserAccount | null;
  currentDoctorProfile: DoctorProfileRecord | null;
  isReferralDoctor: boolean;
  isReceivingDoctor: boolean;
  userRole: UserRole | null;
  login: (email: string, plainPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Domain Entities
  doctor: DoctorProfile;
  patients: Patient[];
  hospitals: Hospital[];
  referrals: Referral[];
  
  // Selection pointers
  selectedPatientId: string | null;
  selectedReferralId: string | null;
  selectedHospitalId: string | null;
  selectedPatient: Patient | undefined;
  selectedReferral: Referral | undefined;
  selectedHospital: Hospital | undefined;

  // Active Draft Workflow for New Referral
  draftPatient: Patient | null;
  draftRequirements: ExtractedRequirements | null;
  draftMatches: HospitalMatchResult[] | null;
  draftSelectedMatch: HospitalMatchResult | null;
  draftDoctorNotes: string;
  draftReferralReason: string;
  selectedReceivingDoctorId: string | null;
  setSelectedReceivingDoctorId: (id: string | null) => void;

  // Workflow Actions
  startReferralForPatient: (patientId: string) => void;
  runAiRequirementAnalysis: (
    freeText: string,
    structuredData?: Partial<ExtractedRequirements>,
    patientId?: string,
    originHospital?: string
  ) => void;
  selectHospitalForDraft: (match: HospitalMatchResult) => void;
  approveDraftReferral: (notes?: string) => Referral;
  rejectDraftReferral: (reason?: string) => void;
  updateReferralStatus: (referralId: string, status: ReferralStatus, transferStatus?: Referral['transferStatus']) => void;

  // Receiving Doctor Actions
  respondToReferral: (
    referralId: string,
    action: 'accept' | 'reject' | 'in_progress' | 'complete',
    details?: { rejectionReason?: string; responseNotes?: string; assignedBed?: string }
  ) => void;

  // Doctor Messaging & Communication
  referralMessages: ReferralMessageRecord[];
  sendReferralMessage: (referralId: string, messageText: string) => void;
  getMessagesForReferral: (referralId: string) => ReferralMessageRecord[];

  // Notifications
  toasts: ToastNotice[];
  showToast: (title: string, message: string, type?: ToastNotice['type']) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Session & Authentication State
  const [session, setSession] = useState<AuthSession | null>(() => getSavedSession());

  // Determine initial page based on active session
  const [activePage, setActivePage] = useState<AppPage>(() => {
    const saved = getSavedSession();
    if (!saved) return 'login';
    return saved.user.role === 'RECEIVING_DOCTOR' ? 'receiving-dashboard' : 'dashboard';
  });

  const currentUser = session?.user || null;
  const currentDoctorProfile = session?.doctor || null;
  const isReferralDoctor = currentUser?.role === 'REFERRAL_DOCTOR';
  const isReceivingDoctor = currentUser?.role === 'RECEIVING_DOCTOR';
  const userRole = currentUser?.role || null;

  // Sync doctor profile for backward compatibility
  const doctor: DoctorProfile = currentDoctorProfile
    ? {
        name: currentDoctorProfile.doctor_name,
        title: currentDoctorProfile.specialization,
        hospital: currentDoctorProfile.hospital_name,
        department: currentDoctorProfile.department,
        isOnline: currentDoctorProfile.is_online,
        avatarUrl: currentDoctorProfile.avatar_url || currentDoctor.avatarUrl,
        unreadNotifications: currentUser?.role === 'RECEIVING_DOCTOR' ? 2 : 3,
      }
    : currentDoctor;

  const [patients, setPatients] = useState<Patient[]>(syntheticPatients);
  const [hospitals] = useState<Hospital[]>(syntheticHospitals);

  // Referrals with persistence
  const [referrals, setReferrals] = useState<Referral[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_REFERRALS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (err) {
        console.error('Error loading stored referrals:', err);
      }
    }
    return initialReferrals;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_REFERRALS_KEY, JSON.stringify(referrals));
      } catch (err) {
        console.error('Error saving referrals:', err);
      }
    }
  }, [referrals]);

  // Referral Messages with persistence
  const [referralMessages, setReferralMessages] = useState<ReferralMessageRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_MESSAGES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (err) {
        console.error('Error loading stored messages:', err);
      }
    }
    return INITIAL_REFERRAL_MESSAGES;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(referralMessages));
      } catch (err) {
        console.error('Error saving messages:', err);
      }
    }
  }, [referralMessages]);

  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('PAT-2026-079');
  const [selectedReferralId, setSelectedReferralId] = useState<string | null>('REF-2026-081');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>('hosp-001');

  // Draft workflow state
  const [draftPatient, setDraftPatient] = useState<Patient | null>(null);
  const [draftRequirements, setDraftRequirements] = useState<ExtractedRequirements | null>(null);
  const [draftMatches, setDraftMatches] = useState<HospitalMatchResult[] | null>(null);
  const [draftSelectedMatch, setDraftSelectedMatch] = useState<HospitalMatchResult | null>(null);
  const [draftDoctorNotes, setDraftDoctorNotes] = useState<string>('');
  const [draftReferralReason, setDraftReferralReason] = useState<string>('');
  const [selectedReceivingDoctorId, setSelectedReceivingDoctorId] = useState<string | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastNotice[]>([]);

  const showToast = (title: string, message: string, type: ToastNotice['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Login handler
  const login = async (email: string, plainPassword: string): Promise<{ success: boolean; error?: string }> => {
    const result = await authenticateUser(email, plainPassword);
    if (result.success && result.session) {
      setSession(result.session);
      showToast(
        'Authentication Successful',
        `Welcome, ${result.session.doctor.doctor_name} (${result.session.doctor.hospital_name})`,
        'success'
      );
      if (result.session.user.role === 'RECEIVING_DOCTOR') {
        setActivePage('receiving-dashboard');
      } else {
        setActivePage('dashboard');
      }
      return { success: true };
    }
    return { success: false, error: result.error || 'Authentication failed' };
  };

  // Logout handler
  const logout = () => {
    clearSession();
    setSession(null);
    setActivePage('login');
    showToast('Logged Out', 'You have been safely signed out of ReferralSync AI.', 'info');
  };

  // Role-guarded navigation
  const navigateTo = (
    page: AppPage,
    params?: { patientId?: string; referralId?: string; hospitalId?: string }
  ) => {
    if (page === 'login') {
      setActivePage('login');
      return;
    }

    if (!session) {
      setActivePage('login');
      return;
    }

    // Role-based authorization rules
    if (isReceivingDoctor) {
      // Receiving doctors should not access referral creation or referral doctor dashboard
      const forbiddenForReceiving: AppPage[] = [
        'new-referral',
        'ai-analysis',
        'hospital-matching',
        'doctor-review',
        'dashboard',
      ];
      if (forbiddenForReceiving.includes(page)) {
        showToast(
          'Unauthorized Access',
          'Only Referring Physicians can create or initiate outgoing hospital referrals.',
          'warning'
        );
        setActivePage('receiving-dashboard');
        return;
      }
    } else if (isReferralDoctor) {
      // Referral doctors should not access receiving doctor triage dashboard
      const forbiddenForReferral: AppPage[] = ['receiving-dashboard', 'receiving-accepted'];
      if (forbiddenForReferral.includes(page)) {
        showToast(
          'Unauthorized Access',
          'Receiving Doctor Dashboards are restricted to registered receiving hospital triage staff.',
          'warning'
        );
        setActivePage('dashboard');
        return;
      }
    }

    if (params?.patientId) setSelectedPatientId(params.patientId);
    if (params?.referralId) setSelectedReferralId(params.referralId);
    if (params?.hospitalId) setSelectedHospitalId(params.hospitalId);
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const selectedReferral = referrals.find((r) => r.id === selectedReferralId);
  const selectedHospital = hospitals.find((h) => h.id === selectedHospitalId);

  const startReferralForPatient = (patientId: string) => {
    const pat = patients.find((p) => p.id === patientId);
    if (pat) {
      setDraftPatient(pat);
      setSelectedPatientId(pat.id);
      setDraftReferralReason(pat.referralRequirement);
      setDraftDoctorNotes(pat.currentCare);
      const req = extractRequirementsFromText(pat.referralRequirement, {
        specialty: pat.requiredSpecialty,
        urgency: pat.urgency,
      });
      setDraftRequirements(req);
      const matches = rankHospitalsForRequirements(req, hospitals);
      setDraftMatches(matches);
      setDraftSelectedMatch(matches[0] || null);
      if (matches[0]) {
        const availableDocs = getReceivingDoctorsForHospital(matches[0].hospital.id);
        setSelectedReceivingDoctorId(availableDocs[0]?.doctor_id || null);
      }
      navigateTo('new-referral', { patientId });
    }
  };

  const runAiRequirementAnalysis = (
    freeText: string,
    structuredData?: Partial<ExtractedRequirements>,
    patientId?: string,
    originHospital?: string
  ) => {
    if (patientId) {
      const pat = patients.find(
        (p) => p.id === patientId || p.name.toLowerCase() === patientId.toLowerCase()
      );
      if (pat) {
        setDraftPatient({
          ...pat,
          currentHospital: originHospital || pat.currentHospital,
        });
      } else {
        const newPatient: Patient = {
          id: `PAT-2026-${Math.floor(100 + Math.random() * 900)}`,
          name: patientId,
          age: 45,
          gender: 'Other',
          currentHospital: originHospital || (currentDoctorProfile?.hospital_name || 'Metro Care General Hospital'),
          assignedDoctor: currentDoctorProfile?.doctor_name || doctor.name,
          currentCare: 'Attending physician referral intake',
          referralRequirement: freeText,
          requiredSpecialty: structuredData?.specialty || 'General Medicine',
          requiredEquipment: (structuredData?.equipment && structuredData.equipment[0]) || 'Standard Facilities',
          requiredFacility: (structuredData?.facility && structuredData.facility[0]) || 'General Ward',
          urgency: structuredData?.urgency || 'Urgent',
          referralStatus: 'Pending',
          lastUpdated: 'Just now',
        };
        setDraftPatient(newPatient);
      }
    }
    const req = extractRequirementsFromText(freeText, structuredData);
    setDraftRequirements(req);
    const matches = rankHospitalsForRequirements(req, hospitals);
    setDraftMatches(matches);
    setDraftSelectedMatch(matches[0] || null);
    if (matches[0]) {
      const availableDocs = getReceivingDoctorsForHospital(matches[0].hospital.id);
      setSelectedReceivingDoctorId(availableDocs[0]?.doctor_id || null);
    }
    setDraftReferralReason(freeText);
    showToast(
      'Requirements Analyzed',
      `Extracted ${req.specialty} with ${req.equipment.length} equipment specs and ${matches.length} receiving facilities ranked.`,
      'success'
    );
    navigateTo('ai-analysis');
  };

  const selectHospitalForDraft = (match: HospitalMatchResult) => {
    setDraftSelectedMatch(match);
    const availableDocs = getReceivingDoctorsForHospital(match.hospital.id);
    setSelectedReceivingDoctorId(availableDocs[0]?.doctor_id || null);
    showToast(
      'Facility Selected',
      `${match.hospital.name} selected with ${match.matchScore}% prototype match score.`,
      'info'
    );
    navigateTo('doctor-review');
  };

  const approveDraftReferral = (notes?: string): Referral => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0] + ' ' + timeStr;

    const patient = draftPatient || patients[0];
    const match = draftSelectedMatch || (draftMatches && draftMatches[0]) || {
      hospital: hospitals[0],
      matchScore: 92,
      matchedReasons: ['Verified capability match'],
      missingOrPartial: [],
      recommendedReason: 'Direct physician choice',
      transitTimeEstimate: '15 mins',
    };

    // Determine receiving doctor
    const availableReceivingDocs = getReceivingDoctorsForHospital(match.hospital.id);
    const assignedReceivingDoc =
      availableReceivingDocs.find((d) => d.doctor_id === selectedReceivingDoctorId) ||
      availableReceivingDocs[0] || {
        doctor_id: 'doc-rec-001',
        doctor_name: 'Dr. Arun Kumar',
      };

    const newReferralId = `REF-2026-${String(referrals.length + 82).padStart(3, '0')}`;

    const referringDocName = currentDoctorProfile?.doctor_name || 'Dr. Ananya Rao';
    const referringDocId = currentDoctorProfile?.doctor_id || 'doc-ref-001';

    const newReferral: Referral = {
      id: newReferralId,
      patientId: patient.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      currentHospital: patient.currentHospital || (currentDoctorProfile?.hospital_name || 'Metro Care General Hospital'),
      receivingHospital: match.hospital.name,
      receivingHospitalId: match.hospital.id,
      referringDoctorId: referringDocId,
      referringDoctorName: referringDocName,
      receivingDoctorId: assignedReceivingDoc.doctor_id,
      receivingDoctorName: assignedReceivingDoc.doctor_name,
      requiredSpecialty: draftRequirements?.specialty || patient.requiredSpecialty,
      urgency: draftRequirements?.urgency || patient.urgency,
      status: 'Pending',
      createdDate: dateStr,
      aiRecommendationScore: match.matchScore,
      aiRecommendationSummary: match.recommendedReason,
      doctorApprovalStatus: 'Approved by Dr. Ananya Rao',
      doctorApprovalDate: dateStr,
      hospitalResponse: 'Pending',
      transferStatus: 'Standby',
      referralReason: draftReferralReason || patient.referralRequirement,
      doctorNotes: notes || draftDoctorNotes || 'Approved following clinical capability verification.',
      timeline: [
        {
          step: 'Referral Created',
          timestamp: timeStr,
          actor: referringDocName,
          status: 'completed',
          notes: 'Referral requirements specified and submitted for analysis.',
        },
        {
          step: 'AI Analysis Completed',
          timestamp: timeStr,
          actor: 'ReferralSync AI Engine',
          status: 'completed',
          notes: `Extracted ${draftRequirements?.specialty || patient.requiredSpecialty} capabilities. Match score ${match.matchScore}%.`,
        },
        {
          step: 'Hospital Recommended',
          timestamp: timeStr,
          actor: 'AI Recommendation Engine',
          status: 'completed',
          notes: `${match.hospital.name} recommended based on verified capability data.`,
        },
        {
          step: 'Doctor Approved',
          timestamp: timeStr,
          actor: referringDocName,
          status: 'completed',
          notes: notes || 'Doctor reviewed clinical capabilities and approved receiving facility.',
        },
        {
          step: 'Referral Sent',
          timestamp: 'Just now',
          actor: 'System Gateway',
          status: 'completed',
          notes: `Digital dossier dispatched to ${assignedReceivingDoc.doctor_name} at ${match.hospital.name}.`,
        },
        {
          step: 'Receiving Hospital Accepted',
          timestamp: 'Pending',
          actor: assignedReceivingDoc.doctor_name,
          status: 'pending',
          notes: 'Awaiting receiving facility intake desk acknowledgment.',
        },
        {
          step: 'Transfer In Progress',
          timestamp: 'Pending',
          actor: 'Regional EMS Transport',
          status: 'pending',
          notes: 'Standby for bed reservation confirmation.',
        },
        {
          step: 'Completed',
          timestamp: 'Pending',
          actor: 'Receiving Medical Team',
          status: 'pending',
          notes: 'Pending arrival and physical handover.',
        },
      ],
    };

    // Update referrals state
    setReferrals((prev) => [newReferral, ...prev]);

    // Update patient status
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patient.id ? { ...p, referralStatus: 'Pending', lastUpdated: dateStr } : p
      )
    );

    // Create initial dispatch message in conversation
    const initialMessage: ReferralMessageRecord = {
      id: `msg-${Date.now()}`,
      referralId: newReferralId,
      senderId: referringDocId,
      senderName: referringDocName,
      senderRole: 'REFERRAL_DOCTOR',
      receiverId: assignedReceivingDoc.doctor_id,
      receiverName: assignedReceivingDoc.doctor_name,
      messageText: `Urgent referral dispatched for ${patient.name} (${patient.age}y, ${patient.gender}). Reason: ${draftReferralReason || patient.referralRequirement}`,
      timestamp: dateStr,
      read: false,
    };
    setReferralMessages((prev) => [initialMessage, ...prev]);

    setSelectedReferralId(newReferral.id);

    showToast(
      'Referral Dispatched to Receiving Doctor',
      `Referral #${newReferral.id} transmitted to ${assignedReceivingDoc.doctor_name} (${match.hospital.name}).`,
      'success'
    );

    navigateTo('referral-details', { referralId: newReferral.id });
    return newReferral;
  };

  const rejectDraftReferral = (reason?: string) => {
    showToast(
      'Recommendation Dismissed',
      reason || 'Doctor rejected the AI facility recommendation. Requirements can be adjusted.',
      'warning'
    );
    navigateTo('new-referral');
  };

  const updateReferralStatus = (
    referralId: string,
    status: ReferralStatus,
    transferStatus?: Referral['transferStatus']
  ) => {
    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id === referralId) {
          return {
            ...r,
            status,
            transferStatus: transferStatus || r.transferStatus,
            timeline: r.timeline.map((step) => {
              if (
                (status === 'Hospital Accepted' || status === 'Accepted') &&
                step.step === 'Receiving Hospital Accepted'
              ) {
                return { ...step, status: 'completed', timestamp: 'Just now' };
              }
              if (
                (status === 'In Transfer' || status === 'In Progress') &&
                step.step === 'Transfer In Progress'
              ) {
                return { ...step, status: 'completed', timestamp: 'In progress' };
              }
              if (status === 'Completed' && step.step === 'Completed') {
                return { ...step, status: 'completed', timestamp: 'Completed' };
              }
              return step;
            }),
          };
        }
        return r;
      })
    );
    showToast('Referral Updated', `Referral #${referralId} updated to ${status}`, 'info');
  };

  // Receiving Doctor Actions (Accept, Reject, In Progress, Complete)
  const respondToReferral = (
    referralId: string,
    action: 'accept' | 'reject' | 'in_progress' | 'complete',
    details?: { rejectionReason?: string; responseNotes?: string; assignedBed?: string }
  ) => {
    const doctorName = currentDoctorProfile?.doctor_name || 'Dr. Arun Kumar';
    const doctorId = currentDoctorProfile?.doctor_id || 'doc-rec-001';
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id !== referralId) return r;

        if (action === 'accept') {
          const updatedTimeline = r.timeline.map((step) => {
            if (step.step === 'Receiving Hospital Accepted') {
              return {
                ...step,
                status: 'completed' as const,
                timestamp: nowStr,
                actor: doctorName,
                notes: `Accepted by ${doctorName}.${details?.assignedBed ? ` Bed allocated: ${details.assignedBed}.` : ''} ${details?.responseNotes || ''}`,
              };
            }
            return step;
          });

          return {
            ...r,
            status: 'Accepted',
            hospitalResponse: 'Accepted',
            transferStatus: 'Pending Dispatch',
            assignedBed: details?.assignedBed || r.assignedBed || 'Bed Allocated',
            responseNotes: details?.responseNotes,
            timeline: updatedTimeline,
          };
        }

        if (action === 'reject') {
          const updatedTimeline = [
            ...r.timeline.map((step) => {
              if (step.step === 'Receiving Hospital Accepted') {
                return {
                  ...step,
                  status: 'completed' as const,
                  timestamp: nowStr,
                  actor: doctorName,
                  notes: `Referral declined by ${doctorName}. Reason: ${details?.rejectionReason || 'Facility at capacity'}`,
                };
              }
              return step;
            }),
          ];

          return {
            ...r,
            status: 'Rejected',
            hospitalResponse: 'Declined',
            rejectionReason: details?.rejectionReason || 'Facility at capacity',
            responseNotes: details?.responseNotes,
            timeline: updatedTimeline,
          };
        }

        if (action === 'in_progress') {
          const updatedTimeline = r.timeline.map((step) => {
            if (step.step === 'Transfer In Progress') {
              return {
                ...step,
                status: 'current' as const,
                timestamp: nowStr,
                notes: 'ALS ambulance en route with patient.',
              };
            }
            return step;
          });

          return {
            ...r,
            status: 'In Progress',
            transferStatus: 'Ambulance En Route',
            timeline: updatedTimeline,
          };
        }

        if (action === 'complete') {
          const updatedTimeline = r.timeline.map((step) => {
            if (step.step === 'Transfer In Progress' || step.step === 'Completed') {
              return {
                ...step,
                status: 'completed' as const,
                timestamp: nowStr,
                notes: step.step === 'Completed' ? `Patient admitted by ${doctorName}. Physical handover completed.` : step.notes,
              };
            }
            return step;
          });

          return {
            ...r,
            status: 'Completed',
            transferStatus: 'Completed',
            timeline: updatedTimeline,
          };
        }

        return r;
      })
    );

    // Find referral for notification & message
    const targetRef = referrals.find((r) => r.id === referralId);
    if (targetRef) {
      let messageContent = '';
      if (action === 'accept') {
        messageContent = `Referral accepted by ${doctorName}.${details?.assignedBed ? ` Reserved ${details.assignedBed}.` : ''} ${details?.responseNotes || 'Awaiting ambulance arrival.'}`;
        showToast(
          'Referral Accepted',
          `Referral #${referralId} for ${targetRef.patientName} accepted. ${details?.assignedBed ? details.assignedBed + ' allocated.' : ''}`,
          'success'
        );
      } else if (action === 'reject') {
        messageContent = `Referral declined: ${details?.rejectionReason || 'No capacity available'}. ${details?.responseNotes || ''}`;
        showToast(
          'Referral Rejected',
          `Referral #${referralId} for ${targetRef.patientName} rejected. Reason: ${details?.rejectionReason}`,
          'warning'
        );
      } else if (action === 'in_progress') {
        messageContent = `Patient marked in transfer / en-route to ${targetRef.receivingHospital}.`;
        showToast('Transfer In Progress', `Ambulance is en route with ${targetRef.patientName}.`, 'info');
      } else if (action === 'complete') {
        messageContent = `Patient ${targetRef.patientName} safely arrived and intake finalized by ${doctorName}.`;
        showToast('Transfer Completed', `Patient handover signed off and admitted.`, 'success');
      }

      // Automatically add message to conversation
      if (messageContent) {
        const newMsg: ReferralMessageRecord = {
          id: `msg-${Date.now()}`,
          referralId: referralId,
          senderId: doctorId,
          senderName: doctorName,
          senderRole: 'RECEIVING_DOCTOR',
          receiverId: targetRef.referringDoctorId || 'doc-ref-001',
          receiverName: targetRef.referringDoctorName || 'Dr. Ananya Rao',
          messageText: messageContent,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          read: false,
        };
        setReferralMessages((prev) => [newMsg, ...prev]);
      }
    }
  };

  // Bidirectional doctor messaging
  const sendReferralMessage = (referralId: string, messageText: string) => {
    if (!messageText.trim()) return;

    const ref = referrals.find((r) => r.id === referralId);
    const senderRole = currentUser?.role || 'REFERRAL_DOCTOR';
    const senderName = currentDoctorProfile?.doctor_name || doctor.name;
    const senderId = currentDoctorProfile?.doctor_id || (senderRole === 'REFERRAL_DOCTOR' ? 'doc-ref-001' : 'doc-rec-001');

    let receiverId = 'doc-rec-001';
    let receiverName = 'Receiving Medical Team';

    if (senderRole === 'REFERRAL_DOCTOR') {
      receiverId = ref?.receivingDoctorId || 'doc-rec-001';
      receiverName = ref?.receivingDoctorName || 'Receiving Doctor';
    } else {
      receiverId = ref?.referringDoctorId || 'doc-ref-001';
      receiverName = ref?.referringDoctorName || 'Dr. Ananya Rao';
    }

    const newMsg: ReferralMessageRecord = {
      id: `msg-${Date.now()}`,
      referralId,
      senderId,
      senderName,
      senderRole,
      receiverId,
      receiverName,
      messageText: messageText.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
    };

    setReferralMessages((prev) => [newMsg, ...prev]);
    showToast('Message Sent', `Dispatched note to ${receiverName}`, 'info');
  };

  const getMessagesForReferral = (referralId: string): ReferralMessageRecord[] => {
    return referralMessages
      .filter((m) => m.referralId === referralId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        navigateTo,
        session,
        currentUser,
        currentDoctorProfile,
        isReferralDoctor,
        isReceivingDoctor,
        userRole,
        login,
        logout,
        doctor,
        patients,
        hospitals,
        referrals,
        selectedPatientId,
        selectedReferralId,
        selectedHospitalId,
        selectedPatient,
        selectedReferral,
        selectedHospital,
        draftPatient,
        draftRequirements,
        draftMatches,
        draftSelectedMatch,
        draftDoctorNotes,
        draftReferralReason,
        selectedReceivingDoctorId,
        setSelectedReceivingDoctorId,
        startReferralForPatient,
        runAiRequirementAnalysis,
        selectHospitalForDraft,
        approveDraftReferral,
        rejectDraftReferral,
        updateReferralStatus,
        respondToReferral,
        referralMessages,
        sendReferralMessage,
        getMessagesForReferral,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
