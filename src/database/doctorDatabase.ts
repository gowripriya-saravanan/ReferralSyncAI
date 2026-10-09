import type { DoctorProfileRecord, ReferralMessageRecord, UserAccount } from '../types/auth';

/**
 * ============================================================================
 * REFERRALSYNC AI - USER ACCOUNTS & DOCTOR DATABASE
 * ============================================================================
 * Manages authenticated user credentials (salted SHA-256 hashes), doctor
 * professional profiles, and hospital-registered receiving staff.
 */

export const PASSWORD_SALT = 'referralsync_salt_v1_';

// Pre-computed salted SHA-256 hashes:
// 'Doctor@123'  => 7ff4fc9995057c37e584fae27566d1a6523c58eceb8e098554e410c76f8636ae
// 'password123' => a436ff91d49342f5864c5e66831b067720c12c40ce3f83099aff40370d72f8f6

export const INITIAL_USERS: UserAccount[] = [
  {
    user_id: 'usr-ref-001',
    email: 'referral.doctor@demo.com',
    password_hash: '7ff4fc9995057c37e584fae27566d1a6523c58eceb8e098554e410c76f8636ae', // Doctor@123
    role: 'REFERRAL_DOCTOR',
    account_status: 'active',
    created_at: '2026-09-01T08:00:00Z',
    last_login: '2026-10-09T08:30:00Z',
  },
  {
    user_id: 'usr-rec-001',
    email: 'receiving.doctor@demo.com',
    password_hash: '7ff4fc9995057c37e584fae27566d1a6523c58eceb8e098554e410c76f8636ae', // Doctor@123
    role: 'RECEIVING_DOCTOR',
    account_status: 'active',
    created_at: '2026-09-01T08:00:00Z',
    last_login: '2026-10-09T08:15:00Z',
  },
  {
    user_id: 'usr-ref-002',
    email: 'dr.ananya@metrocare.org',
    password_hash: '7ff4fc9995057c37e584fae27566d1a6523c58eceb8e098554e410c76f8636ae',
    role: 'REFERRAL_DOCTOR',
    account_status: 'active',
    created_at: '2026-09-05T09:00:00Z',
  },
  {
    user_id: 'usr-rec-002',
    email: 'dr.vignesh@konguheart.org',
    password_hash: '7ff4fc9995057c37e584fae27566d1a6523c58eceb8e098554e410c76f8636ae',
    role: 'RECEIVING_DOCTOR',
    account_status: 'active',
    created_at: '2026-09-10T10:00:00Z',
  },
];

export const INITIAL_DOCTOR_PROFILES: DoctorProfileRecord[] = [
  // 1. Primary Referral Doctor
  {
    doctor_id: 'doc-ref-001',
    user_id: 'usr-ref-001',
    doctor_name: 'Dr. Ananya Rao',
    registration_number: 'REG-TN-32094',
    specialization: 'Internal Medicine & Emergency Triage',
    department: 'Acute Referral & Patient Coordination',
    hospital_id: 'hosp-metro',
    hospital_name: 'Metro Care General Hospital',
    contact_number: '+91 94432 10982',
    role: 'REFERRAL_DOCTOR',
    is_online: true,
    years_experience: 14,
    available_for_transfers: true,
  },
  // 2. Primary Receiving Doctor (Regional Neuro & Trauma Hospital)
  {
    doctor_id: 'doc-rec-001',
    user_id: 'usr-rec-001',
    doctor_name: 'Dr. Arun Kumar',
    registration_number: 'REG-TN-48201',
    specialization: 'Neurology & Stroke Critical Care',
    department: 'Department of Neurosciences & Stroke ICU',
    hospital_id: 'hosp-001',
    hospital_name: 'Regional Neuro & Trauma Hospital',
    contact_number: '+91 98421 88720',
    role: 'RECEIVING_DOCTOR',
    is_online: true,
    years_experience: 16,
    available_for_transfers: true,
  },
  // Additional registered receiving doctors across hospitals
  {
    doctor_id: 'doc-rec-002',
    user_id: 'usr-rec-002',
    doctor_name: 'Dr. K. Vignesh',
    registration_number: 'REG-TN-44820',
    specialization: 'Interventional Cardiology',
    department: 'Cath Lab & Cardiac ICU',
    hospital_id: 'hosp-003',
    hospital_name: 'Kongu Heart & Emergency Hospital',
    contact_number: '+91 98941 23450',
    role: 'RECEIVING_DOCTOR',
    is_online: true,
    years_experience: 18,
    available_for_transfers: true,
  },
  {
    doctor_id: 'doc-rec-003',
    user_id: 'usr-rec-003',
    doctor_name: 'Dr. Meera Shah',
    registration_number: 'REG-TN-51042',
    specialization: 'Neurosurgery & Spine Trauma',
    department: 'Department of Neurosurgery',
    hospital_id: 'hosp-001',
    hospital_name: 'Regional Neuro & Trauma Hospital',
    contact_number: '+91 97890 33412',
    role: 'RECEIVING_DOCTOR',
    is_online: true,
    years_experience: 12,
    available_for_transfers: true,
  },
  {
    doctor_id: 'doc-rec-004',
    user_id: 'usr-rec-004',
    doctor_name: 'Dr. K. Ramanathan',
    registration_number: 'REG-TN-39108',
    specialization: 'Pulmonology & Critical Care',
    department: 'Intensive Care Unit & Pulmonology',
    hospital_id: 'hosp-002',
    hospital_name: 'Coimbatore Advanced Care Hospital',
    contact_number: '+91 94431 67890',
    role: 'RECEIVING_DOCTOR',
    is_online: true,
    years_experience: 20,
    available_for_transfers: true,
  },
  {
    doctor_id: 'doc-rec-005',
    user_id: 'usr-rec-005',
    doctor_name: 'Dr. M. Soundararajan',
    registration_number: 'REG-TN-28914',
    specialization: 'Trauma & Orthopedic Surgery',
    department: 'Emergency & Polytrauma Care',
    hospital_id: 'hosp-007',
    hospital_name: 'Coimbatore Medical College Hospital (Govt)',
    contact_number: '+91 98422 11987',
    role: 'RECEIVING_DOCTOR',
    is_online: true,
    years_experience: 22,
    available_for_transfers: true,
  },
  {
    doctor_id: 'doc-rec-006',
    user_id: 'usr-rec-006',
    doctor_name: 'Dr. V. Murali',
    registration_number: 'REG-TN-36781',
    specialization: 'Medical Oncology & Hemato-Oncology',
    department: 'Department of Medical Oncology',
    hospital_id: 'hosp-004',
    hospital_name: 'PSG Hospitals & Research Center',
    contact_number: '+91 94870 54321',
    role: 'RECEIVING_DOCTOR',
    is_online: true,
    years_experience: 15,
    available_for_transfers: true,
  },
  {
    doctor_id: 'doc-rec-007',
    user_id: 'usr-rec-007',
    doctor_name: 'Dr. Deepa Nambiar',
    registration_number: 'REG-TN-41920',
    specialization: 'Gastroenterology & Hepatology',
    department: 'Digestive Disease Center',
    hospital_id: 'hosp-002',
    hospital_name: 'Coimbatore Advanced Care Hospital',
    contact_number: '+91 98944 67123',
    role: 'RECEIVING_DOCTOR',
    is_online: true,
    years_experience: 11,
    available_for_transfers: true,
  },
  {
    doctor_id: 'doc-rec-008',
    user_id: 'usr-rec-008',
    doctor_name: 'Dr. R. Senthil Nathan',
    registration_number: 'REG-TN-40112',
    specialization: 'Emergency Medicine & Triage Direction',
    department: 'Emergency Intake & Transfer Desk',
    hospital_id: 'hosp-001',
    hospital_name: 'Regional Neuro & Trauma Hospital',
    contact_number: '+91 422 249 8100',
    role: 'RECEIVING_DOCTOR',
    is_online: true,
    years_experience: 17,
    available_for_transfers: true,
  },
];

export const INITIAL_REFERRAL_MESSAGES: ReferralMessageRecord[] = [
  {
    id: 'msg-001',
    referralId: 'REF-2026-079',
    senderId: 'doc-ref-001',
    senderName: 'Dr. Ananya Rao',
    senderRole: 'REFERRAL_DOCTOR',
    receiverId: 'doc-rec-001',
    receiverName: 'Dr. Arun Kumar',
    messageText: 'Patient Priya Sharma has sudden right-sided weakness, NIHSS score 11. Initial non-contrast CT ruled out hemorrhage. Transferring for urgent 3T MRI and mechanical thrombectomy evaluation.',
    timestamp: '2026-10-08 14:05',
    read: true,
  },
  {
    id: 'msg-002',
    referralId: 'REF-2026-079',
    senderId: 'doc-rec-001',
    senderName: 'Dr. Arun Kumar',
    senderRole: 'RECEIVING_DOCTOR',
    receiverId: 'doc-ref-001',
    receiverName: 'Dr. Ananya Rao',
    messageText: 'Referral acknowledged and accepted. Neuro-ICU Bed #04 reserved and 3T MRI suite notified for immediate scan on arrival. Please ensure patient vitals are monitored continuously during transit.',
    timestamp: '2026-10-08 14:45',
    read: true,
  },
  {
    id: 'msg-003',
    referralId: 'REF-2026-081',
    senderId: 'doc-ref-001',
    senderName: 'Dr. Ananya Rao',
    senderRole: 'REFERRAL_DOCTOR',
    receiverId: 'doc-rec-002',
    receiverName: 'Dr. K. Vignesh',
    messageText: 'Arjun Kumar with acute anterior wall STEMI. Patient loaded into ALS ambulance ALS-04. ETA 18 mins.',
    timestamp: '2026-10-08 14:00',
    read: true,
  },
];

/**
 * Returns registered receiving doctors for a given hospital ID.
 * If no hospital-specific doctors are found, returns a sensible fallback default.
 */
export function getReceivingDoctorsForHospital(hospitalId?: string): DoctorProfileRecord[] {
  if (!hospitalId) {
    return INITIAL_DOCTOR_PROFILES.filter((doc) => doc.role === 'RECEIVING_DOCTOR');
  }

  const matches = INITIAL_DOCTOR_PROFILES.filter(
    (doc) => doc.hospital_id === hospitalId && doc.role === 'RECEIVING_DOCTOR'
  );

  if (matches.length > 0) {
    return matches;
  }

  // Fallback default receiving doctor for any other hospital
  return [
    {
      doctor_id: `doc-default-${hospitalId}`,
      user_id: `usr-default-${hospitalId}`,
      doctor_name: 'Chief Receiving Medical Officer',
      registration_number: 'REG-TN-REGISTRY',
      specialization: 'Emergency & Critical Care Admissions',
      department: 'Central Referral Intake Desk',
      hospital_id: hospitalId,
      hospital_name: 'Receiving Medical Center',
      contact_number: '+91 1800-422-9111',
      role: 'RECEIVING_DOCTOR',
      is_online: true,
      years_experience: 15,
      available_for_transfers: true,
    },
  ];
}

/**
 * Find doctor profile by doctor ID
 */
export function getDoctorProfileById(doctorId: string): DoctorProfileRecord | undefined {
  return INITIAL_DOCTOR_PROFILES.find((d) => d.doctor_id === doctorId);
}

/**
 * Find doctor profile by user ID
 */
export function getDoctorProfileByUserId(userId: string): DoctorProfileRecord | undefined {
  return INITIAL_DOCTOR_PROFILES.find((d) => d.user_id === userId);
}
