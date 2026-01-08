export interface Aliquot {
  aliquot_id: string;
  submitter_id: string;
  state: string;
  [key: string]: any;
}

export interface Analyte {
  analyte_id: string;
  submitter_id?: string;
  aliquots: Aliquot[];
}

export interface Portion {
  portion_id: string;
  submitter_id?: string;
  analytes: Analyte[];
}

export interface Sample {
  sample_id: string;
  submitter_id: string;
  specimen_type: string;
  tissue_type: string;
  state: string;
  tumor_descriptor: string | null;
  preservation_method: string | null;
  days_to_sample_procurement: number | null;
  portions: Portion[];
}

export interface Case {
  case_id: string;
  submitter_id: string;
  project: {
    project_id: string;
  };
  samples: Sample[];
}

export interface BiospecimenApiResponse {
  data: {
    hits: Case[];
  };
}
