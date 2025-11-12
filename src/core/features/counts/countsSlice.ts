import {
  guppyApi,
  FilterSet,
  EmptyFilterSet,
  convertFilterSetToGqlFilter,
} from '@gen3/core';

const GraphQL = `query totalsQuery($filter: JSON) {
    CaseCentric__aggregation {
    case_centric (filter: $filter){
        caseCount: case_id {
           total:  _totalCount
        }
       available_variation_data{
            histogram {
                key
                count
            }
        }
        gene {
            gene_id {
                total: _cardinalityCount
            }
         ssm{
                ssm_id {
                   total: _cardinalityCount
                }
            }
        }
    }
    }
}`;

interface TotalsRequest {
  cohortFilters?: FilterSet;
}

interface TotalsResponce {
  data: {
    CaseCentric__aggregation: {
      case_centric: {
        caseCount: {
          total: number;
        };
        available_variation_data: {
          histogram: {
            key: string;
            count: number;
          }[];
        };
        gene: { geneId: {
          total: number;
        }
        ssm: {
          ssm_id: {
          total: number;
        }}};
      };
    };
  };
}

interface TotalsResponse {
  caseCount: number;
  ssmCaseCount: number;
  geneCount: number;
  ssmCount: number;
}

const countsSlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    getTotalCounts: builder.query<TotalsResponse, TotalsRequest>({
      query: ({ cohortFilters = EmptyFilterSet }: TotalsRequest) => {
        const filter = convertFilterSetToGqlFilter(cohortFilters);
        return {
          query: GraphQL,
          variables: {
            filter,
          },
        };
      },
      transformResponse: (response: TotalsResponce) => {
        const caseCount =
          response?.data?.CaseCentric__aggregation?.case_centric?.caseCount
            ?.total ?? 0;
        const ssmCaseCount =
          response?.data?.CaseCentric__aggregation?.case_centric?.available_variation_data?.histogram?.[0].count ?? 0
        const geneCount =
          response?.data?.CaseCentric__aggregation?.case_centric?.gene?.geneId
            ?.total ?? 0;
        const ssmCount =
          response?.data?.CaseCentric__aggregation?.case_centric?.gene?.ssm?.ssm_id
            ?.total ?? 0;
        return {
          caseCount,
          ssmCaseCount,
          geneCount,
          ssmCount,
        };
      },
    }),
  }),
});

export const { useGetTotalCountsQuery } = countsSlice;
