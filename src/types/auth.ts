export type UserRole = 'REFERRAL_DOCTOR' | 'RECEIVING_DOCTOR';

export interface UserAccount {
  user_id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  account_status: 'active' | 'inactive';
  created_at: string;
  last_login?: string;
}

export interface DoctorProfileRecord {
  doctor_id: string;
  user_id: string;
  doctor_name: string;
  registration_number: string;
  specialization: string;
  department: string;
  hospital_id: string;
  hospital_name: string;
  contact_number: string;
  role: UserRole;
  avatar_url?: string;
  is_online: boolean;
  years_experience?: number;
  available_for_transfers?: boolean;
}

export interface ReferralMessageRecord {
  id: string;
  referralId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  receiverId: string;
  receiverName: string;
  messageText: string;
  timestamp: string;
  read?: boolean;
}

export interface AuthSession {
  token: string;
  user: UserAccount;
  doctor: DoctorProfileRecord;
  expiresAt: number;
}

