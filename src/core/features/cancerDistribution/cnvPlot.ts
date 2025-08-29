import {
  convertFilterSetToGqlFilter as buildCohortGqlOperator,
  FilterSet,
  GQLIntersection as GqlIntersection,
  Includes,
  EmptyFilterSet,
  guppyApi,
} from '@gen3/core';
import { Buckets, Bucket, GraphQLApiResponse } from '@/core/types';

interface CancerDistributionChartResponse {
      cases: {
        amplification: {
          project__project_id: Buckets;
        };
        gain: {
          project__project_id: Buckets;
        };
        loss: {
          project__project_id: Buckets;
        };
        homozygousDeletion: {
          project__project_id: Buckets;
        };
        cnvTotal: {
          project__project_id: Buckets;
        };
        cnvCases: {
          total: number;
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
          ((genomicFilters?.root["genes.gene_id"] as Includes)
            ?.operands as string[]) ?? [];
        const contextWithGene : FilterSet = {
          mode: "and",
          root: {
            ...genomicFilters?.root,
            ["genes.gene_id"]: {
              operator: "includes",
              field: "genes.gene_id",
              operands: [gene, ...contextGene],
            } as Includes,
          },
        };

        const caseFilters = buildCohortGqlOperator(cohortFilters ?? EmptyFilterSet);
        const gqlContextFilter = buildCohortGqlOperator(contextWithGene ?? EmptyFilterSet);
        const gqlContextIntersection =
          gqlContextFilter && (gqlContextFilter as GqlIntersection)?.and
            ? (gqlContextFilter as GqlIntersection).and
            : [];

        const graphQLFilters = {
          cnvAmplificationFilter:
            {
              "and": [
                {
                  "nested": {
                    "path": "gene",
                    "nested": {
                      "path": "gene.cnvs",
                      "in": {
                        "cnv_change_5_category": [
                          "Amplification"
                        ]
                      }
                    }
                  }
                },  ...gqlContextIntersection,
              ]
            },
          cnvGainFilter: {
            "and": [
              {
                "nested": {
                  "path": "gene",
                  "nested": {
                    "path": "gene.cnvs",
                    "in": {
                      "cnv_change_5_category": [
                        "Gain"
                      ]
                    }
                  }
                }
              },  ...gqlContextIntersection,
            ]
          },
          cnvLossFilter: {
            "and": [
              {
                "nested": {
                  "path": "gene",
                  "nested": {
                    "path": "gene.cnvs",
                    "in": {
                      "cnv_change_5_category": [
                        "Loss"
                      ]
                    }
                  }
                }
              },  ...gqlContextIntersection,
            ]
          },
          cnvHomozygousDeletionFilter: {
              "and": [
                {
                  "nested": {
                    "path": "gene",
                    "nested": {
                      "path": "gene.cnvs",
                      "in": {
                        "cnv_change_5_category": ["Homozygous Deletion"]
                      }
                    }
                  }
                },  ...gqlContextIntersection,
              ]
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
            "and": [
              {
                "nested": {
                  "path": "gene",
                  "nested": {
                    "path": "gene.cnvs",
                    "in": {
                      "cnv_change_5_category": [
                        "Amplification",
                        "Gain",
                        "Loss",
                        "Homozygous Deletion"
                      ]
                    }
                  }
                }
              }, ...gqlContextIntersection,
            ]
          },
          caseFilters,
        };
        return {
          query:graphQLQuery,
          variables: graphQLFilters,
        };
      },
      transformResponse: (
        response: GraphQLApiResponse<CancerDistributionChartResponse>,
      ): CNVData => {
        const amplification = Object.fromEntries(
          response?.data?.cases?.amplification?.project__project_id?.buckets?.map(
            (b) => [b.key, b.count],
          ),
        );
        const gain = Object.fromEntries(
          response?.data?.cases?.gain?.project__project_id?.buckets?.map(
            (b) => [b.key, b.count],
          ),
        );
        const loss = Object.fromEntries(
          response?.data?.cases?.loss?.project__project_id?.buckets?.map(
            (b) => [b.key, b.count],
          ),
        );
        const homozygousDeletion = Object.fromEntries(
          response?.data?.cases?.homozygousDeletion?.project__project_id?.buckets?.map(
            (b) => [b.key, b.count],
          ),
        );
        const total = Object.fromEntries(
          response?.data?.cases?.cnvTotal?.project__project_id?.buckets?.map(
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
          caseTotal: response?.data?.cases.cnvCases?.total,
        };
      },
    }),
  }),
});

export const { useCnvPlotQuery } = cnvPlotSlice;
