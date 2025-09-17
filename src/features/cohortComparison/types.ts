import { FilterSet, GQLFilter } from "@gen3/core";
import tailwindConfig from "tailwind.config";

export interface GqlIntersection {
  and: ReadonlyArray<GQLFilter>
}


export interface CohortComparisonType {
  primary_cohort: {
    filter: FilterSet;
    name: string;
    id: string;
  };
  comparison_cohort: {
    filter: FilterSet;
    name: string;
    id: string;
  };
}

export const COHORT_A_COLOR = tailwindConfig.theme.extend.colors.mmrf.plum;
export const COHORT_B_COLOR = tailwindConfig.theme.extend.colors.mmrf.rust;



export const CohortComparisonFields : { [key: string]: string } = {
  survival: "Survival",
  ethnicity: "demographic.ethnicity",
  gender: "demographic.gender",
  race: "demographic.race",
  vital_status: "demographic.vital_status",
  age_at_diagnosis: "diagnoses.age_at_diagnosis",
};

export const FIELD_LABELS  : { [key: string]: string } = {
  "demographic.gender": "Gender",
  "demographic.ethnicity": "Ethnicity",
  "demographic.race": "Race",
  "demographic.vital_status": "Vital Status",
  "diagnoses.age_at_diagnosis": "Age at Diagnosis",
};
