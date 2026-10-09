import type { AuthSession, UserAccount } from '../types/auth';
import {
  INITIAL_DOCTOR_PROFILES,
  INITIAL_USERS,
  PASSWORD_SALT,
} from '../database/doctorDatabase';

const STORAGE_SESSION_KEY = 'referralsync_auth_session_v1';
const STORAGE_USERS_KEY = 'referralsync_users_v1';

/**
 * Computes a salted SHA-256 hash using the Web Crypto API.
 */
export async function hashPassword(password: string): Promise<string> {
  const salted = PASSWORD_SALT + password;
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(salted);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback simple hash for non-crypto contexts
  let hash = 0;
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

/**
 * Load users list from localStorage or initialize with INITIAL_USERS
 */
export function getRegisteredUsers(): UserAccount[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error loading users:', err);
  }
  // Store initial users
  saveUsers(INITIAL_USERS);
  return INITIAL_USERS;
}

export function saveUsers(users: UserAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users:', err);
  }
}

/**
 * Authenticates user by email and password
 */
export async function authenticateUser(
  email: string,
  plainPassword: string
): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
  const trimmedEmail = email.trim().toLowerCase();
  const users = getRegisteredUsers();

  const user = users.find((u) => u.email.toLowerCase() === trimmedEmail);
  if (!user) {
    return {
      success: false,
      error: 'No registered account found with this email address.',
    };
  }

  if (user.account_status !== 'active') {
    return {
      success: false,
      error: 'This account has been deactivated. Please contact hospital IT administration.',
    };
  }

  const computedHash = await hashPassword(plainPassword);

  // Validate password hash
  if (computedHash !== user.password_hash) {
    // Support testing with Doctor@123 directly if hash matches
    return {
      success: false,
      error: 'Incorrect password. Please verify your credentials and try again.',
    };
  }

  // Find linked doctor profile
  const doctor = INITIAL_DOCTOR_PROFILES.find((d) => d.user_id === user.user_id) || {
    doctor_id: `doc-${user.user_id}`,
    user_id: user.user_id,
    doctor_name: user.role === 'REFERRAL_DOCTOR' ? 'Dr. Ananya Rao' : 'Dr. Arun Kumar',
    registration_number: user.role === 'REFERRAL_DOCTOR' ? 'REG-TN-32094' : 'REG-TN-48201',
    specialization: user.role === 'REFERRAL_DOCTOR' ? 'Internal Medicine & Emergency Triage' : 'Neurology & Stroke Critical Care',
    department: user.role === 'REFERRAL_DOCTOR' ? 'Acute Referral Desk' : 'Neuro-ICU & Stroke Unit',
    hospital_id: user.role === 'REFERRAL_DOCTOR' ? 'hosp-metro' : 'hosp-001',
    hospital_name: user.role === 'REFERRAL_DOCTOR' ? 'Metro Care General Hospital' : 'Regional Neuro & Trauma Hospital',
    contact_number: '+91 94432 10982',
    role: user.role,
    is_online: true,
  };

  // Build authenticated session
  const session: AuthSession = {
    token: `token_${user.user_id}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    user: {
      ...user,
      last_login: new Date().toISOString(),
    },
    doctor,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  saveSession(session);
  return { success: true, session };
}

/**
 * Save active session to localStorage
 */
export function saveSession(session: AuthSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Error saving session:', err);
  }
}

/**
 * Retrieve saved active session
 */
export function getSavedSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (session.expiresAt && session.expiresAt < Date.now()) {
      clearSession();
      return null;
    }
    return session;
  } catch (err) {
    console.error('Error reading session:', err);
    return null;
  }
}

/**
 * Clear session on logout
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_SESSION_KEY);
  } catch (err) {
    console.error('Error clearing session:', err);
  }
}

/**
 * Demo accounts for quick test buttons
 */
export const DEMO_CREDENTIALS = {
  referralDoctor: {
    email: 'referral.doctor@demo.com',
    password: 'Doctor@123',
    roleName: 'Referral Doctor',
    doctorName: 'Dr. Ananya Rao',
    hospital: 'Metro Care General Hospital',
    specialty: 'Internal Medicine & Emergency Triage',
    registration: 'REG-TN-32094',
  },
  receivingDoctor: {
    email: 'receiving.doctor@demo.com',
    password: 'Doctor@123',
    roleName: 'Receiving Doctor',
    doctorName: 'Dr. Arun Kumar',
    hospital: 'Regional Neuro & Trauma Hospital',
    specialty: 'Neurology & Stroke Critical Care',
    registration: 'REG-TN-48201',
  },
};
