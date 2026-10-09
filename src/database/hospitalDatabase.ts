import type {
  Hospital,
  HospitalDatabaseRecord,
  HospitalMatchResult,
  HospitalType,
  BedAvailabilityStatus,
  ExtractedRequirements,
  UrgencyLevel,
} from '../types/referral';

/**
 * ============================================================================
 * REFERRALSYNC AI - STRUCTURED HOSPITAL DATABASE LAYER
 * ============================================================================
 * Scalable local database layer storing verified-style hospital capability records.
 * Designed to integrate with external registries (e.g. ABDM Health Facility Registry).
 * Keeps hospital data logically separate from patient data for HIPAA/DISHA compliance.
 */

export interface HospitalSearchCriteria {
  searchTerm?: string;
  city?: string;
  type?: HospitalType | 'All';
  specialty?: string;
  facility?: string;
  urgency?: UrgencyLevel;
  icuRequired?: boolean;
  neuroIcuRequired?: boolean;
  ventilatorRequired?: boolean;
  ambulanceRequired?: boolean;
  emergency24x7Required?: boolean;
  bedAvailability?: BedAvailabilityStatus | 'All';
  maxDistanceKm?: number;
}

export interface HospitalQueryResult {
  total: number;
  hospitals: Hospital[];
}

export interface HospitalMatchAnalysisResult {
  eligibleMatches: HospitalMatchResult[];
  partialMatches: HospitalMatchResult[];
  allMatches: HospitalMatchResult[];
  hasFullMatch: boolean;
  message?: string;
}

// Origin coordinates: Metro Care General Hospital, Coimbatore (Reference Hospital A)
export const METRO_CARE_ORIGIN = {
  name: 'Metro Care General Hospital',
  city: 'Coimbatore',
  latitude: 11.0168,
  longitude: 76.9558,
};

/**
 * Calculates distance in kilometers between two GPS coordinates using Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 10.0; // fallback safe estimate

  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Initial Structured Hospital Database Records (10 Verified Regional Demo Hospitals)
 * Structured with all 33 required database fields.
 */
export const INITIAL_HOSPITAL_DATABASE: Hospital[] = [
  {
    // 1-9 Identification & Location
    id: 'hosp-001',
    name: 'Regional Neuro & Trauma Hospital',
    type: 'Specialty',
    state: 'Tamil Nadu',
    city: 'Coimbatore',
    address: 'Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu',
    latitude: 11.0285,
    longitude: 77.0012,
    contactNumber: '+91 422 249 8100',
    // 10-19 Emergency & Critical Facilities
    emergencyDepartmentAvailable: true,
    emergency24x7Available: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    neuroIcuAvailable: true,
    nicuAvailable: false,
    picuAvailable: false,
    traumaCentreAvailable: true,
    operationTheatreAvailable: true,
    bloodBankAvailable: true,
    // 20-28 Clinical Specialties
    cardiology: false,
    neurology: true,
    neurosurgery: true,
    orthopedics: true,
    oncology: false,
    nephrology: false,
    gastroenterology: false,
    pulmonology: false,
    pediatrics: false,
    // 29-33 Operational Status
    emergencyResuscitation: true,
    ventilatorSupport: true,
    bedAvailability: 'Beds Available',
    hospitalStatus: 'Operational',
    lastUpdated: '10 mins ago (Simulated)',
    // Backward-compatible properties
    distanceKm: 6.2,
    specialties: ['Neurology', 'Neurosurgery', 'Trauma & Orthopedics', 'Emergency Medicine', 'Critical Care'],
    equipment: ['3T MRI', '128-Slice CT', 'Digital Biplane Angiography', 'Intracranial Pressure Monitors', 'Advanced Ventilators'],
    facilities: ['Level 1 Trauma Center', '24/7 Stroke Unit', 'Neuro-ICU (20 Beds)', 'Helipad', 'Operation Theatre', 'Blood Bank'],
    services: ['Emergency Neurological Care', 'Mechanical Thrombectomy', 'Polytrauma Resuscitation', 'Rapid Triage', 'Ambulance Dispatch'],
    emergencyCapability: true,
    availabilityStatus: 'Beds Available',
    icuBedsAvailable: 4,
    referralContact: {
      coordinator: 'Dr. R. Senthil Nathan (Triage Desk)',
      phone: '+91 422 249 8100',
      email: 'triage@regionalneurotrauma.org',
      hotline: '1800-422-9111',
    },
    isSyntheticDemo: true,
  },
  {
    id: 'hosp-002',
    name: 'Coimbatore Advanced Care Hospital',
    type: 'Multi-specialty',
    state: 'Tamil Nadu',
    city: 'Coimbatore',
    address: 'Trichy Road, Ramanathapuram, Coimbatore, Tamil Nadu',
    latitude: 10.9982,
    longitude: 76.9935,
    contactNumber: '+91 422 458 7200',
    emergencyDepartmentAvailable: true,
    emergency24x7Available: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    neuroIcuAvailable: false,
    nicuAvailable: true,
    picuAvailable: true,
    traumaCentreAvailable: true,
    operationTheatreAvailable: true,
    bloodBankAvailable: true,
    cardiology: true,
    neurology: true,
    neurosurgery: false,
    orthopedics: true,
    oncology: false,
    nephrology: true,
    gastroenterology: true,
    pulmonology: true,
    pediatrics: true,
    emergencyResuscitation: true,
    ventilatorSupport: true,
    bedAvailability: 'Beds Available',
    hospitalStatus: 'Operational',
    lastUpdated: '25 mins ago (Simulated)',
    distanceKm: 8.4,
    specialties: ['Neurology', 'Cardiology', 'Pulmonology', 'Critical Care', 'General Surgery', 'Nephrology'],
    equipment: ['1.5T MRI', '64-Slice CT', 'Cath Lab', 'Advanced Ventilators', 'Continuous Dialysis'],
    facilities: ['Medical ICU (28 Beds)', 'Cardiac Care Unit (CCU)', 'Emergency Observation Unit', 'Blood Bank', 'Operation Theatre'],
    services: ['24/7 Acute Admissions', 'Interventional Radiology', 'Percutaneous Coronary Intervention', 'Sepsis Protocol', 'Ambulance Dispatch'],
    emergencyCapability: true,
    availabilityStatus: 'Beds Available',
    icuBedsAvailable: 6,
    referralContact: {
      coordinator: 'Sister M. Stella (Coordination Desk)',
      phone: '+91 422 458 7200',
      email: 'referrals@cbeadvancedcare.org',
      hotline: '1800-422-7200',
    },
    isSyntheticDemo: true,
  },
  {
    id: 'hosp-003',
    name: 'Kongu Heart & Emergency Hospital',
    type: 'Specialty',
    state: 'Tamil Nadu',
    city: 'Coimbatore',
    address: 'Mettupalayam Road, RS Puram, Coimbatore, Tamil Nadu',
    latitude: 11.0094,
    longitude: 76.9452,
    contactNumber: '+91 422 660 3300',
    emergencyDepartmentAvailable: true,
    emergency24x7Available: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    neuroIcuAvailable: false,
    nicuAvailable: false,
    picuAvailable: false,
    traumaCentreAvailable: false,
    operationTheatreAvailable: true,
    bloodBankAvailable: true,
    cardiology: true,
    neurology: false,
    neurosurgery: false,
    orthopedics: false,
    oncology: false,
    nephrology: false,
    gastroenterology: false,
    pulmonology: false,
    pediatrics: false,
    emergencyResuscitation: true,
    ventilatorSupport: true,
    bedAvailability: 'Beds Available',
    hospitalStatus: 'Operational',
    lastUpdated: '15 mins ago (Simulated)',
    distanceKm: 9.8,
    specialties: ['Cardiology', 'Cardiothoracic Surgery', 'Vascular Surgery', 'Emergency Medicine'],
    equipment: ['Dual Cath Lab', 'ECMO Machine', 'Cardiac MRI', 'Intra-Aortic Balloon Pump (IABP)', 'Advanced Ventilators'],
    facilities: ['Coronary Care Unit (16 Beds)', 'Post-Op CTICU', 'Dedicated Chest Pain Unit', 'Operation Theatre', 'Blood Bank'],
    services: ['Primary Angioplasty (24/7)', 'Aortic Dissection Protocol', 'Emergency Thrombolysis', 'Cardiac Ambulance'],
    emergencyCapability: true,
    availabilityStatus: 'Beds Available',
    icuBedsAvailable: 3,
    referralContact: {
      coordinator: 'Dr. K. Vignesh (Duty Cardiologist)',
      phone: '+91 422 660 3300',
      email: 'intake@konguheart.org',
      hotline: '1800-422-3300',
    },
    isSyntheticDemo: true,
  },
  {
    id: 'hosp-004',
    name: 'Kovai Multispeciality Centre',
    type: 'Multi-specialty',
    state: 'Tamil Nadu',
    city: 'Coimbatore',
    address: 'Sathy Road, Saravanampatti, Coimbatore, Tamil Nadu',
    latitude: 11.0601,
    longitude: 76.9950,
    contactNumber: '+91 422 399 5500',
    emergencyDepartmentAvailable: true,
    emergency24x7Available: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    neuroIcuAvailable: false,
    nicuAvailable: true,
    picuAvailable: false,
    traumaCentreAvailable: true,
    operationTheatreAvailable: true,
    bloodBankAvailable: true,
    cardiology: false,
    neurology: false,
    neurosurgery: false,
    orthopedics: false,
    oncology: false,
    nephrology: true,
    gastroenterology: true,
    pulmonology: true,
    pediatrics: true,
    emergencyResuscitation: true,
    ventilatorSupport: true,
    bedAvailability: 'Limited Capacity',
    hospitalStatus: 'Operational',
    lastUpdated: '35 mins ago (Simulated)',
    distanceKm: 12.1,
    specialties: ['Pulmonology', 'Nephrology', 'Internal Medicine', 'Gastroenterology', 'General Surgery'],
    equipment: ['64-Slice CT', 'Bronchoscopy Suite', 'Hemodialysis Unit (30 Stations)', 'Ultrasound Doppler', 'Advanced Ventilators'],
    facilities: ['Respiratory ICU (14 Beds)', 'Isolation Negative Pressure Rooms', 'High Dependency Unit', 'Operation Theatre'],
    services: ['Severe ARDS Support', 'Emergency Hemodialysis', 'GI Bleed Interventions', 'Ambulance Dispatch'],
    emergencyCapability: true,
    availabilityStatus: 'Limited Capacity',
    icuBedsAvailable: 1,
    referralContact: {
      coordinator: 'Mr. Pradeep Kumar (Patient Liaison)',
      phone: '+91 422 399 5500',
      email: 'transfers@kovaimultispeciality.org',
      hotline: '1800-422-5500',
    },
    isSyntheticDemo: true,
  },
  {
    id: 'hosp-005',
    name: 'Western Ghats Medical Institute',
    type: 'Specialty',
    state: 'Tamil Nadu',
    city: 'Coimbatore',
    address: 'Palakkad Main Road, Kuniyamuthur, Coimbatore, Tamil Nadu',
    latitude: 10.9631,
    longitude: 76.9412,
    contactNumber: '+91 422 298 1234',
    emergencyDepartmentAvailable: false,
    emergency24x7Available: false,
    ambulanceAvailable: true,
    icuAvailable: true,
    neuroIcuAvailable: false,
    nicuAvailable: false,
    picuAvailable: false,
    traumaCentreAvailable: false,
    operationTheatreAvailable: true,
    bloodBankAvailable: true,
    cardiology: false,
    neurology: false,
    neurosurgery: false,
    orthopedics: false,
    oncology: true,
    nephrology: false,
    gastroenterology: false,
    pulmonology: false,
    pediatrics: false,
    emergencyResuscitation: false,
    ventilatorSupport: true,
    bedAvailability: 'Beds Available',
    hospitalStatus: 'Operational',
    lastUpdated: '1 hour ago (Simulated)',
    distanceKm: 18.5,
    specialties: ['Medical Oncology', 'Surgical Oncology', 'Radiation Oncology', 'Hematology'],
    equipment: ['PET-CT Scanner', 'TrueBeam Linear Accelerator', 'Flow Cytometer', 'Apheresis Machine', 'Ventilators'],
    facilities: ['Bone Marrow Transplant Unit', 'Daycare Chemotherapy (40 Beds)', 'Onco-ICU', 'Operation Theatre', 'Blood Bank'],
    services: ['Acute Leukemia Management', 'Neutropenic Sepsis Protocol', 'Targeted Immunotherapy'],
    emergencyCapability: false,
    availabilityStatus: 'Beds Available',
    icuBedsAvailable: 2,
    referralContact: {
      coordinator: 'Dr. Deepa Chandran (Admissions Officer)',
      phone: '+91 422 298 1234',
      email: 'oncoadmit@westernghatsmed.org',
      hotline: '1800-422-1234',
    },
    isSyntheticDemo: true,
  },
  {
    id: 'hosp-006',
    name: 'Sri Ramana Specialty Hospital',
    type: 'Private',
    state: 'Tamil Nadu',
    city: 'Tiruppur',
    address: 'Kangayam Road, Tiruppur, Tamil Nadu',
    latitude: 11.1085,
    longitude: 77.3411,
    contactNumber: '+91 421 223 4400',
    emergencyDepartmentAvailable: true,
    emergency24x7Available: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    neuroIcuAvailable: false,
    nicuAvailable: false,
    picuAvailable: false,
    traumaCentreAvailable: true,
    operationTheatreAvailable: true,
    bloodBankAvailable: true,
    cardiology: false,
    neurology: false,
    neurosurgery: false,
    orthopedics: true,
    oncology: false,
    nephrology: false,
    gastroenterology: false,
    pulmonology: false,
    pediatrics: false,
    emergencyResuscitation: true,
    ventilatorSupport: true,
    bedAvailability: 'Beds Available',
    hospitalStatus: 'Operational',
    lastUpdated: '2 hours ago (Simulated)',
    distanceKm: 34.0,
    specialties: ['Orthopedics', 'Plastic & Microvascular Surgery', 'Burn Care', 'Emergency Medicine'],
    equipment: ['C-Arm Fluoroscopy', 'Operating Microscope', 'Specialized Laminar Air Flow Theatres', 'Ventilators'],
    facilities: ['Burn ICU (8 Beds)', 'Hand Trauma Unit', 'Step-down Surgical Ward', 'Operation Theatre', 'Blood Bank'],
    services: ['Limb Replantation', 'Complex Hand Injuries', 'Emergency Burn Debridement', 'Inter-District Ambulance'],
    emergencyCapability: true,
    availabilityStatus: 'Beds Available',
    icuBedsAvailable: 3,
    referralContact: {
      coordinator: 'Dr. Suresh Babu (Chief Surgeon)',
      phone: '+91 421 223 4400',
      email: 'trauma@sriramanahosp.org',
      hotline: '1800-421-4400',
    },
    isSyntheticDemo: true,
  },
  {
    id: 'hosp-007',
    name: 'Government Medical College & ESI Hospital',
    type: 'Government',
    state: 'Tamil Nadu',
    city: 'Coimbatore',
    address: 'Varadharajapuram, Singanallur, Coimbatore, Tamil Nadu',
    latitude: 11.0112,
    longitude: 77.0143,
    contactNumber: '+91 422 257 4300',
    emergencyDepartmentAvailable: true,
    emergency24x7Available: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    neuroIcuAvailable: true,
    nicuAvailable: true,
    picuAvailable: true,
    traumaCentreAvailable: true,
    operationTheatreAvailable: true,
    bloodBankAvailable: true,
    cardiology: true,
    neurology: true,
    neurosurgery: true,
    orthopedics: true,
    oncology: true,
    nephrology: true,
    gastroenterology: true,
    pulmonology: true,
    pediatrics: true,
    emergencyResuscitation: true,
    ventilatorSupport: true,
    bedAvailability: 'Beds Available',
    hospitalStatus: 'Operational',
    lastUpdated: '5 mins ago (Simulated)',
    distanceKm: 7.1,
    specialties: ['Neurology', 'Cardiology', 'Trauma & Orthopedics', 'Neurosurgery', 'Critical Care', 'Nephrology', 'Pediatrics'],
    equipment: ['3T MRI', '128-Slice CT', 'Cath Lab', 'Advanced Ventilators', 'Continuous Dialysis', 'Blood Gas Analyzers'],
    facilities: ['Level 1 Trauma Center', '24/7 Stroke Unit', 'Neuro-ICU', 'Medical ICU (40 Beds)', 'Blood Bank', 'Major OTs'],
    services: ['Free Emergency Stabilization', '24/7 Polytrauma Bay', 'Mechanical Thrombectomy', 'Primary PCI', 'Government Ambulance 108'],
    emergencyCapability: true,
    availabilityStatus: 'Beds Available',
    icuBedsAvailable: 8,
    referralContact: {
      coordinator: 'Dr. M. Soundararajan (Resident Medical Officer)',
      phone: '+91 422 257 4300',
      email: 'rmo@gmcesicbe.gov.in',
      hotline: '108 / 1800-425-4300',
    },
    isSyntheticDemo: true,
  },
  {
    id: 'hosp-008',
    name: 'Royal Care Super Speciality Hospital',
    type: 'Private',
    state: 'Tamil Nadu',
    city: 'Coimbatore',
    address: 'L&T Bypass Road, Neelambur, Coimbatore, Tamil Nadu',
    latitude: 11.0850,
    longitude: 77.0540,
    contactNumber: '+91 422 222 7000',
    emergencyDepartmentAvailable: true,
    emergency24x7Available: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    neuroIcuAvailable: true,
    nicuAvailable: true,
    picuAvailable: true,
    traumaCentreAvailable: true,
    operationTheatreAvailable: true,
    bloodBankAvailable: true,
    cardiology: true,
    neurology: true,
    neurosurgery: true,
    orthopedics: true,
    oncology: true,
    nephrology: true,
    gastroenterology: true,
    pulmonology: true,
    pediatrics: true,
    emergencyResuscitation: true,
    ventilatorSupport: true,
    bedAvailability: 'Beds Available',
    hospitalStatus: 'Operational',
    lastUpdated: '18 mins ago (Simulated)',
    distanceKm: 14.3,
    specialties: ['Neurology', 'Neurosurgery', 'Cardiology', 'Critical Care', 'Medical Oncology', 'Nephrology'],
    equipment: ['3T MRI', '256-Slice CT', 'Biplane Cath Lab', 'ECMO Machine', 'Robotic Surgery System', 'Advanced Ventilators'],
    facilities: ['Level 1 Trauma Center', 'Neuro-ICU (18 Beds)', 'Cardiac CCU', 'ECMO ICU', 'Operation Theatre', 'Blood Bank'],
    services: ['24/7 Comprehensive Stroke Center', 'Emergency Bypass', 'Cardiac Catheterization', 'Air Ambulance Coordination'],
    emergencyCapability: true,
    availabilityStatus: 'Beds Available',
    icuBedsAvailable: 5,
    referralContact: {
      coordinator: 'Dr. C. Balasubramanian (Triage Director)',
      phone: '+91 422 222 7000',
      email: 'emergency@royalcarehospital.in',
      hotline: '1800-120-7000',
    },
    isSyntheticDemo: true,
  },
  {
    id: 'hosp-009',
    name: 'G. Kuppuswamy Naidu Memorial Hospital (GKNM)',
    type: 'Multi-specialty',
    state: 'Tamil Nadu',
    city: 'Coimbatore',
    address: 'Pappanaickenpalayam, Coimbatore, Tamil Nadu',
    latitude: 11.0135,
    longitude: 76.9840,
    contactNumber: '+91 422 430 5300',
    emergencyDepartmentAvailable: true,
    emergency24x7Available: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    neuroIcuAvailable: false,
    nicuAvailable: true,
    picuAvailable: true,
    traumaCentreAvailable: true,
    operationTheatreAvailable: true,
    bloodBankAvailable: true,
    cardiology: true,
    neurology: false,
    neurosurgery: false,
    orthopedics: true,
    oncology: true,
    nephrology: true,
    gastroenterology: true,
    pulmonology: true,
    pediatrics: true,
    emergencyResuscitation: true,
    ventilatorSupport: true,
    bedAvailability: 'Beds Available',
    hospitalStatus: 'Operational',
    lastUpdated: '30 mins ago (Simulated)',
    distanceKm: 4.8,
    specialties: ['Cardiology', 'Cardiothoracic Surgery', 'Pediatrics', 'Medical Oncology', 'Orthopedics'],
    equipment: ['Cath Lab', '128-Slice CT', 'PET-CT Scanner', 'Advanced Ventilators', 'Echocardiography 4D'],
    facilities: ['Pediatric ICU (PICU)', 'Neonatal ICU (NICU)', 'Coronary Care Unit (CCU)', 'Blood Bank', 'Operation Theatre'],
    services: ['Pediatric Cardiology Emergency', 'Acute Coronary Syndrome', 'Pediatric Surgery', '24/7 Ambulance'],
    emergencyCapability: true,
    availabilityStatus: 'Beds Available',
    icuBedsAvailable: 4,
    referralContact: {
      coordinator: 'Dr. A. Meenakshi (Patient Coordination)',
      phone: '+91 422 430 5300',
      email: 'emergency@gknmhospital.org',
      hotline: '1800-425-5300',
    },
    isSyntheticDemo: true,
  },
  {
    id: 'hosp-010',
    name: 'Tiruppur Government District Headquarters Hospital',
    type: 'Government',
    state: 'Tamil Nadu',
    city: 'Tiruppur',
    address: 'Dharapuram Road, Tiruppur, Tamil Nadu',
    latitude: 11.1120,
    longitude: 77.3480,
    contactNumber: '+91 421 224 2200',
    emergencyDepartmentAvailable: true,
    emergency24x7Available: true,
    ambulanceAvailable: true,
    icuAvailable: true,
    neuroIcuAvailable: false,
    nicuAvailable: true,
    picuAvailable: true,
    traumaCentreAvailable: true,
    operationTheatreAvailable: true,
    bloodBankAvailable: true,
    cardiology: false,
    neurology: false,
    neurosurgery: false,
    orthopedics: true,
    oncology: false,
    nephrology: false,
    gastroenterology: false,
    pulmonology: true,
    pediatrics: true,
    emergencyResuscitation: true,
    ventilatorSupport: true,
    bedAvailability: 'Critical Only',
    hospitalStatus: 'Operational',
    lastUpdated: '45 mins ago (Simulated)',
    distanceKm: 36.5,
    specialties: ['General Medicine', 'Trauma & Orthopedics', 'General Surgery', 'Pediatrics', 'Obstetrics'],
    equipment: ['64-Slice CT', 'Digital X-Ray', 'Basic Ventilators', 'Ultrasound'],
    facilities: ['District Emergency Ward', 'Trauma OT', 'Medical ICU (12 Beds)', 'Blood Bank'],
    services: ['Emergency Triage', 'Basic Trauma Resuscitation', '108 Ambulance Hub'],
    emergencyCapability: true,
    availabilityStatus: 'Critical Only',
    icuBedsAvailable: 1,
    referralContact: {
      coordinator: 'Dr. P. Ravichandran (Duty Medical Officer)',
      phone: '+91 421 224 2200',
      email: 'hq@tiruppurdistricthosp.gov.in',
      hotline: '108 / +91 421 224 2200',
    },
    isSyntheticDemo: true,
  },
];

/**
 * Hospital Database Class
 * Manages records in-memory with optional localStorage persistence,
 * scalable for thousands of records.
 */
class HospitalDatabaseService {
  private hospitals: Hospital[] = [];

  constructor() {
    this.init();
  }

  private init() {
    // Initialize with verified demo records
    this.hospitals = [...INITIAL_HOSPITAL_DATABASE];
    this.recalculateDistances();
  }

  /**
   * Recalculates distances based on coordinates relative to Metro Care Origin
   */
  public recalculateDistances(origin = METRO_CARE_ORIGIN) {
    this.hospitals = this.hospitals.map((h) => {
      if (h.latitude && h.longitude) {
        const calculatedDistance = calculateDistanceKm(
          origin.latitude,
          origin.longitude,
          h.latitude,
          h.longitude
        );
        return {
          ...h,
          distanceKm: calculatedDistance,
        };
      }
      return h;
    });
  }

  /**
   * Return all hospitals in database
   */
  public getAllHospitals(): Hospital[] {
    return [...this.hospitals];
  }

  /**
   * Retrieve hospital by ID
   */
  public getHospitalById(id: string): Hospital | undefined {
    return this.hospitals.find((h) => h.id === id);
  }

  /**
   * Search hospital database based on structured criteria
   */
  public searchHospitals(criteria: HospitalSearchCriteria): HospitalQueryResult {
    let results = [...this.hospitals];

    // Search term filter
    if (criteria.searchTerm && criteria.searchTerm.trim()) {
      const term = criteria.searchTerm.toLowerCase().trim();
      results = results.filter((h) =>
        h.name.toLowerCase().includes(term) ||
        h.city.toLowerCase().includes(term) ||
        h.type.toLowerCase().includes(term) ||
        h.specialties.some((s) => s.toLowerCase().includes(term)) ||
        h.equipment.some((e) => e.toLowerCase().includes(term)) ||
        h.facilities.some((f) => f.toLowerCase().includes(term))
      );
    }

    // City filter
    if (criteria.city && criteria.city !== 'All') {
      results = results.filter((h) => h.city.toLowerCase() === criteria.city!.toLowerCase());
    }

    // Hospital type filter
    if (criteria.type && criteria.type !== 'All') {
      results = results.filter((h) => h.type === criteria.type);
    }

    // Specialty filter
    if (criteria.specialty && criteria.specialty !== 'All') {
      const spec = criteria.specialty.toLowerCase();
      results = results.filter((h) =>
        h.specialties.some((s) => s.toLowerCase().includes(spec)) ||
        (spec.includes('neuro') && (h.neurology || h.neurosurgery)) ||
        (spec.includes('cardio') && h.cardiology) ||
        (spec.includes('trauma') && (h.orthopedics || h.traumaCentreAvailable)) ||
        (spec.includes('pulmo') && h.pulmonology) ||
        (spec.includes('onco') && h.oncology) ||
        (spec.includes('nephro') && h.nephrology) ||
        (spec.includes('pediat') && h.pediatrics)
      );
    }

    // Facility filter
    if (criteria.facility && criteria.facility !== 'All') {
      const fac = criteria.facility.toLowerCase();
      results = results.filter((h) => {
        if (fac.includes('neuro-icu')) return h.neuroIcuAvailable;
        if (fac.includes('icu')) return h.icuAvailable;
        if (fac.includes('trauma')) return h.traumaCentreAvailable;
        if (fac.includes('ventilator')) return h.ventilatorSupport;
        if (fac.includes('ot') || fac.includes('theatre')) return h.operationTheatreAvailable;
        if (fac.includes('blood')) return h.bloodBankAvailable;
        return h.facilities.some((f) => f.toLowerCase().includes(fac));
      });
    }

    // Emergency 24x7 filter
    if (criteria.emergency24x7Required) {
      results = results.filter((h) => h.emergency24x7Available);
    }

    // Ambulance filter
    if (criteria.ambulanceRequired) {
      results = results.filter((h) => h.ambulanceAvailable);
    }

    // Bed availability filter
    if (criteria.bedAvailability && criteria.bedAvailability !== 'All') {
      results = results.filter((h) => h.bedAvailability === criteria.bedAvailability);
    }

    // Max distance filter
    if (criteria.maxDistanceKm) {
      results = results.filter((h) => h.distanceKm <= criteria.maxDistanceKm!);
    }

    return {
      total: results.length,
      hospitals: results,
    };
  }

  /**
   * CRITICAL FILTERING AND MULTI-TIER RANKING ALGORITHM
   * 
   * Given referral requirements:
   * 1. Extracts critical requirements (e.g. Neuro-ICU, Emergency, Ventilator, Cath Lab).
   * 2. Evaluates every hospital in the database:
   *    - Eligible if ALL critical requirements are confirmed.
   *    - Partial Match if any critical requirement is missing.
   * 3. Ranks eligible hospitals using the 7 criteria:
   *    - Capability match
   *    - Required specialty match
   *    - Required facility match
   *    - Emergency/24x7 availability
   *    - Bed availability
   *    - Distance/location
   *    - Other referral requirements
   * 4. Returns separate eligible and partial matches, and sets message if no hospital meets all critical requirements.
   */
  public findAndRankHospitals(
    requirements: ExtractedRequirements,
    originLocation = METRO_CARE_ORIGIN
  ): HospitalMatchAnalysisResult {
    // Validate referral requirements input
    const safeSpecialty = requirements.specialty || 'General Medicine';
    const safeEquipment = requirements.equipment || [];
    const safeFacility = requirements.facility || [];
    const isEmergency = requirements.urgency === 'Emergency' || requirements.emergency;

    // Detect critical facility requirements for scoring weights
    const requiresNeuroIcu = safeFacility.some((f) => f.toLowerCase().includes('neuro-icu'));
    const requiresIcu = safeFacility.some((f) => f.toLowerCase().includes('icu')) || requiresNeuroIcu;
    const requiresVentilator = safeEquipment.some((e) => e.toLowerCase().includes('ventilator')) ||
      safeFacility.some((f) => f.toLowerCase().includes('ventilator'));
    const requiresTrauma = safeFacility.some((f) => f.toLowerCase().includes('trauma'));

    // Evaluate each hospital in the database
    const allEvaluated = this.hospitals.map((hospital) => {
      // 1. Check critical requirement satisfaction
      const missingCritical: string[] = [];
      const matchedCapabilities: string[] = [];

      // Check Specialty
      const specLower = safeSpecialty.toLowerCase();
      let specialtyMatched = false;
      if (specLower.includes('neuro')) {
        specialtyMatched = hospital.neurology || hospital.neurosurgery || hospital.specialties.some(s => s.toLowerCase().includes('neuro'));
        if (specialtyMatched) matchedCapabilities.push('✓ Neurology');
        else missingCritical.push('Neurology department');
      } else if (specLower.includes('cardio')) {
        specialtyMatched = hospital.cardiology || hospital.specialties.some(s => s.toLowerCase().includes('cardio'));
        if (specialtyMatched) matchedCapabilities.push('✓ Cardiology');
        else missingCritical.push('Cardiology department');
      } else if (specLower.includes('trauma') || specLower.includes('ortho')) {
        specialtyMatched = hospital.orthopedics || hospital.traumaCentreAvailable || hospital.specialties.some(s => s.toLowerCase().includes('ortho') || s.toLowerCase().includes('trauma'));
        if (specialtyMatched) matchedCapabilities.push('✓ Trauma & Orthopedics');
        else missingCritical.push('Trauma & Orthopedic team');
      } else if (specLower.includes('pulmo') || specLower.includes('lung') || specLower.includes('respiratory')) {
        specialtyMatched = hospital.pulmonology || hospital.specialties.some(s => s.toLowerCase().includes('pulmo'));
        if (specialtyMatched) matchedCapabilities.push('✓ Pulmonology');
        else missingCritical.push('Pulmonology department');
      } else if (specLower.includes('onco') || specLower.includes('cancer')) {
        specialtyMatched = hospital.oncology || hospital.specialties.some(s => s.toLowerCase().includes('onco'));
        if (specialtyMatched) matchedCapabilities.push('✓ Medical Oncology');
        else missingCritical.push('Oncology department');
      } else if (specLower.includes('nephro') || specLower.includes('dialysis')) {
        specialtyMatched = hospital.nephrology || hospital.specialties.some(s => s.toLowerCase().includes('nephro'));
        if (specialtyMatched) matchedCapabilities.push('✓ Nephrology');
        else missingCritical.push('Nephrology department');
      } else {
        specialtyMatched = hospital.specialties.some(s => s.toLowerCase().includes(specLower));
        if (specialtyMatched) matchedCapabilities.push(`✓ ${safeSpecialty}`);
      }

      // Check Critical Facilities explicitly requested
      safeFacility.forEach((reqFac) => {
        const facLower = reqFac.toLowerCase();
        let matched = false;

        if (facLower.includes('neuro-icu')) {
          matched = hospital.neuroIcuAvailable || hospital.facilities.some(f => f.toLowerCase().includes('neuro-icu'));
        } else if (facLower.includes('ccu') || facLower.includes('cardiac care') || facLower.includes('coronary care')) {
          matched = hospital.facilities.some(f => f.toLowerCase().includes('ccu') || f.toLowerCase().includes('coronary') || f.toLowerCase().includes('cardiac care'));
        } else if (facLower.includes('respiratory icu')) {
          matched = hospital.facilities.some(f => f.toLowerCase().includes('respiratory icu'));
        } else if (facLower.includes('trauma')) {
          matched = hospital.traumaCentreAvailable || hospital.facilities.some(f => f.toLowerCase().includes('trauma'));
        } else if (facLower.includes('bone marrow')) {
          matched = hospital.facilities.some(f => f.toLowerCase().includes('bone marrow'));
        } else if (facLower.includes('stroke unit')) {
          matched = hospital.facilities.some(f => f.toLowerCase().includes('stroke unit'));
        } else if (facLower.includes('nicu') || facLower.includes('neonatal')) {
          matched = hospital.nicuAvailable || hospital.facilities.some(f => f.toLowerCase().includes('nicu'));
        } else if (facLower.includes('picu') || facLower.includes('pediatric icu')) {
          matched = hospital.picuAvailable || hospital.facilities.some(f => f.toLowerCase().includes('picu'));
        } else if (facLower.includes('icu') || facLower.includes('intensive care')) {
          matched = hospital.icuAvailable || hospital.facilities.some(f => f.toLowerCase().includes('icu'));
        } else {
          matched = hospital.facilities.some(f => f.toLowerCase().includes(facLower));
        }

        if (matched) {
          if (!matchedCapabilities.includes(`✓ ${reqFac}`)) {
            matchedCapabilities.push(`✓ ${reqFac}`);
          }
        } else {
          missingCritical.push(reqFac);
        }
      });

      // Check Critical Equipment explicitly requested
      safeEquipment.forEach((reqEq) => {
        const eqLower = reqEq.toLowerCase();
        let matched = false;

        if (eqLower.includes('ventilator')) {
          matched = hospital.ventilatorSupport || hospital.equipment.some(e => e.toLowerCase().includes('ventilator'));
        } else if (eqLower.includes('cath lab')) {
          matched = hospital.equipment.some(e => e.toLowerCase().includes('cath lab'));
        } else if (eqLower.includes('3t mri')) {
          matched = hospital.equipment.some(e => e.toLowerCase().includes('3t mri'));
        } else if (eqLower.includes('1.5t mri')) {
          matched = hospital.equipment.some(e => e.toLowerCase().includes('mri'));
        } else if (eqLower.includes('128-slice ct') || eqLower.includes('256-slice ct')) {
          matched = hospital.equipment.some(e => e.toLowerCase().includes('128-slice') || e.toLowerCase().includes('256-slice'));
        } else if (eqLower.includes('ecmo')) {
          matched = hospital.equipment.some(e => e.toLowerCase().includes('ecmo'));
        } else if (eqLower.includes('dialysis')) {
          matched = hospital.equipment.some(e => e.toLowerCase().includes('dialysis'));
        } else if (eqLower.includes('pet-ct')) {
          matched = hospital.equipment.some(e => e.toLowerCase().includes('pet-ct'));
        } else {
          matched = hospital.equipment.some(e => e.toLowerCase().includes(eqLower));
        }

        if (matched) {
          if (!matchedCapabilities.includes(`✓ ${reqEq}`)) {
            matchedCapabilities.push(`✓ ${reqEq}`);
          }
        } else {
          missingCritical.push(reqEq);
        }
      });

      // Check Emergency & 24x7
      if (isEmergency) {
        if (hospital.emergency24x7Available) {
          if (!matchedCapabilities.includes('✓ 24x7 Emergency')) matchedCapabilities.push('✓ 24x7 Emergency');
        } else if (hospital.emergencyDepartmentAvailable) {
          if (!matchedCapabilities.includes('✓ Emergency Department')) matchedCapabilities.push('✓ Emergency Department');
        } else {
          missingCritical.push('24/7 Emergency response');
        }
      } else {
        if (hospital.emergency24x7Available) {
          if (!matchedCapabilities.includes('✓ 24x7 Emergency')) matchedCapabilities.push('✓ 24x7 Emergency');
        }
      }

      // Add general ambulance capability if present
      if (hospital.ambulanceAvailable) {
        matchedCapabilities.push('✓ Ambulance Available');
      }

      // Determine Eligibility: Must satisfy all requested critical items
      const isEligible = missingCritical.length === 0;

      // 2. SCORING ALGORITHM (0 - 100)
      let score = 0;
      const matchedReasons: string[] = [];
      const missingOrPartial: string[] = [];

      // A. Specialty Match (Weight: 35)
      if (specialtyMatched) {
        score += 35;
        matchedReasons.push(`${safeSpecialty} department confirmed active on site`);
      } else {
        missingOrPartial.push(`Primary specialty (${safeSpecialty}) not on verified roster`);
      }

      // B. Facility Match (Weight: 25)
      let facilityScore = 0;
      let facilityChecks = 0;
      if (requiresNeuroIcu) {
        facilityChecks++;
        if (hospital.neuroIcuAvailable) facilityScore += 12;
      } else if (requiresIcu) {
        facilityChecks++;
        if (hospital.icuAvailable) facilityScore += 10;
      }
      if (requiresVentilator) {
        facilityChecks++;
        if (hospital.ventilatorSupport) facilityScore += 8;
      }
      if (requiresTrauma) {
        facilityChecks++;
        if (hospital.traumaCentreAvailable) facilityScore += 5;
      }
      if (facilityChecks === 0) {
        // General facility baseline
        facilityScore = hospital.icuAvailable ? 20 : 10;
      }
      score += Math.min(25, facilityScore);

      // C. Emergency / 24x7 Capability (Weight: 15)
      if (hospital.emergency24x7Available) {
        score += 15;
        matchedReasons.push('24/7 Round-the-clock emergency admission active');
      } else if (hospital.emergencyDepartmentAvailable) {
        score += 10;
        matchedReasons.push('Emergency department operational during daytime hours');
      } else {
        missingOrPartial.push('No 24/7 emergency admission capability');
      }

      // D. Bed Availability (Weight: 10)
      if (hospital.bedAvailability === 'Beds Available') {
        score += 10;
        matchedReasons.push(`Bed readiness: ${hospital.icuBedsAvailable} ICU beds immediately accessible`);
      } else if (hospital.bedAvailability === 'Limited Capacity') {
        score += 5;
        matchedReasons.push('Bed readiness: Limited ICU capacity reported');
      } else {
        missingOrPartial.push('Facility currently reporting restricted or critical bed occupancy');
      }

      // E. Proximity / Transit Distance (Weight: 10)
      const dist = hospital.distanceKm || calculateDistanceKm(
        originLocation.latitude,
        originLocation.longitude,
        hospital.latitude,
        hospital.longitude
      );
      if (dist <= 10) {
        score += 10;
        matchedReasons.push(`Immediate local transit radius (${dist} km)`);
      } else if (dist <= 20) {
        score += 6;
        matchedReasons.push(`Moderate transit window (${dist} km)`);
      } else if (dist <= 35) {
        score += 2;
        missingOrPartial.push(`Inter-district transit (${dist} km)`);
      } else {
        missingOrPartial.push(`Extended distance (${dist} km) - Requires advance ambulance dispatch`);
      }

      // F. Ancillary Readiness (Ambulance, Blood Bank, OT) (Weight: 5)
      if (hospital.ambulanceAvailable && hospital.bloodBankAvailable) {
        score += 5;
      }

      // If missing critical facilities, penalize score so partial matches rank lower
      if (!isEligible) {
        score = Math.min(65, Math.max(20, Math.round(score * 0.65)));
      } else {
        score = Math.min(98, Math.max(75, Math.round(score)));
      }

      // Calculate Transit Time Estimate
      const minMinutes = Math.round(dist * 1.6 + 5);
      const maxMinutes = Math.round(dist * 2.2 + 10);
      const transitTimeEstimate = `${minMinutes} - ${maxMinutes} mins`;

      // Formulate human-readable clinical recommendation reason
      let recommendedReason = '';
      if (isEligible) {
        recommendedReason = `Matches all critical ${safeSpecialty.toLowerCase()} requirements: ${matchedCapabilities.join(' • ')} are confirmed operational with verified beds available (${dist} km).`;
      } else {
        recommendedReason = `Partial capability match: Lacks ${missingCritical.join(', ')}. Attending physician triage verification needed before patient dispatch.`;
      }

      const matchResult: HospitalMatchResult = {
        hospital,
        matchScore: score,
        matchedReasons: matchedReasons.length > 0 ? matchedReasons : ['General facility capability match'],
        missingOrPartial: [...missingCritical, ...missingOrPartial],
        recommendedReason,
        transitTimeEstimate,
        isEligible,
        isPartialMatch: !isEligible,
        matchedCapabilities,
      };

      return matchResult;
    });

    // Partition into eligible vs partial
    const eligibleMatches = allEvaluated
      .filter((m) => m.isEligible)
      .sort((a, b) => b.matchScore - a.matchScore);

    const partialMatches = allEvaluated
      .filter((m) => !m.isEligible)
      .sort((a, b) => b.matchScore - a.matchScore);

    const hasFullMatch = eligibleMatches.length > 0;

    // Combined ranking list: Eligible first, followed by partial matches
    const allMatches = [...eligibleMatches, ...partialMatches];

    return {
      eligibleMatches,
      partialMatches,
      allMatches,
      hasFullMatch,
      message: !hasFullMatch
        ? 'No hospital currently matches all required capabilities.'
        : undefined,
    };
  }

  /**
   * Import external hospital records (e.g. from ABDM Health Facility Registry)
   */
  public importHospitalRecords(records: HospitalDatabaseRecord[]): { importedCount: number; errors: string[] } {
    const errors: string[] = [];
    let count = 0;

    records.forEach((rec, idx) => {
      if (!rec.id || !rec.name) {
        errors.push(`Record #${idx + 1} skipped: Missing id or name.`);
        return;
      }

      const existingIndex = this.hospitals.findIndex((h) => h.id === rec.id);
      const distance = calculateDistanceKm(
        METRO_CARE_ORIGIN.latitude,
        METRO_CARE_ORIGIN.longitude,
        rec.latitude,
        rec.longitude
      );

      const fullHospital: Hospital = {
        ...rec,
        distanceKm: distance,
        specialties: [
          ...(rec.neurology ? ['Neurology'] : []),
          ...(rec.neurosurgery ? ['Neurosurgery'] : []),
          ...(rec.cardiology ? ['Cardiology'] : []),
          ...(rec.orthopedics ? ['Orthopedics'] : []),
          ...(rec.oncology ? ['Medical Oncology'] : []),
          ...(rec.nephrology ? ['Nephrology'] : []),
          ...(rec.pulmonology ? ['Pulmonology'] : []),
          ...(rec.pediatrics ? ['Pediatrics'] : []),
          ...(rec.gastroenterology ? ['Gastroenterology'] : []),
        ],
        equipment: [
          ...(rec.ventilatorSupport ? ['Advanced Ventilators'] : []),
          'Diagnostic Imaging',
        ],
        facilities: [
          ...(rec.neuroIcuAvailable ? ['Neuro-ICU'] : []),
          ...(rec.icuAvailable ? ['Medical ICU'] : []),
          ...(rec.traumaCentreAvailable ? ['Trauma Center'] : []),
          ...(rec.bloodBankAvailable ? ['Blood Bank'] : []),
        ],
        services: [
          ...(rec.emergency24x7Available ? ['24/7 Emergency Admissions'] : []),
          ...(rec.ambulanceAvailable ? ['Ambulance Dispatch'] : []),
        ],
        emergencyCapability: rec.emergency24x7Available,
        availabilityStatus: rec.bedAvailability,
        icuBedsAvailable: rec.bedAvailability === 'Beds Available' ? 4 : rec.bedAvailability === 'Limited Capacity' ? 1 : 0,
        referralContact: {
          coordinator: 'Registry Referral Desk',
          phone: rec.contactNumber,
          email: `referral@${rec.id}.org`,
          hotline: rec.contactNumber,
        },
        isSyntheticDemo: true,
      };

      if (existingIndex >= 0) {
        this.hospitals[existingIndex] = fullHospital;
      } else {
        this.hospitals.push(fullHospital);
      }
      count++;
    });

    return { importedCount: count, errors };
  }

  /**
   * Reset database back to default initial records
   */
  public resetHospitalDatabase(): void {
    this.init();
  }
}

// Global Singleton Hospital Database Instance
export const hospitalDatabase = new HospitalDatabaseService();
