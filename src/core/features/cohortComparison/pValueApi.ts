import { graphQLAPI } from "@gen3/core";
import { GEN3_COHORT_COMPARISON_API } from '@/core/features/cohortComparison/constants';

const graphQLQuery = `
    query pValue($data: [[Int]]!) {
      analysis {
        pvalue(data: $data)
      }
    }
  `;

interface PValueResponse {
  data?: {
    analysis: {
      pvalue: number;
    }
  }
}

const pValueSlice = graphQLAPI.injectEndpoints({
  endpoints: (builder) => ({
    pValue: builder.query<number | undefined, number[][]>({
      query: (data) => ({
        url: `${GEN3_COHORT_COMPARISON_API}/pvalue`,
        method: 'POST',
          body: {
              query: graphQLQuery,
              variables: data
          }
      }),
      transformResponse: (response : PValueResponse) => response?.data?.analysis.pvalue,
    }),
  }),
});

export const { usePValueQuery } = pValueSlice;
