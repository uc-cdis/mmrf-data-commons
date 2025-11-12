import {
  FilterSet,
  GQLIntersection as GqlIntersection,
  Includes,
  EmptyFilterSet,
  guppyApi,
  convertFilterToGqlFilter,
  convertFilterSetToGqlFilter,
} from '@gen3/core';
import { GraphQLApiResponse } from '@/core/types';
import { convertFilterSetToNestedGqlFilter } from '@/core/utils';
import { ProjectData } from './types';

interface CancerDistributionChartResponse {
  cases: {
    amplification: {
      project: ProjectData;
    };
    gain: {
      project: ProjectData;
    };
    loss: {
      project: ProjectData;
    };
    homozygousDeletion: {
      project: ProjectData;
    };
    cnvTotal: {
      project: ProjectData;
    };
    cnvCases: {
      _totalCount: number;
    };
  };
}

const graphQLQuery = `query CancerDistributionCNV(
    $cnvAmplificationFilter: JSON
    $cnvGainFilter: JSON
    $cnvLossFilter: JSON
    $cnvHomozygousDeletionFilter: JSON
    $cnvTotalFilter: JSON
    $cnvCasesFilter: JSON
) {
   cases: CaseCentric__aggregation {
        amplification: case_centric(filter: $cnvAmplificationFilter) {
            project {
                project_id {
                    histogram {
                        key
                        count
                    }
                }
            }
        }
        gain: case_centric(filter: $cnvGainFilter) {
            project {
                project_id {
                    histogram {
                        key
                        count
                    }
                }
            }
        }
        loss: case_centric(filter: $cnvLossFilter) {
            project {
                project_id {
                    histogram {
                        key
                        count
                    }
                }
            }
        }
        homozygousDeletion: case_centric(filter: $cnvHomozygousDeletionFilter) {
            project {
                project_id {
                    histogram {
                        key
                        count
                    }
                }
            }
        }
        cnvTotal: case_centric(filter: $cnvTotalFilter) {
            project {
                project_id {
                    histogram {
                        key
                        count
                    }
                }
            }
        }
        cnvCases: case_centric(filter: $cnvCasesFilter) {
            _totalCount
        }
    }
}
`;

interface CNVPlotRequest {
  gene: string;
  cohortFilters?: FilterSet;
  genomicFilters?: FilterSet;
}

interface GroupedCnvData {
  [projectId: string]: {
    total: number;
    amplification: number;
    gain: number;
    loss: number;
    homozygousDeletion: number;
  };
}

interface CNVData {
  readonly cnvs: GroupedCnvData;
  readonly caseTotal: number;
}

const cnvPlotSlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    cnvPlot: builder.query<CNVData, CNVPlotRequest>({
      query: ({ gene, cohortFilters, genomicFilters }) => {
        const contextGene =
          ((genomicFilters?.root['gene.gene_id'] as Includes)
            ?.operands as string[]) ?? [];
        const contextWithGene: FilterSet = {
          mode: 'and',
          root: {
            ...genomicFilters?.root,
            ['gene.gene_id']: {
              operator: 'includes',
              field: 'gene.gene_id',
              operands: [gene, ...contextGene],
            } as Includes,
          },
        };

        const caseFilters = convertFilterSetToGqlFilter(
          cohortFilters ?? EmptyFilterSet,
        );
        const gqlContextFilter = convertFilterSetToGqlFilter(
          contextWithGene ?? EmptyFilterSet,
        );
        const gqlContextIntersection =
          gqlContextFilter && (gqlContextFilter as GqlIntersection)?.and
            ? (gqlContextFilter as GqlIntersection).and
            : [];

        const graphQLFilters = {
          cnvAmplificationFilter: {
            and: [
              {
                in: {
                  'gene.cnv.cnv_change_5_category': ['Amplification'],
                },
              },
              ...gqlContextIntersection,
            ],
          },
          cnvGainFilter: {
            and: [
              {
                in: {
                  'gene.cnv.cnv_change_5_category': ['Gain'],
                },
              },
              ...gqlContextIntersection,
            ],
          },
          cnvLossFilter: {
            and: [
              {
                in: {
                  'gene.cnv.cnv_change_5_category': ['Loss'],
                },
              },
              ...gqlContextIntersection,
            ],
          },
          cnvHomozygousDeletionFilter: {
            and: [
              {
                in: {
                  'gene.cnv.cnv_change_5_category': ['Homozygous Deletion'],
                },
              },
              ...gqlContextIntersection,
            ],
          },
          cnvTotalFilter: {
            and: [
              {
                in: {
                  available_variation_data: ['cnv'],
                },
              },
            ],
          },
          cnvCasesFilter: {
            and: [
              {
                in: {
                  'gene.cnv.cnv_change_5_category': [
                    'Amplification',
                    'Gain',
                    'Loss',
                    'Homozygous Deletion',
                  ],
                },
              },
              ...gqlContextIntersection,
            ],
          },
          caseFilters,
        };
        return {
          query: graphQLQuery,
          variables: graphQLFilters,
        };
      },
      transformResponse: (
        response: GraphQLApiResponse<CancerDistributionChartResponse>,
      ): CNVData => {
        const amplification = Object.fromEntries(
          response?.data?.cases?.amplification?.project.project_id?.histogram?.map(
            (b) => [b.key, b.count],
          ),
        );
        const gain = Object.fromEntries(
          response?.data?.cases?.gain?.project.project_id?.histogram?.map(
            (b) => [b.key, b.count],
          ),
        );
        const loss = Object.fromEntries(
          response?.data?.cases?.loss?.project.project_id?.histogram?.map(
            (b) => [b.key, b.count],
          ),
        );
        const homozygousDeletion = Object.fromEntries(
          response?.data?.cases?.homozygousDeletion?.project.project_id?.histogram?.map(
            (b) => [b.key, b.count],
          ),
        );
        const total = Object.fromEntries(
          response?.data?.cases?.cnvTotal?.project.project_id?.histogram?.map(
            (b) => [b.key, b.count],
          ),
        );

        const cnvsByProject: GroupedCnvData = Object.keys(
          total,
        ).reduce<GroupedCnvData>((acc, projectId) => {
          const amplificationCount = amplification[projectId] || 0;
          const gainCount = gain[projectId] || 0;
          const lossCount = loss[projectId] || 0;
          const homozygousDeletionCount = homozygousDeletion[projectId] || 0;

          // Only add project if at least one CNV count is non-zero
          if (
            amplificationCount ||
            gainCount ||
            lossCount ||
            homozygousDeletionCount
          ) {
            acc[projectId] = {
              total: total[projectId] || 0,
              amplification: amplificationCount,
              gain: gainCount,
              loss: lossCount,
              homozygousDeletion: homozygousDeletionCount,
            };
          }

          return acc;
        }, {});

        return {
          cnvs: cnvsByProject,
          caseTotal: response?.data?.cases.cnvCases?._totalCount,
        };
      },
    }),
  }),
});

export const { useCnvPlotQuery } = cnvPlotSlice;
