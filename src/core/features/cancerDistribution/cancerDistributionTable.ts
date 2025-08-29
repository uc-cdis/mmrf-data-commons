import {
  FilterSet,
  GQLIntersection as GqlIntersection,
  Includes,
  EmptyFilterSet,
  guppyApi,
} from '@gen3/core';
import { Bucket, GraphQLApiResponse } from '@/core/types';
import { convertFilterSetToNestedGqlFilter } from '@/core/utils';
import { ProjectData } from '@/core/features/cancerDistribution/types';

interface GeneCancerDistributionTableResponse {
  ssms: {
      ssm : { occurrence : {case : { project: ProjectData; } }
   }
  };
  cases: {
    filtered: {
      project: ProjectData;
    };
    total: {
      project: ProjectData;
    };
    cnvAmplification: {
      project: ProjectData;
    };
    cnvGain: {
      project: ProjectData;
    };
    cnvLoss: {
      project: ProjectData;
    };
    cnvHomozygousDeletion: {
      project: ProjectData;
    };
    cnvTotal: {
      project: ProjectData;
    };
  };
}

interface SSMSCancerDistributionTableResponse {
  ssms: {
    ssm : { occurrence : {case : { project: ProjectData; } }
    }
  };
  cases: {
    filtered: {
      project: ProjectData;
    };
    total: {
      project: ProjectData;
    };
  };
}

export interface CancerDistributionTableData {
  projects: readonly Bucket[];
  ssmFiltered: Record<string, number>;
  ssmTotal: Record<string, number>;
  cnvAmplification?: Record<string, number>;
  cnvGain?: Record<string, number>;
  cnvLoss?: Record<string, number>;
  cnvHomozygousDeletion?: Record<string, number>;
  cnvTotal?: Record<string, number>;
}

export const cancerDistributionTableApiSlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    getGeneCancerDistributionTable: builder.query({
      query: (request: {
        gene: string;
        cohortFilters: FilterSet | undefined;
        genomicFilters: FilterSet | undefined;
      }) => {
        const genomicWithGene: FilterSet = {
          mode: 'and',
          root: {
            ...request.genomicFilters?.root,
            ['gene.gene_id']: {
              operator: 'includes',
              field: 'gene.gene_id',
              operands: [request.gene],
            } as Includes,
          },
        };

        const geneFilter = convertFilterSetToNestedGqlFilter({
          mode: 'and',
          root: {
            ['gene.gene_id']: {
              operator: 'includes',
              field: 'gene.gene_id',
              operands: [request.gene],
            } as Includes,
          },
        });
        const ssmGeneFilter = convertFilterSetToNestedGqlFilter({
          mode: 'and',
          root: {
            ['consequence.transcript.gene.gene_id']: {
              operator: 'includes',
              field: 'consequence.transcript.gene.gene_id',
              operands: [request.gene],
            } as Includes,
          },
        });


        const gqlContextFilter = convertFilterSetToNestedGqlFilter(
          genomicWithGene ?? EmptyFilterSet,
        );
        const gqlCohortFilters = convertFilterSetToNestedGqlFilter(
          request.cohortFilters ?? EmptyFilterSet,
        );
        const gqlContextIntersection =
          gqlContextFilter &&
          (gqlContextFilter as GqlIntersection)?.and?.length > 0
            ? (gqlContextFilter as GqlIntersection).and
            : [];
        const geneSSMGqlContextIntersection =
          ssmGeneFilter && (geneFilter as GqlIntersection).and?.length > 0
            ? (ssmGeneFilter as GqlIntersection).and
            : [];
        const geneGqlContextIntersection =
          geneFilter && (geneFilter as GqlIntersection).and?.length > 0
            ? (geneFilter as GqlIntersection).and
            : [];

        return {
          query: `query CancerDistributionTable($ssmTested: JSON, $ssmCountsFilters: JSON, $caseAggsFilter: JSON, $cnvAmplificationFilter: JSON, $cnvGainFilter: JSON, $cnvLossFilter: JSON, $cnvHomozygousDeletionFilter: JSON, $cnvTested: JSON) {
          ssms: Ssm__aggregation {
            ssm(filter: $ssmCountsFilters) {
              occurrence {
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
          }
          cases: CaseCentric__aggregation {
            filtered: case_centric(filter: $caseAggsFilter) {
              project {
                project_id {
                  histogram {
                    key
                    count
                  }
                }
              }
            }
            cnvAmplification: case_centric(
              filter: $cnvAmplificationFilter
            ) {
              project {
                project_id {
                  histogram {
                    key
                    count
                  }
                }
              }
            }
            cnvGain: case_centric(filter: $cnvGainFilter) {
              project {
                project_id {
                  histogram {
                    key
                    count
                  }
                }
              }
            }
            cnvLoss: case_centric(filter: $cnvLossFilter) {
              project {
                project_id {
                  histogram {
                    key
                    count
                  }
                }
              }
            }
            cnvHomozygousDeletion: case_centric(
              filter: $cnvHomozygousDeletionFilter
            ) {
              project {
                project_id {
                  histogram {
                    key
                    count
                  }
                }
              }
            }
            cnvTotal: case_centric(filter: $cnvTested) {
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
        }
      `,
          variables: {
            cohortFilters: gqlCohortFilters,
            ssmTested: {
              and: [
                {
                  in: {
                    available_variation_data: ['ssm'],
                  },
                },
              ],
            },
            ssmCountsFilters: {
              and: [
                {
                  nested: {
                    path: 'occurrence',
                    nested: {
                      path: 'occurrence.case',
                  in: {
                    available_variation_data: ['ssm'],
                  },
                }}},
                ...geneSSMGqlContextIntersection,
              ],
            },
            caseAggsFilter: {
              and: [
                {
                  in: {
                    available_variation_data: ['ssm'],
                  },
                },
                ...gqlContextIntersection,
              ],
            },
            cnvAmplificationFilter: {
              'and': [
                {
                  in: {
                    available_variation_data: ['cnv'],
                  },
                },
                {
                  nested: {
                    path: 'gene',
                    nested: {
                      path: 'gene.cnv',
                      in: {
                        cnv_change_5_category: ['Amplification'],
                      },
                    },
                  },
                },
                ...geneGqlContextIntersection,
              ],
            },
            cnvGainFilter: {
              'and': [
                {
                  in: {
                    available_variation_data: ['cnv'],
                  },
                },
                {
                  nested: {
                    path: 'gene',
                    nested: {
                      path: 'gene.cnv',
                      in: {
                        cnv_change_5_category: ['Gain'],
                      },
                    },
                  },
                },
                ...geneGqlContextIntersection,
              ],
            },
            cnvLossFilter: {
             'and': [
                {
                  in: {
                    available_variation_data: ['cnv'],
                  },
                },
                {
                  nested: {
                    path: 'gene',
                    nested: {
                      path: 'gene.cnv',
                      in: {
                        cnv_change_5_category: ['Loss'],
                      },
                    },
                  },
                },
                ...geneGqlContextIntersection,
              ],
            },
            cnvHomozygousDeletionFilter: {
             'and': [
                {
                  in: {
                    available_variation_data: ['cnv'],
                  },
                },
                {
                  nested: {
                    path: 'gene',
                    nested: {
                      path: 'gene.cnv',
                      in: {
                        cnv_change_5_category: ['Homozygous Deletion'],
                      },
                    },
                  },
                },
                ...geneGqlContextIntersection,
              ],
            },
            cnvTested: {
              and: [
                {
                  in: {
                    available_variation_data: ['cnv'],
                  },
                },
              ],
            },
          },
        };
      },
      transformResponse: (
        response: GraphQLApiResponse<GeneCancerDistributionTableResponse>,
      ): CancerDistributionTableData => {
        return {
          projects:
            response?.data?.ssms?.ssm?.occurrence?.case?.project?.project_id?.histogram.length > 0
              ? response?.data?.ssms?.ssm?.occurrence?.case?.project?.project_id?.histogram
              : response?.data?.cases?.cnvTotal.project?.project_id.histogram,
          ssmFiltered: Object.fromEntries(
            response?.data?.cases?.filtered?.project?.project_id?.histogram.map(
              (b: any) => [b.key, b.count],
            ),
          ),
          ssmTotal: Object.fromEntries(
            response?.data?.cases?.total?.project?.project_id?.histogram.map(
              (b: any) => [b.key, b.count],
            ),
          ),
          cnvAmplification: Object.fromEntries(
            response?.data?.cases?.cnvAmplification?.project?.project_id?.histogram.map(
              (b: any) => [b.key, b.count],
            ),
          ),
          cnvGain: Object.fromEntries(
            response?.data?.cases?.cnvGain?.project?.project_id?.histogram.map(
              (b: any) => [b.key, b.count],
            ),
          ),
          cnvLoss: Object.fromEntries(
            response?.data?.cases?.cnvLoss?.project?.project_id?.histogram.map(
              (b: any) => [b.key, b.count],
            ),
          ),
          cnvHomozygousDeletion: Object.fromEntries(
            response?.data?.cases?.cnvHomozygousDeletion?.project?.project_id?.histogram.map(
              (b: any) => [b.key, b.count],
            ),
          ),
          cnvTotal: Object.fromEntries(
            response?.data?.cases?.cnvTotal?.project?.project_id?.histogram.map(
              (b: any) => [b.key, b.count],
            ),
          ),
        };
      },
    }),
    getSSMSCancerDistributionTable: builder.query({
      query: (request) => ({
        query: `query CancerDistributionSsmTable(
            $ssmTested: JSON
            $ssmCountsFilters: JSON
            $caseAggsFilter: JSON
        ) {
           ssms: Ssm__aggregation {
                ssm(filter: $ssmCountsFilters) {
                    occurrence {
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
            }
           cases: CaseCentric__aggregation {
                filtered: case_centric(filter: $caseAggsFilter) {
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
        }`,
        variables: {
          ssmTested: {
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
          ssmCountsFilters: {
            content: [
              {
                content: {
                  field: 'ssms.ssm_id',
                  value: [request.ssms],
                },
                op: 'in',
              },
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
          caseAggsFilter: {
            content: [
              {
                content: {
                  field: 'ssms.ssm_id',
                  value: [request.ssms],
                },
                op: 'in',
              },
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
        },
      }),
      transformResponse: (
        response: GraphQLApiResponse<SSMSCancerDistributionTableResponse>,
      ): CancerDistributionTableData => {
        console.log("response", response)
        return {
          projects:
            response?.data?.ssms
              ?.ssm.occurrence?.case?.project?.project_id?.histogram,
          ssmFiltered: Object.fromEntries(
            (
              response?.data?.cases?.filtered?.project?.project_id
            )?.histogram.map((b: any) => [b.key, b.count]),
          ),
          ssmTotal: Object.fromEntries(
            response?.data?.cases?.total?.project?.project_id?.histogram.map(
              (b: any) => [b.key, b.count],
            ),
          ),
        };
      },
    }),
  }),
});

export const {
  useGetGeneCancerDistributionTableQuery,
  useGetSSMSCancerDistributionTableQuery,
} = cancerDistributionTableApiSlice;
