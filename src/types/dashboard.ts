export type ReferralStatus =
  | 'Pending'
  | 'Approved'
  | 'Hospital Accepted'
  | 'In Transfer'
  | 'Completed';

export interface OverviewCardData {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'neutral' | 'urgent';
  icon: 'patients' | 'pending' | 'ai' | 'completed';
  description: string;
}

export interface ReferralRecord {
  id: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  patientId: string;
  currentHospital: string;
  receivingHospital: string;
  status: ReferralStatus;
  date: string;
  specialty?: string;
}

export interface AiActivityRecord {
  id: string;
  title: string;
  patientName: string;
  statusOrMatch: string;
  type: 'analysis_complete' | 'match_suggestion' | 'pending_review';
  timestamp: string;
  description: string;
}

export interface DoctorProfile {
  name: string;
  title: string;
  hospital: string;
  department: string;
  avatarUrl: string;
  isOnline: boolean;
  unreadNotifications: number;
}

