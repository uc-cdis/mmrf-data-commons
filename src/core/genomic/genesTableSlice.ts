import {
  Union,
  guppyApi,
  convertFilterToGqlFilter,
  UnionOrIntersection,
  filterSetToOperation,
  convertFilterSetToGqlFilter as buildCohortGqlOperator,
} from '@gen3/core';
import { GenomicTableProps } from './types';
import { extractFiltersWithPrefixFromFilterSet } from '../../features/cohort/utils';
import { extractContents } from '@/core/utils';
import {
  TopSsm,
} from '@/core/genomic/ssmsTableSlice';

const GenesTableGraphQLQuery = `
          query GenesTable(
            $caseFilters: FiltersArgument
            $genesTable_filters: FiltersArgument
            $genesTable_size: Int
            $genesTable_offset: Int
            $score: String
            $ssmCase: FiltersArgument
            $geneCaseFilter: FiltersArgument
            $ssmTested: FiltersArgument
            $cnvTested: FiltersArgument
            $cnvGainFilters: FiltersArgument
            $cnvLossFilters: FiltersArgument
            $cnvAmplificationFilters: FiltersArgument
            $cnvHomozygousDeletionFilters: FiltersArgument
            $sort: [Sort]
          ) {
            genesTableViewer: viewer {
              explore {
                cases {
                  hits(first: 0, case_filters: $ssmTested) {
                    total
                  }
                }
                filteredCases: cases {
                  hits(first: 0, case_filters: $geneCaseFilter) {
                    total
                  }
                }
                cnvCases: cases {
                  hits(first: 0, case_filters: $cnvTested) {
                    total
                  }
                }
                genes {
                  hits(
                    first: $genesTable_size
                    offset: $genesTable_offset
                    filters: $genesTable_filters
                    case_filters: $caseFilters
                    score: $score
                    sort: $sort
                  ) {
                    total
                    edges {
                      node {
                        id
                        numCases: score
                        symbol
                        name
                        cytoband
                        biotype
                        gene_id
                        is_cancer_gene_census
                        ssm_case: case {
                          hits(first: 0, filters: $ssmCase) {
                            total
                          }
                        }
                        cnv_case: case {
                          hits(first: 0, case_filters: $caseFilters, filters: $cnvTested) {
                            total
                          }
                        }
                        case_cnv_gain: case {
                          hits(first: 0, case_filters: $caseFilters, filters: $cnvGainFilters) {
                            total
                          }
                        }
                        case_cnv_loss: case {
                          hits(first: 0, case_filters: $caseFilters, filters: $cnvLossFilters) {
                            total
                          }
                        }
                        case_cnv_amplification: case {
                          hits(first: 0, case_filters: $caseFilters, filters: $cnvAmplificationFilters) {
                            total
                          }
                        }
                        case_cnv_homozygous_deletion: case {
                          hits(first: 0, case_filters: $caseFilters, filters: $cnvHomozygousDeletionFilters) {
                            total
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
`;

export interface GeneRowInfo {
  readonly biotype: string;
  readonly case_cnv_amplification: number;
  readonly case_cnv_gain: number;
  readonly case_cnv_loss: number;
  readonly case_cnv_homozygous_deletion: number;
  readonly cnv_case: number;
  readonly cytoband: Array<string>;
  readonly gene_id: string;
  readonly id: string;
  readonly is_cancer_gene_census: boolean;
  readonly name: string;
  readonly numCases: number;
  readonly ssm_case: number;
  readonly symbol: string;
}

export interface GDCGenesTable {
  readonly cases: number;
  readonly cnvCases: number;
  readonly filteredCases: number;
  readonly genes: ReadonlyArray<GeneRowInfo>;
  readonly genes_total: number;
  readonly mutationCounts?: Record<string, string>;
}

const genesTableSlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    geneTableData: builder.query<any, GenomicTableProps>({
      query: (request: GenomicTableProps) => {
        const {
          pageSize,
          offset,
          genesTableFilters,
          genomicFilters,
          cohortFilters,
        } = request;

        const caseFilters = buildCohortGqlOperator(cohortFilters);
        const cohortFiltersContent = extractContents(caseFilters) ?? [];
        const genesTable_filters = buildCohortGqlOperator(genesTableFilters);

        const baseFilters = filterSetToOperation(genomicFilters) as
          | UnionOrIntersection
          | undefined;

        const rawFilterContents =
          baseFilters && extractContents(convertFilterToGqlFilter(baseFilters));
        const filterContents = rawFilterContents
          ? Object(rawFilterContents)
          : [];

        /**
         * Only apply "genes." filters to the genes table's CNV gain and loss filters.
         */
        const onlyGenesFilters = buildCohortGqlOperator(
          extractFiltersWithPrefixFromFilterSet(genomicFilters, 'genes.'),
        );

        const onlyGeneFilterContents = extractContents(onlyGenesFilters) ?? [];

        const graphQlFilters = {
          caseFilters: caseFilters ? caseFilters : {},
          genesTable_filters: genesTable_filters ? genesTable_filters : {},
          genesTable_size: pageSize,
          genesTable_offset: offset,
          score: 'case.project.project_id',
          ssmCase: {
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: 'cases.available_variation_data',
                  value: ['ssm'],
                },
              },
              {
                op: 'NOT',
                content: {
                  field: 'genes.case.ssm.observation.observation_id',
                  value: 'MISSING',
                },
              },
            ],
          },
          geneCaseFilter: {
            content: [
              ...[
                {
                  content: {
                    field: 'cases.available_variation_data',
                    value: ['ssm'],
                  },
                  op: 'in',
                },
              ],
              ...cohortFiltersContent,
            ],
            op: 'and',
          },
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
          cnvTested: {
            op: 'and',
            content: [
              ...[
                {
                  content: {
                    field: 'cases.available_variation_data',
                    value: ['cnv'],
                  },
                  op: 'in',
                },
              ],
              ...cohortFiltersContent,
            ],
          },
          cnvGainFilters: {
            op: 'and',
            content: [
              ...[
                {
                  content: {
                    field: 'cases.available_variation_data',
                    value: ['cnv'],
                  },
                  op: 'in',
                },
                {
                  content: {
                    field: 'cnvs.cnv_change_5_category',
                    value: ['Gain'],
                  },
                  op: 'in',
                },
              ],
              ...onlyGeneFilterContents,
            ],
          },
          cnvLossFilters: {
            op: 'and',
            content: [
              ...[
                {
                  content: {
                    field: 'cases.available_variation_data',
                    value: ['cnv'],
                  },
                  op: 'in',
                },
                {
                  content: {
                    field: 'cnvs.cnv_change_5_category',
                    value: ['Loss'],
                  },
                  op: 'in',
                },
              ],
              ...onlyGeneFilterContents,
            ],
          },
          cnvAmplificationFilters: {
            op: 'and',
            content: [
              ...[
                {
                  content: {
                    field: 'cases.available_variation_data',
                    value: ['cnv'],
                  },
                  op: 'in',
                },
                {
                  content: {
                    field: 'cnvs.cnv_change_5_category',
                    value: ['Amplification'],
                  },
                  op: 'in',
                },
              ],
              ...onlyGeneFilterContents,
            ],
          },
          cnvHomozygousDeletionFilters: {
            op: 'and',
            content: [
              ...[
                {
                  content: {
                    field: 'cases.available_variation_data',
                    value: ['cnv'],
                  },
                  op: 'in',
                },
                {
                  content: {
                    field: 'cnvs.cnv_change_5_category',
                    value: ['Homozygous Deletion'],
                  },
                  op: 'in',
                },
              ],
              ...onlyGeneFilterContents,
            ],
          },
        };

        return {
          query: GenesTableGraphQLQuery,
          variables: graphQlFilters,
        };
      },
      transformResponse: (response: { data: any }) => {
        const { consequence, ssm_id } = response?.data?.viewer?.explore?.ssms
          ?.hits?.edges?.[0]?.node ?? { consequence: {}, ssm_id: '' };
        const { aa_change, consequence_type } = consequence?.hits?.edges?.[0]
          ?.node?.transcript ?? { aa_change: '', consequence_type: '' };
        return {
          ssm_id,
          aa_change,
          consequence_type,
        };
      },
    }),
  }),
});

export type CnvChange =
  | 'Amplification'
  | 'Gain'
  | 'Loss'
  | 'Homozygous Deletion';

export const buildGeneTableSearchFilters = (
  term?: string,
): Union | undefined => {
  if (term !== undefined) {
    return {
      operator: 'or',
      operands: [
        {
          operator: 'includes',
          field: 'genes.cytoband',
          operands: [`*${term}*`],
        },
        {
          operator: 'includes',
          field: 'genes.gene_id',
          operands: [`*${term}*`],
        },
        {
          operator: 'includes',
          field: 'genes.symbol',
          operands: [`*${term}*`],
        },
        { operator: 'includes', field: 'genes.name', operands: [`*${term}*`] },
      ],
    };
  }
  return undefined;
};

export const { useGeneTableDataQuery } = genesTableSlice;
