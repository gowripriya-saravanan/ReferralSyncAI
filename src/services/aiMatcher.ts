import type {
  ExtractedRequirements,
  Hospital,
  HospitalMatchResult,
  UrgencyLevel,
} from '../types/referral';

/**
 * DETERMINISTIC LOCAL PROTOTYPE AI MATCHER & REQUIREMENT EXTRACTOR
 * Safely parses free-text referral descriptions and evaluates hospital capability
 * against verified datasets without calling external APIs or claiming medical diagnosis.
 */

export function extractRequirementsFromText(
  text: string,
  defaults?: Partial<ExtractedRequirements>
): ExtractedRequirements {
  const lower = text.toLowerCase();

  // Specialty detection
  let specialty = defaults?.specialty || '';
  if (!specialty || specialty === 'General') {
    if (lower.includes('neuro') || lower.includes('brain') || lower.includes('stroke') || lower.includes('seizure') || lower.includes('epilep')) {
      specialty = 'Neurology';
    } else if (lower.includes('cardio') || lower.includes('heart') || lower.includes('angioplasty') || lower.includes('cath') || lower.includes('troponin') || lower.includes('infarct')) {
      specialty = 'Cardiology';
    } else if (lower.includes('trauma') || lower.includes('ortho') || lower.includes('fracture') || lower.includes('pelvic') || lower.includes('bone')) {
      specialty = 'Trauma & Orthopedics';
    } else if (lower.includes('pulmo') || lower.includes('lung') || lower.includes('respiratory') || lower.includes('ards') || lower.includes('ecmo') || lower.includes('ventilator')) {
      specialty = 'Pulmonology';
    } else if (lower.includes('onco') || lower.includes('cancer') || lower.includes('leukemia') || lower.includes('lymphoma') || lower.includes('tumor') || lower.includes('chemo')) {
      specialty = 'Medical Oncology';
    } else if (lower.includes('nephro') || lower.includes('kidney') || lower.includes('dialysis') || lower.includes('renal')) {
      specialty = 'Nephrology';
    } else if (lower.includes('vascular') || lower.includes('arter') || lower.includes('thrombectomy') || lower.includes('limb ischemia')) {
      specialty = 'Vascular Surgery';
    } else {
      specialty = 'Internal Medicine / Critical Care';
    }
  }

  // Equipment extraction
  const equipmentSet = new Set<string>(defaults?.equipment || []);
  if (lower.includes('3t mri') || lower.includes('3 tesla')) {
    equipmentSet.add('3T MRI');
  } else if (lower.includes('mri')) {
    equipmentSet.add('MRI');
  }

  if (lower.includes('128-slice ct') || lower.includes('128 slice')) {
    equipmentSet.add('128-Slice CT');
  } else if (lower.includes('64-slice ct') || lower.includes('64 slice')) {
    equipmentSet.add('64-Slice CT');
  } else if (lower.includes('ct') || lower.includes('cat scan') || lower.includes('computed tomography')) {
    equipmentSet.add('CT Scanner');
  }

  if (lower.includes('cath lab') || lower.includes('catheterization') || lower.includes('coronary angiogra')) {
    equipmentSet.add('Cath Lab');
  }

  if (lower.includes('ecmo')) {
    equipmentSet.add('ECMO Machine');
  }

  if (lower.includes('ventilator') || lower.includes('mechanical ventilation')) {
    equipmentSet.add('Advanced Ventilators');
  }

  if (lower.includes('dialysis') || lower.includes('hemodialysis')) {
    equipmentSet.add('Continuous Dialysis');
  }

  if (lower.includes('pet-ct') || lower.includes('pet scan')) {
    equipmentSet.add('PET-CT Scanner');
  }

  if (lower.includes('c-arm') || lower.includes('fluoroscopy')) {
    equipmentSet.add('C-Arm Fluoroscopy');
  }

  // Facilities extraction
  const facilitySet = new Set<string>(defaults?.facility || []);
  if (lower.includes('neuro-icu') || (lower.includes('neuro') && lower.includes('icu'))) {
    facilitySet.add('Neuro-ICU');
  } else if (lower.includes('cardiac care unit') || lower.includes('ccu') || (lower.includes('cardio') && lower.includes('icu'))) {
    facilitySet.add('Cardiac Care Unit (CCU)');
  } else if (lower.includes('respiratory icu')) {
    facilitySet.add('Respiratory ICU');
  } else if (lower.includes('icu') || lower.includes('intensive care') || lower.includes('critical care unit')) {
    facilitySet.add('Medical ICU');
  }

  if (lower.includes('stroke unit') || lower.includes('stroke care')) {
    facilitySet.add('24/7 Stroke Unit');
  }

  if (lower.includes('trauma center') || lower.includes('level 1') || lower.includes('trauma bay')) {
    facilitySet.add('Level 1 Trauma Center');
  }

  if (lower.includes('bone marrow') || lower.includes('transplant unit')) {
    facilitySet.add('Bone Marrow Transplant Unit');
  }

  // Services
  const servicesSet = new Set<string>(defaults?.services || []);
  if (lower.includes('thrombectomy') || lower.includes('clot retrieval')) {
    servicesSet.add('Mechanical Thrombectomy');
  }
  if (lower.includes('angioplasty') || lower.includes('stent') || lower.includes('pci')) {
    servicesSet.add('Primary Angioplasty (24/7)');
  }
  if (lower.includes('emergency') || lower.includes('acute care') || lower.includes('urgent triage')) {
    servicesSet.add('Emergency Resuscitation & Triage');
  }

  // Emergency Capability
  const emergency =
    lower.includes('emergency') ||
    lower.includes('urgent') ||
    lower.includes('stat') ||
    lower.includes('acute') ||
    lower.includes('immediate') ||
    (defaults?.emergency ?? true);

  // Urgency
  let urgency: UrgencyLevel = defaults?.urgency || 'Routine';
  if (lower.includes('stat') || lower.includes('emergency') || lower.includes('immediate') || lower.includes('resuscitation') || lower.includes('within 60') || lower.includes('within 90')) {
    urgency = 'Emergency';
  } else if (lower.includes('urgent') || lower.includes('priority') || lower.includes('same day') || lower.includes('today')) {
    urgency = 'Urgent';
  }

  return {
    specialty: specialty || 'Internal Medicine',
    equipment: Array.from(equipmentSet).length > 0 ? Array.from(equipmentSet) : ['Diagnostic Imaging'],
    facility: Array.from(facilitySet).length > 0 ? Array.from(facilitySet) : ['Specialty Care Unit'],
    services: Array.from(servicesSet).length > 0 ? Array.from(servicesSet) : ['Emergency Assessment'],
    emergency,
    urgency,
    extractedFromText: text,
  };
}

import { hospitalDatabase, METRO_CARE_ORIGIN } from '../database/hospitalDatabase';

export function rankHospitalsForRequirements(
  requirements: ExtractedRequirements,
  _hospitals?: Hospital[]
): HospitalMatchResult[] {
  const result = hospitalDatabase.findAndRankHospitals(requirements, METRO_CARE_ORIGIN);
  return result.allMatches;
}

export function evaluateHospitalRequirements(
  requirements: ExtractedRequirements,
  origin = METRO_CARE_ORIGIN
) {
  return hospitalDatabase.findAndRankHospitals(requirements, origin);
}

