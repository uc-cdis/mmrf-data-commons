import { FilterSet, GQLFilter } from "@gen3/core";

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

export const COHORT_A_COLOR = "#8d3859";
export const COHORT_B_COLOR = "#FCA88D";



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
  "demographic.vital_status": "Patient Status",
  "diagnoses.age_at_diagnosis": "Age at Diagnosis",
};
