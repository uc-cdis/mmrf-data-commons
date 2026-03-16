import { FilterSet } from '@gen3/core';
import { DataDimension } from './types';

// TODO: This will need to change for whatver MMRF demo cohort is used
export const DEMO_COHORT_FILTERS: FilterSet = {
  mode: 'and',
  root: {
    'cases.project.project_id': {
      operator: 'includes',
      field: 'cases.project.project_id',
      operands: ['TCGA-LGG'],
    },
  },
};

// List of charts to be shown when page is first loaded
export const DEFAULT_FIELDS = [
  'demographic.gender',
  'demographic.race',
  'demographic.ethnicity',
];

// types that are continuous
export const CONTINUOUS_FACET_TYPES = [
  'year',
  'years',
  'age',
  'numeric',
  'integer',
  'percent',
  'long',
  'double',
];

// QQ PLot (not implmented to show)
export const HIDE_QQ_BOX_FIELDS = [
  'demographic.year_of_birth',
  'demographic.year_of_death',
  'diagnoses.year_of_diagnosis',
  'exposures.tobacco_smoking_onset_year',
  'exposures.tobacco_smoking_quit_year',
];

export const COLOR_MAP: Record<string, string> = {
  demographic: 'plum',
  diagnoses: 'apricot',
  bone_assessments: 'gunmetal',
  exposures: 'blush',
  other_clinical_attributes: 'purple',
};

// this is done so tailwind loads the classes properly
export const COLOR_CLASS_HOVER_MAP: Record<string, string> = {
  demographic: 'hover:brightness-50',
  diagnoses: 'hover:brightness-50',
  bone_assessments: 'hover:brightness-50',
  exposures: 'hover:brightness-50',
  other_clinical_attributes: 'brightness-50',
};

// Change to fix MMRF Facets
export const CAPITALIZED_TERMS = [
  'ajcc',
  'uicc',
  'cog',
  'figo',
  'inss',
  'iss',
  'icd',
  'igcccg',
  'bmi',
];

export const SPECIAL_CASE_FIELDS: Record<string, string> = {
  icd_10_code: 'ICD-10 Code',
  days_to_death: 'Time to Death',
  // TODO - remove special case when field is updated
  gender: 'Sex',
};

// Order to display facets, Also where you define the contents of the facet tabs
export const FACET_SORT: Record<string, Array<string>> = {
  demographic: [
    'gender',
    'race',
    'ethnicity',
    'vital_status',
    'age_at_index',
    'age_at_diagnosis',
    'year_of_death',
    'days_to_death',
  ],
  diagnoses: [
    'days_to_diagnosis',
    'days_to_last_follow_up',
    'iss_stage',
  ],
  bone_assessments: [
    'lytic_bone_lesion_present',
    'mm_bone_lesion_femur',
    'mm_bone_lesion_pelvis',
    'mm_bone_lesion_ribs',
    'mm_bone_lesion_skull',
    'mm_bone_lesion_spine',
    'number_of_lytic_lesions',
    'osteopenia_osteoporosis',
  ],
};

// Set the Toggle between Units and defines the Data Dimension and its (optional) toggle value
export const DATA_DIMENSIONS: Record<
  string,
  { unit: DataDimension; toggleValue?: DataDimension }
> = {
  'diagnoses.age_at_diagnosis': {
    unit: 'Days',
    toggleValue: 'Years',
  },
  'demographic.days_to_birth': { unit: 'Days', toggleValue: 'Years' },
  'demographic.days_to_death': { unit: 'Days', toggleValue: 'Years' },
  'diagnoses.days_to_diagnosis': { unit: 'Days', toggleValue: 'Years' },
  'diagnoses.days_to_last_follow_up': { unit: 'Days', toggleValue: 'Years' },
  'diagnoses.days_to_last_known_disease_status': {
    unit: 'Days',
    toggleValue: 'Years',
  },
  'diagnoses.days_to_recurrence': { unit: 'Days', toggleValue: 'Years' },
  'diagnoses.treatments.days_to_treatment_end': {
    unit: 'Days',
    toggleValue: 'Years',
  },
  'diagnoses.treatments.days_to_treatment_start': {
    unit: 'Days',
    toggleValue: 'Years',
  },
  'diagnoses.year_of_diagnosis': { unit: 'Years' },
  'follow_ups.other_clinical_attributes.weight': {
    unit: 'Kilograms',
  },
  'follow_ups.other_clinical_attributes.height': {
    unit: 'Centimeters',
  },
  'demographic.year_of_death': { unit: 'Year' },
};

export const TABS = {
  demographic: 'Demographic',
  diagnoses: 'Diagnosis',
  bone_assessments: 'Bone Assessment',
  exposures: 'Exposures',
  other_clinical_attributes: 'Other Clinical Attribute',
};

export const CONTINUOUS_FACET_RANGES: Record<
  string,
  { min: number; max: number; step: number }
> = {
  'demographic.age_at_index': {
    min: 0,
    max: 89,
    step: 10,
  },
  'demographic.days_to_death': {
    max: 32872,
    min: 0,
    step: 10,
  },
  'demographic.year_of_death': {
    max: 2050,
    min: 1990,
    step: 10,
  },
  'diagnoses.days_to_diagnosis': {
    max: 32872,
    min: 0,
    step: 3652.5,
  },
  'diagnoses.days_to_last_follow_up': {
    max: 32872,
    min: 0,
    step: 3652.5,
  },
};

export const SURVIVAL_PLOT_MIN_COUNT = 10;
export const BUCKETS_MAX_COUNT = 500;
export const MISSING_KEY = '_missing';
