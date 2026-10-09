export type ReferralStatus =
  | 'Pending'
  | 'AI Recommended'
  | 'Doctor Approved'
  | 'Hospital Accepted'
  | 'Accepted'
  | 'In Transfer'
  | 'In Progress'
  | 'Completed'
  | 'Rejected';

export type UrgencyLevel = 'Routine' | 'Urgent' | 'Emergency';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  currentHospital: string;
  assignedDoctor: string;
  currentCare: string;
  referralRequirement: string;
  requiredSpecialty: string;
  requiredEquipment: string;
  requiredFacility: string;
  urgency: UrgencyLevel;
  referralStatus: ReferralStatus;
  lastUpdated: string;
  phone?: string;
  bloodGroup?: string;
}

export type HospitalType = 'Government' | 'Private' | 'Multi-specialty' | 'Specialty';
export type HospitalStatus = 'Operational' | 'Limited' | 'Inactive';
export type BedAvailabilityStatus = 'Beds Available' | 'Limited Capacity' | 'Critical Only' | 'Full';

export interface HospitalDatabaseRecord {
  // 1. Hospital ID
  id: string;
  // 2. Hospital Name
  name: string;
  // 3. Hospital Type
  type: HospitalType;
  // 4. State
  state: string;
  // 5. City
  city: string;
  // 6. Address
  address: string;
  // 7. Latitude
  latitude: number;
  // 8. Longitude
  longitude: number;
  // 9. Contact Number
  contactNumber: string;
  // 10. Emergency Department Available
  emergencyDepartmentAvailable: boolean;
  // 11. 24x7 Emergency Available
  emergency24x7Available: boolean;
  // 12. Ambulance Available
  ambulanceAvailable: boolean;
  // 13. ICU Available
  icuAvailable: boolean;
  // 14. Neuro-ICU Available
  neuroIcuAvailable: boolean;
  // 15. NICU Available
  nicuAvailable: boolean;
  // 16. PICU Available
  picuAvailable: boolean;
  // 17. Trauma Centre Available
  traumaCentreAvailable: boolean;
  // 18. Operation Theatre Available
  operationTheatreAvailable: boolean;
  // 19. Blood Bank Available
  bloodBankAvailable: boolean;
  // 20. Cardiology
  cardiology: boolean;
  // 21. Neurology
  neurology: boolean;
  // 22. Neurosurgery
  neurosurgery: boolean;
  // 23. Orthopedics
  orthopedics: boolean;
  // 24. Oncology
  oncology: boolean;
  // 25. Nephrology
  nephrology: boolean;
  // 26. Gastroenterology
  gastroenterology: boolean;
  // 27. Pulmonology
  pulmonology: boolean;
  // 28. Pediatrics
  pediatrics: boolean;
  // 29. Emergency Resuscitation
  emergencyResuscitation: boolean;
  // 30. Ventilator Support
  ventilatorSupport: boolean;
  // 31. Bed Availability
  bedAvailability: BedAvailabilityStatus;
  // 32. Hospital Status
  hospitalStatus: HospitalStatus;
  // 33. Last Updated
  lastUpdated: string;
}

export interface Hospital extends HospitalDatabaseRecord {
  distanceKm: number;
  specialties: string[];
  equipment: string[];
  facilities: string[];
  services: string[];
  emergencyCapability: boolean;
  availabilityStatus: BedAvailabilityStatus;
  icuBedsAvailable: number;
  referralContact: {
    coordinator: string;
    phone: string;
    email: string;
    hotline: string;
  };
  isSyntheticDemo: true;
}

export interface ExtractedRequirements {
  specialty: string;
  equipment: string[];
  facility: string[];
  services: string[];
  emergency: boolean;
  urgency: UrgencyLevel;
  extractedFromText?: string;
}

export interface HospitalMatchResult {
  hospital: Hospital;
  matchScore: number; // 0 - 100 prototype ranking score
  matchedReasons: string[];
  missingOrPartial: string[];
  recommendedReason: string;
  transitTimeEstimate: string;
  isEligible?: boolean;
  isPartialMatch?: boolean;
  matchedCapabilities?: string[];
}

export interface ReferralTimelineEvent {
  step: string;
  timestamp: string;
  actor: string;
  status: 'completed' | 'current' | 'pending';
  notes: string;
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: 'Male' | 'Female' | 'Other';
  currentHospital: string;
  receivingHospital: string;
  receivingHospitalId?: string;
  referringDoctorId?: string;
  referringDoctorName?: string;
  receivingDoctorId?: string;
  receivingDoctorName?: string;
  requiredSpecialty: string;
  urgency: UrgencyLevel;
  status: ReferralStatus;
  createdDate: string;
  aiRecommendationScore?: number;
  aiRecommendationSummary?: string;
  doctorApprovalStatus: 'Approved by Dr. Ananya Rao' | 'Pending Review' | 'Rejected' | 'Alternative Facility Chosen';
  doctorApprovalDate?: string;
  hospitalResponse: 'Accepted' | 'Pending' | 'Reviewing Beds' | 'Declined';
  transferStatus: 'Pending Dispatch' | 'Ambulance En Route' | 'Patient Arrived' | 'Completed' | 'Standby';
  timeline: ReferralTimelineEvent[];
  doctorNotes?: string;
  referralReason: string;
  rejectionReason?: string;
  responseNotes?: string;
  assignedBed?: string;
}

export interface DoctorProfile {
  name: string;
  title: string;
  hospital: string;
  department: string;
  isOnline: boolean;
  avatarUrl: string;
  unreadNotifications: number;
}

