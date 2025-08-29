import {
  convertFilterSetToGqlFilter as buildCohortGqlOperator,
  FilterSet,
  guppyApi,
  GQLIntersection as GqlIntersection,
  EmptyFilterSet,
} from '@gen3/core';
import { Bucket } from '@/core/types';

const graphQLQuery = `query CancerDistribution(
    $caseAggsFilters: JSON
    $ssmTested: JSON
    $ssmFilters: JSON
) {
    ssms: SsmOccurrence__aggregation {
        ssm_occurrence(filter: $ssmFilters) {
            _totalCount
        }
    }
    cases: CaseCentric__aggregation {
        ssmFiltered: case_centric(filter: $caseAggsFilters) {
            project {
                project_id {
                    histogram {
                        key
                        count
                    }
                }
            }
        }
        total: case_centric(filter: $ssmTested) {
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
}`;

interface SsmPlotPoint {
  readonly project: string;
  readonly ssmCount: number;
  readonly totalCount: number;
}

export interface SsmPlotData {
  readonly cases: SsmPlotPoint[];
  readonly ssmCount: number;
}

interface SsmPlotRequest {
  gene: string;
  ssms: string;
  cohortFilters?: FilterSet;
  genomicFilters?: FilterSet;
}

const ssmPlotSlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    ssmPlot: builder.query<SsmPlotData, SsmPlotRequest>({
      query: ({ gene, ssms, cohortFilters, genomicFilters }) => {
        const gqlGenomicFilters = buildCohortGqlOperator(
          genomicFilters ?? EmptyFilterSet,
        );
        const gqlContextIntersection =
          gqlGenomicFilters &&
          (gqlGenomicFilters as GqlIntersection).and.length > 0
            ? (gqlGenomicFilters as GqlIntersection).and
            : [];
        const graphQLFilters = gene
          ? {
              caseFilters: buildCohortGqlOperator(
                cohortFilters ?? EmptyFilterSet,
              ),
              caseAggsFilters: {
                and: [
                  {
                    in: {
                      available_variation_data: ['ssm'],
                    },
                  },
                  {
                    nested: {
                      path: 'gene',
                      in: {
                        gene_id: [gene],
                      },
                    },
                  },
                  ...gqlContextIntersection,
                ],
              },
              ssmFilters: {
                and: [
                  {
                    nested: {
                      path: 'case',
                      in: {
                        available_variation_data: ['ssm'],
                      },
                    },
                  },
                  {
                    nested: {
                      path: 'ssm',
                      nested: {
                        path: 'ssm.consequence',
                        nested: {
                          path: 'ssm.consequence.transcript',
                          nested: {
                            path: 'ssm.consequence.transcript.gene',
                            in: {
                              gene_id: [gene],
                            },
                          },
                        },
                      },
                    },
                  },
                  ...gqlContextIntersection,
                ],
              },
              ssmTested: {
                and: [
                  {
                    in: {
                      available_variation_data: ['ssm'],
                    },
                  },
                ],
              },
            }
          : {
              caseAggsFilters: {
                and: [
                  {
                    in: {
                      available_variation_data: ['ssm'],
                    },
                  },
                  {
                    nested: {
                      path: 'ssms',
                      in: {
                        ssm_id: [ssms],
                      },
                    },
                  },
                ],
              },
              ssmTested: {
                and: [
                  {
                    in: {
                      available_variation_data: ['ssm'],
                    },
                  },
                ],
              },
            };

        return {
          query: graphQLQuery,
          variables: graphQLFilters,
        };
      },
      transformResponse: (response) => {
        const ssm =
          response?.data?.cases?.ssmFiltered?.project?.project_id?.histogram?.map(
            (d: Bucket) => ({ ssmCount: d.count, project: d.key }),
          ) || [];
        const total =
          response?.data?.cases?.total?.project.project_id?.histogram?.map(
            (d: Bucket) => ({ totalCount: d.count, project: d.key }),
          );

        const merged = ssm.map((d: SsmPlotPoint) => ({
          ...d,
          ...total.find((t: SsmPlotPoint) => t.project === d.project),
        }));
        return {
          cases: merged,
          ssmCount: response?.data?.ssms?.ssm_occurrence?._totalCount,
        };
      },
    }),
  }),
});

export const { useSsmPlotQuery } = ssmPlotSlice;
