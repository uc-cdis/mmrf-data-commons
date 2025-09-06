import { Bucket, Buckets, GraphQLApiResponse } from '@/core/types';
import { guppyApi } from '@gen3/core';

interface SubrowResponse {
  cases: {
    denominators: {
      project: { project_id: { histogram: Bucket[] } };
    };
  };
  ssms: {
    numerators: {
      case : { project: { project_id: { histogram: Bucket[] } } };
    };
  };
}

export interface TableSubrowItem {
  project: string;
  numerator: number;
  denominator: number;
}

export type TableSubrowData = Partial<TableSubrowItem>;

export const tableSubrowApiSlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    getGeneTableSubrow: builder.query({
      query: (request: { id: string }) => ({
        query: `
                    query SomaticMutationTableSubrow($filters_case: JSON, $filters_mutation: JSON) {
                          denominators: Case__aggregation {
                              case(filter: $filters_case) {
                                  project {
                                      project_id {
                                          histogram {
                                              key
                                              count
                                          }
                                      }
                                  }
                              }
                          }
                          numerators: Case__aggregation {
                              case(filter: $filters_mutation) {
                                  project {
                                      project_id {
                                          histogram {
                                              count
                                              key
                                          }
                                      }
                                  }
                              }
                          }
}
                    `,
        variables: {
          filters_case: {
            content: [
              {
                content: {
                  field: 'cases.available_variation_data',
                  value: ['ssm'],
                },
                op: 'in',
              },
            ],
            op: 'and',
          },
          filters_gene: {
            op: 'and',
            content: [
              {
                content: {
                  field: 'genes.gene_id',
                  value: [request.id],
                },
                op: 'in',
              },
              {
                op: 'NOT',
                content: {
                  field: 'cases.gene.ssm.observation.observation_id',
                  value: 'MISSING',
                },
              },
            ],
          },
        },
      }),
      transformResponse: (
        response: GraphQLApiResponse<SubrowResponse>,
      ): TableSubrowData[] => {
        const { cases, ssms } = response?.data ?? {};
        const dBuckets = cases?.denominators?.project?.project_id?.histogram ?? [];
        const nBuckets = ssms?.numerators?.case?.project?.project_id?.histogram ?? [];

        const transformedBuckets = nBuckets.map(({ count, key }) => {
          return {
            project: key,
            numerator: count,
            denominator: dBuckets.find((d) => d.key === key)?.count,
          };
        });
        return transformedBuckets as TableSubrowData[];
      },
    }),
    getSomaticMutationTableSubrow: builder.query({
      query: (request: { id: string }) => ({
        query: `query SomaticMutationTableSubrow($filters_case: JSON, $filters_mutation: JSON) {
                  cases: CaseCentric__aggregation {
                      denominators: case_centric(filter: $filters_case) {
                          project {
                              project_id {
                                  histogram {
                                      key
                                      count
                                  }
                              }
                          }
                      }
                  }
                  ssms: SsmOccurrence__aggregation {
                      numerators: ssm_occurrence(filter: $filters_mutation) {
                          case {
                              project {
                                  project_id {
                                      histogram {
                                          key
                                          count
                                      }
                                  }
                              }
                          }
                      }
                  }
              }`,
        variables: {
          filters_case: {
            and: [
              {
                in: {
                  available_variation_data: ['ssm'],
                },
              },
            ],
          },
          filters_mutation: {
            and: [
              {
                nested: {
                  path: 'ssm',
                  in: {
                    ssm_id: [request.id],
                  },
                },
              },
            ],
          },
        },
      }),
      transformResponse: (
        response: GraphQLApiResponse<SubrowResponse>,
      ): TableSubrowData[] => {
        const { cases, ssms } = response?.data ?? {};
        const dBuckets = cases?.denominators?.project?.project_id?.histogram ?? [];
        const nBuckets = ssms?.numerators?.case?.project?.project_id?.histogram ?? [];
        const transformedBuckets = nBuckets.map(({ count, key }) => {
          return {
            project: key,
            numerator: count,
            denominator: dBuckets.find((d) => d.key === key)?.count,
          };
        });
        return transformedBuckets as TableSubrowData[];
      },
    }),
  }),
});

export const {
  useGetGeneTableSubrowQuery,
  useGetSomaticMutationTableSubrowQuery,
} = tableSubrowApiSlice;
