import { graphQLAPI, type GQLFilter } from '@gen3/core';
import { GEN3_ANALYSIS_API } from '@/core/constants';
import { GraphQLApiResponse } from '@/core';



interface CohortVennDiagramData {
  readonly set1?: number;
  readonly set2?: number;
  readonly intersection?: number;
}

interface VennDiagramRequest {
  set1Filters: GQLFilter;
  set2Filters: GQLFilter;
  index: string;
}

interface VennDiagramResponse {
  cohort1?: number;
  cohort2?: number;
  intersection?: number;
}

const vennDiagramApiSlice = graphQLAPI.injectEndpoints({
  endpoints: (builder) => ({
    vennDiagram: builder.query<CohortVennDiagramData, VennDiagramRequest>({
      query: (queryParameters) => {
        return {
          url: `${GEN3_ANALYSIS_API}/compare/intersection`,
          method: 'POST',
          body: JSON.stringify({
            cohort1: queryParameters.set1Filters,
            cohort2: queryParameters.set2Filters,
            doc_type: queryParameters.index,
          }),
        };
      },
      transformResponse: (response: VennDiagramResponse) => ({
          set1:  response?.cohort1,
          set2:  response?.cohort2,
          intersection: response?.intersection
        })
    }),
  }),
});

export const { useVennDiagramQuery } = vennDiagramApiSlice;
