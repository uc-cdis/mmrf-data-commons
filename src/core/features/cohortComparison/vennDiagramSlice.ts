import { graphQLAPI, type GQLFilter } from '@gen3/core';
import { GEN3_COHORT_COMPARISON_API } from '@/core/features/cohortComparison/constants';
import { GraphQLApiResponse } from '@/core';

const graphQLQuery = `
  query VennDiagram(
    $set1Filters: FiltersArgument
    $set2Filters: FiltersArgument
    $intersectionFilters: FiltersArgument
  ) {
    viewer {
      explore {
        set1: cases {
          hits(filters: $set1Filters, first: 0) {
            total
          }
        }
        set2: cases {
          hits(filters: $set2Filters,  first: 0) {
            total
          }
        }
        intersection: cases {
          hits(filters: $intersectionFilters,  first: 0) {
            total
          }
        }
      }
    }
  }
`;

interface CountData {
  readonly hits?: {
    readonly total: number;
  };
}

interface CohortVennDiagramData {
  readonly set1: CountData;
  readonly set2: CountData;
  readonly intersection: CountData;
}

interface VennDiagramRequest {
  set1Filters: GQLFilter;
  set2Filters: GQLFilter;
  intersectionFilters: GQLFilter;
}

const vennDiagramApiSlice = graphQLAPI.injectEndpoints({
  endpoints: (builder) => ({
    vennDiagram: builder.query<CohortVennDiagramData, VennDiagramRequest>({
      query: ({ set1Filters, set2Filters, intersectionFilters }) => {
        const graphQLFilters = {
          set1Filters,
          set2Filters,
          intersectionFilters,
        };
        return {
          url: `${GEN3_COHORT_COMPARISON_API}/venn`,
          method: 'POST',
          body: {
            query: graphQLQuery,
            variables: graphQLFilters,
          }
        };
      },
      transformResponse: (response: GraphQLApiResponse) => response?.data?.viewer?.explore,
    }),
  }),
});

export const { useVennDiagramQuery } = vennDiagramApiSlice;
