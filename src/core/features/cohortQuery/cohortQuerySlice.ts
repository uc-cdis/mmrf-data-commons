import { gen3Api } from '@gen3/core';
import {
  CohortCentricQueryRequest,
  GraphQLApiResponse,
} from '@/core';
import {
  GEN3_ANALYSIS_API,
  CASE_CENTRIC_INDEX,
  CASE_ID_FIELD,
  MAX_CASES
} from '@/core/constants';

export const cohortCentricQuerySlice = gen3Api.injectEndpoints({
  endpoints: (builder) => ({
    getCohortCentric: builder.query<
      GraphQLApiResponse,
      CohortCentricQueryRequest
    >({
      query: ({
        cohortFilter,
        query,
        filter,
        caseIndex = CASE_CENTRIC_INDEX,
        caseIdField = CASE_ID_FIELD,
        limit = MAX_CASES
      }: CohortCentricQueryRequest) => {

        return {
          url: `${GEN3_ANALYSIS_API}/cohorts/query`,
          method: 'POST',
          body: {
            filter: filter,
            query: query,
            cohort_filter: cohortFilter,
            case_index: caseIndex,
            cohort_item_field: caseIdField,
            limit
          },
        };
      },
    }),
  }),
});

export const { useGetCohortCentricQuery, useLazyGetCohortCentricQuery } =
  cohortCentricQuerySlice;
