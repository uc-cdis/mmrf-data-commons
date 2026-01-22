import { groupBy } from "lodash";
import { UserProfile } from "@gen3/core";
import { CartItem } from "@gen3/core";
import { userCanDownloadFile } from "src/utils/userProjectUtils";

export const groupByAccess = (
  cart: CartItem[],
  user: UserProfile,
): Record<string, CartItem[]> => {
  const mappedData = cart.map((file) => ({
    ...file,
    canAccess: userCanDownloadFile({ user, file }),
  }));

  return groupBy(mappedData, "canAccess");
};

// 5GB
const MAX_CART_SIZE = 5 * 10e8;
export const cartAboveLimit = (
  filesByCanAccess: Record<string, CartItem[]>,
) => {
  return (
    filesByCanAccess.true
      ?.map((file) => file.file_size)
      .reduce((a, b) => a + b) > MAX_CART_SIZE
  );
};

export const BIOSPECIMEN_FIELDS = [
  "cases.case_id",
  "cases.project.project_id",
  "submitter_id",
  "cases.samples.tumor_descriptor",
  "cases.samples.specimen_type",
  "cases.samples.days_to_sample_procurement",
  "cases.samples.updated_datetime",
  "cases.samples.sample_id",
  "cases.samples.submitter_id",
  "cases.samples.state",
  "cases.samples.preservation_method",
  "cases.samples.sample_type",
  "cases.samples.tissue_type",
  "cases.samples.created_datetime",
  "cases.samples.portions.portion_id",
  "cases.samples.portions.analytes.analyte_id",
  "cases.samples.portions.analytes.aliquots.aliquot_id",
  "cases.samples.portions.analytes.aliquots.updated_datetime",
  "cases.samples.portions.analytes.aliquots.submitter_id",
  "cases.samples.portions.analytes.aliquots.state",
  "cases.samples.portions.analytes.aliquots.created_datetime",
];

export const CLINICAL_FIELDS = [
  "cases.primary_site",
  "cases.disease_type",
  "updated_datetime",
  "cases.case_id",
  "cases.follow_ups.follow_up_id",
  "cases.follow_ups.updated_datetime",
  "cases.follow_ups.submitter_id",
  "cases.follow_ups.days_to_follow_up",
  "cases.follow_ups.state",
  "cases.follow_ups.created_datetime",
  "cases.project.project_id",
  "submitter_id",
  "cases.index_date",
  "state",
  "cases.diagnoses.iss_stage",
  "cases.diagnoses.morphology",
  "cases.diagnoses.submitter_id",
  "cases.diagnoses.created_datetime",
  "cases.diagnoses.treatments.days_to_treatment_end",
  "cases.diagnoses.treatments.days_to_treatment_start",
  "cases.diagnoses.treatments.updated_datetime",
  "cases.diagnoses.treatments.regimen_or_line_of_therapy",
  "cases.diagnoses.treatments.submitter_id",
  "cases.diagnoses.treatments.treatment_id",
  "cases.diagnoses.treatments.treatment_type",
  "cases.diagnoses.treatments.state",
  "cases.diagnoses.treatments.treatment_or_therapy",
  "cases.diagnoses.treatments.created_datetime",
  "cases.diagnoses.last_known_disease_status",
  "cases.diagnoses.tissue_or_organ_of_origin",
  "cases.diagnoses.days_to_last_follow_up",
  "cases.diagnoses.age_at_diagnosis",
  "cases.diagnoses.primary_diagnosis",
  "cases.diagnoses.updated_datetime",
  "cases.diagnoses.diagnosis_id",
  "cases.diagnoses.site_of_resection_or_biopsy",
  "cases.diagnoses.state",
  "cases.diagnoses.days_to_last_known_disease_status",
  "cases.diagnoses.tumor_grade",
  "cases.diagnoses.progression_or_recurrence",
  "created_datetime",
  "cases.demographic.demographic_id",
  "cases.demographic.ethnicity",
  "cases.demographic.gender",
  "cases.demographic.race",
  "cases.demographic.vital_status",
  "cases.demographic.updated_datetime",
  "cases.demographic.age_at_index",
  "cases.demographic.submitter_id",
  "cases.demographic.days_to_birth",
  "cases.demographic.state",
  "cases.demographic.created_datetime",
];
