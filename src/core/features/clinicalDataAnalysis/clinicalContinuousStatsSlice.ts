import { guppyApi, GQLFilter, GQLRange } from "@gen3/core";

export interface ClinicalContinuousStatsData {
  readonly min: number;
  readonly max: number;
  readonly mean: number;
  readonly std_dev: number;
  readonly iqr: number;
  readonly median: number;
  readonly q1: number;
  readonly q3: number;
}

interface ClinicalContinuousStatsInputs {
  field: string;
  queryFilters: GQLFilter;
  rangeFilters: GQLRange;
}

const continuousDataStatsApi = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    getContinuousDataStats: builder.query<
      ClinicalContinuousStatsData,
      ClinicalContinuousStatsInputs
    >({
      query: (args: ClinicalContinuousStatsInputs  ) => {
        const { field, queryFilters, rangeFilters } = args;
        const graphQLQuery = `query ContinuousAggregationQuery($queryFilters: FiltersArgument, $rangeFilters: FiltersArgument) {
        viewer {
          explore {
            cases {
              aggregations(filters: $queryFilters) {
                ${field} {
                  stats {
                    Min : min
                    Max: max
                    Mean: avg
                    SD: std_deviation
                  }
                  percentiles {
                    Median: median
                    IQR: iqr
                    q1: quartile_1
                    q3: quartile_3
                  }
                  range(ranges: $rangeFilters) {
                    buckets {
                      doc_count
                      key
                    }
                  }
                }
              }
            }
          }
        }
      }`;
        const variables = {
          queryFilters,
          rangeFilters,
        };
        return ({
          query: graphQLQuery,
          variables,
        });
      },
      transformResponse: (response: Record<string, any> , _, arg) => {
        return {
          min: response.data.viewer.explore.cases.aggregations[arg.field].stats
            .Min,
          max: response.data.viewer.explore.cases.aggregations[arg.field].stats
            .Max,
          mean: response.data.viewer.explore.cases.aggregations[arg.field].stats
            .Mean,
          std_dev:
            response.data.viewer.explore.cases.aggregations[arg.field].stats.SD,
          iqr: response.data.viewer.explore.cases.aggregations[arg.field]
            .percentiles.IQR,
          median:
            response.data.viewer.explore.cases.aggregations[arg.field]
              .percentiles.Median,
          q1: response.data.viewer.explore.cases.aggregations[arg.field]
            .percentiles.q1,
          q3: response.data.viewer.explore.cases.aggregations[arg.field]
            .percentiles.q3,
        };
      },
    }),
  }),
});

export const { useGetContinuousDataStatsQuery } = continuousDataStatsApi;
