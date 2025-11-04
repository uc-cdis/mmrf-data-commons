interface Demographic {
  readonly demographic_id: string | null;
  readonly ethnicity: string | null;
  readonly gender: string | null;
  readonly race: string | null;
  readonly submitter_id: string | null;
  readonly vital_status: string | null;
  readonly days_to_birth: number | null;
  readonly days_to_death: number | null;
}
interface Diagnoses {
  readonly age_at_diagnosis: number | null;
  readonly classification_of_tumor: string | null;
  readonly days_to_last_follow_up: number | null;
  readonly days_to_last_known_disease_status: number | null;
  readonly days_to_recurrence: number | null;
  readonly diagnosis_id: string | null;
  readonly last_known_disease_status: string | null;
  readonly morphology: string | null;
  readonly primary_diagnosis: string | null;
  readonly prior_malignancy: string | null;
  readonly progression_or_recurrence: string | null;
  readonly site_of_resection_or_biopsy: string | null;
  readonly submitter_id: string | null;
  readonly synchronous_malignancy: string | null;
  readonly tissue_or_organ_of_origin: string | null;
  readonly treatments?: ReadonlyArray<{
    readonly days_to_treatment_start?: number | null;
    readonly submitter_id: string | null;
    readonly therapeutic_agents?: string | null;
    readonly treatment_id: string | null;
    readonly treatment_intent_type?: string | null;
    readonly treatment_or_therapy?: string | null;
  }>;
  readonly tumor_grade: string | null;
}
interface Exposures {
  readonly alcohol_history: string | null;
  readonly alcohol_intensity: string | null;
  readonly exposure_id: string | null;
  readonly tobacco_smoking_status: string | null;
  readonly submitter_id: string | null;
  readonly pack_years_smoked: number | null;
}
interface FamilyHistories {
  readonly family_history_id: string | null;
  readonly relationship_age_at_diagnosis: number | null;
  readonly relationship_gender: string | null;
  readonly relationship_primary_diagnosis: string | null;
  readonly relationship_type: string | null;
  readonly relative_with_cancer_history: string | null;
  readonly submitter_id: string | null;
}
interface FollowUps {
  readonly days_to_follow_up: number | null;
  readonly disease_response: string | null;
  readonly ecog_performance_status: string | null;
  readonly follow_up_id: string | null;
  readonly karnofsky_performance_status: number | null;
  readonly molecular_tests?: ReadonlyArray<{
    readonly aa_change: string | null;
    readonly antigen: string | null;
    readonly biospecimen_type: string | null;
    readonly chromosome: string | null;
    readonly gene_symbol: string | null;
    readonly laboratory_test: string | null;
    readonly mismatch_repair_mutation: string | null;
    readonly molecular_analysis_method: string | null;
    readonly molecular_test_id: string | null;
    readonly second_gene_symbol: string | null;
    readonly submitter_id: string | null;
    readonly test_result: string | null;
    readonly test_units: string | null;
    readonly test_value: number | null;
    readonly variant_type: string | null;
  }>;
  readonly other_clinical_attributes?: ReadonlyArray<{
    readonly submitter_id: string;
    readonly other_clinical_attribute_id: string;
    readonly timepoint_category?: string;
    readonly nononcologic_therapeutic_agents?: string;
    readonly treatment_frequency?: number;
    readonly weight?: number;
    readonly height?: number;
    readonly bmi?: number;
  }>;
  readonly progression_or_recurrence: number | null;
  readonly progression_or_recurrence_anatomic_site: number | null;
  readonly progression_or_recurrence_type: number | null;
  readonly submitter_id: string | null;
}

export type { Demographic, Diagnoses, Exposures, FamilyHistories, FollowUps };
