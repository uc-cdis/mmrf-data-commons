import {
  convertFilterSetToGqlFilter,
  EmptyFilterSet,
  FilterSet,
  guppyApi,
} from '@gen3/core';

import { MAX_CASES} from '@/core';


const graphQLQuery = `query Case_case($filter: JSON) {
    hits : Case_case (filter: $filter, first: 1) {
        case_id
        submitter_id
        disease_type
        primary_site
        family_histories {
            family_history_id
            relationship_age_at_diagnosis
            relationship_gender
            relationship_primary_diagnosis
            relationship_type
            relative_with_cancer_history
            submitter_id
        }
        follow_ups {
            follow_up_id
            submitter_id
            days_to_follow_up
            progression_or_recurrence
            progression_or_recurrence_type
            disease_response
            ecog_performance_status
            karnofsky_performance_status
            progression_or_recurrence_anatomic_site
            molecular_tests {
                aa_change
                antigen
                biospecimen_type
                gene_symbol
                molecular_test_id
                submitter_id
                laboratory_test
                mismatch_repair_mutation
                molecular_analysis_method
                second_gene_symbol
                test_result
                test_units
                test_value
                variant_type
            }
            other_clinical_attributes {
                submitter_id
                other_clinical_attribute_id
                timepoint_category
                nononcologic_therapeutic_agents
                treatment_frequency
                weight
                bmi
            }
        }
        files {
            acl
            access
            file_name
            file_size
            file_id
            data_type
            data_format
            state
            created_datetime
            updated_datetime
            submitter_id
            type
            data_category
            md5sum
        }
        project {
            name
            project_id
            program {
                name
            }
        }
        summary {
            file_count
            data_categories {
                file_count
                data_category
            }
            experimental_strategies {
                experimental_strategy
                file_count
            }
        }
        demographic {
            age_at_index
            gender
            race
            ethnicity
            demographic_id
            submitter_id
            days_to_birth
            days_to_death
            vital_status
        }
        diagnoses {
            age_at_diagnosis
            classification_of_tumor
            days_to_last_follow_up
            days_to_last_known_disease_status
            days_to_recurrence
            last_known_disease_status
            morphology
            primary_diagnosis
            synchronous_malignancy
            progression_or_recurrence
            tissue_or_organ_of_origin
            tumor_grade
            treatments {
                days_to_treatment_start
                submitter_id
                therapeutic_agents
                treatment_id
                treatment_intent_type
                treatment_or_therapy
            }
        }
        exposures {
            alcohol_history
            alcohol_intensity
            exposure_id
            tobacco_smoking_status
            submitter_id
            years_smoked
        }
    }
}`;

const CaseValidateQuery = `query Case_case ($filter: JSON) {
    Case_case(filter: $filter, first: 10000) {
        case_id
    }
}`;

const FileValidateQuery = `query File_file ($filter: JSON) {
    File_file(filter: $filter, first: 10000) {
        file_id
    }
}`;

export const EntityFields: Record<ValidateTypes, string> = {
  file: "file_id",
  case: "case_id",
};

const EntityQueryHeaders: Record<ValidateTypes, string> = {
  file: "File_file",
  case: "Case_case",
};

interface ValidationResult {
  matched: number;
  unmatched: number;
}

interface CaseSummaryRequest {
  caseId?: string;
}

interface CaseValidatationRequest {
  caseIds: Array<string>;
}

export type ValidateTypes = "file" | "case";

const ValidationQueries: Record<ValidateTypes, string> = {
  file: FileValidateQuery,
  case: CaseValidateQuery,
};

interface ValidateEntitiesRequest {
  ids: ReadonlyArray<string>;
  entityType: ValidateTypes;
}

interface CohortCaseIdsRequest {
  filter: FilterSet;
}

const caseSlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    caseSummary: builder.query<any, CaseSummaryRequest>({
      query: ({ caseId }: CaseSummaryRequest) => ({
        query: graphQLQuery,
        variables: {
          filter: { eq: { case_id: caseId } },
        },
      }),
    }),
    validateCases: builder.query<ValidationResult, CaseValidatationRequest>({
      query: ({ caseIds }: CaseValidatationRequest) => ({
        query: CaseValidateQuery,
        variables: {
          filter: { in: { case_id: caseIds } },
        },
      }),
      transformResponse: (response: any, meta, args) => {
        const cases = (response?.data?.Case_case as string[]) ?? [];
        return {
          matched: cases.length,
          unmatched: args.caseIds.length - cases.length,
        };
      },
    }),
    fetchEntities: builder.query<
      ReadonlyArray<string>,
      ValidateEntitiesRequest
    >({
      query: ({ ids, entityType }: ValidateEntitiesRequest) => ({
        query: ValidationQueries[entityType],
        variables: { filter: { in: { [EntityFields[entityType]]: ids } } },
      }),
      transformResponse: (
        results: {
          data: Record<string, Array<Record<string, string>>>;
        },
        _p,
        meta,
      ): ReadonlyArray<string> => {
        return results?.data?.[EntityQueryHeaders[meta.entityType]]?.map(
          (x) => x[EntityFields[meta.entityType]],
        );
      },
    }),
    cohortCaseId: builder.query<ReadonlyArray<string>, CohortCaseIdsRequest>({
      query: ({ filter }: CohortCaseIdsRequest) => {
        const gqlFilter = convertFilterSetToGqlFilter(filter ?? EmptyFilterSet);
        return {
          query: `query getCaseIdFromFilter($filter: JSON) {
            hits: CaseCentric_case_centric(filter: $filter, first: ${MAX_CASES}) {
                case_id
            }
        }`,
          variables: { filter: gqlFilter },
        };
      },
      transformResponse: (response: any) =>
        response?.data?.hits?.map((x: any) => x?.case_id) ?? [],
    }),
  }),
});

export const {
  useCaseSummaryQuery,
  useValidateCasesQuery,
  useLazyValidateCasesQuery,
  useFetchEntitiesQuery,
  useLazyFetchEntitiesQuery,
  useCohortCaseIdQuery,
  useLazyCohortCaseIdQuery,
} = caseSlice;
