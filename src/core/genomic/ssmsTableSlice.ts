import {
  convertFilterSetToGqlFilter as buildCohortGqlOperator,
  FilterSet,
  Union,
  DataStatus,
  guppyApi,
  TablePageOffsetProps
} from '@gen3/core';
import { getSSMTestedCases } from "./utils";
import { GraphQLApiResponse } from '@/core';

const SSMSTableGraphQLQuery = `query SsmsTable(
    $ssmTested: JSON
    $ssmCaseFilter: JSON
    $ssmsTable_size: Int
    $ssmsTable_offset: Int
    $ssmsTable_filters: JSON
    $sort: JSON
) {
    CaseCentric__aggregation {
        case_centric(filter: $ssmTested) {
            _totalCount
        }
        filteredCases: case_centric(filter: $ssmCaseFilter) {
            _totalCount
        }
    }
    Ssm_ssm(
        first: $ssmsTable_size
        offset: $ssmsTable_offset
        filter: $ssmsTable_filters
        sort: $sort
    ) {
        genomic_dna_change
        mutation_subtype
        ssm_id
        consequence {
            transcript {
                is_canonical
                annotation {
                    vep_impact
                    polyphen_impact
                    polyphen_score
                    sift_score
                    sift_impact
                }
                consequence_type
                gene {
                    gene_id
                    symbol
                }
                aa_change
            }
        }
    }
    filteredOccurences: Ssm__aggregation {
        ssm(filter: $ssmCaseFilter) {
            _totalCount
        }
    }
    Ssm__aggregation {
        ssm(filter: $ssmTested) {
            _totalCount
        }
    }
}`;

export interface SSMSConsequence {
  readonly id: string;
  readonly transcript: {
    readonly aa_change: string;
    readonly annotation: {
      readonly polyphen_impact: string;
      readonly polyphen_score: number;
      readonly sift_impact: string;
      readonly sift_score: string;
      readonly vep_impact: string;
      readonly hgvsc?: string;
    };
    readonly consequence_type: string;
    readonly gene: {
      readonly gene_id: string;
      readonly symbol: string;
      readonly gene_strand?: number;
    };
    readonly is_canonical: boolean;
    readonly transcript_id?: string;
  };
}
export interface SSMSData {
  readonly ssm_id: string;
  readonly occurrence: number;
  readonly filteredOccurrences: number;
  readonly id: string;
  readonly score: number;
  readonly genomic_dna_change: string;
  readonly mutation_subtype: string;
  readonly consequence: ReadonlyArray<SSMSConsequence>;
}

export interface GDCSsmsTable {
  readonly cases: number;
  readonly filteredCases: number;
  readonly ssmsTotal: number;
  readonly ssms: ReadonlyArray<SSMSData>;
  readonly pageSize: number;
  readonly offset: number;
}

export const buildSSMSTableSearchFilters = (
  term?: string,
): Union | undefined => {
  if (term !== undefined) {
    return {
      operator: "or",
      operands: [
        {
          operator: "includes",
          field: "genes.gene_id",
          operands: [`*${term}*`],
        },
        {
          operator: "includes",
          field: "ssms.genomic_dna_change",
          operands: [`*${term}*`],
        },
        {
          operator: "includes",
          field: "genes.symbol",
          operands: [`*${term}*`],
        },
        {
          operator: "includes",
          field: "ssms.gene_aa_change",
          operands: [`*${term}*`],
        },
        {
          operator: "includes",
          field: "ssms.ssm_id",
          operands: [`*${term}*`],
        },
      ],
    };
  }
  return undefined;
};

export interface SsmsTableRequestParameters extends TablePageOffsetProps {
  readonly geneSymbol?: string;
  readonly genomicFilters: FilterSet;
  readonly cohortFilters: FilterSet;
  readonly tableFilters: FilterSet;
  readonly _cohortFiltersNoSet?: FilterSet;
}

interface ssmtableResponse {
  viewer: {
    explore: {
      cases: {
        hits: {
          total: number;
        };
      };
      filteredCases: {
        hits: {
          total: number;
        };
      };
      ssms: {
        hits: {
          edges: ReadonlyArray<{
            node: {
              readonly consequence: {
                hits: {
                  edges: ReadonlyArray<{
                    node: SSMSConsequence;
                  }>;
                };
              };
              filteredOccurences: {
                hits: {
                  total: number;
                };
              };
              genomic_dna_change: string;
              id: string;
              mutation_subtype: string;
              occurrence: {
                hits: {
                  total: number;
                };
              };
              score: number;
              ssm_id: string;
            };
          }>;
          total: number;
        };
      };
    };
  };
}

export interface SsmsTableState {
  readonly ssms: GDCSsmsTable;
  readonly status: DataStatus;
  readonly error?: string;
}

export interface TopSsm {
  ssm_id: string;
  aa_change: string;
  consequence_type: string;
}

const generateFilter = ({
  pageSize,
  offset,
  geneSymbol,
  cohortFilters, // the cohort filters which used to filter the cases
  tableFilters,
}: SsmsTableRequestParameters) => {
  const cohortFiltersGQL = buildCohortGqlOperator(cohortFilters);

  const graphQlFilters = {
    ssmCaseFilter: getSSMTestedCases(geneSymbol),
    // for table filters use both cohort and genomic filter along with search filter
    // for case summary we need to not use case filter
    caseFilters: cohortFiltersGQL,
    ssmsTable_filters: buildCohortGqlOperator(tableFilters) ?? {},
    consequenceFilters: {
      content: [
        {
          content: {
            field: "consequence.transcript.is_canonical",
            value: ["true"],
          },
          op: "in",
        },
      ],
      op: "and",
    },
    ssmTested: {
      content: [
        {
          content: {
            field: "cases.available_variation_data",
            value: ["ssm"],
          },
          op: "in",
        },
      ],
      op: "and",
    },
    ssmsTable_size: pageSize,
    ssmsTable_offset: offset,
    score: "occurrence.case.project.project_id",
    sort: [
      {
        field: "_score",
        order: "desc",
      },
      {
        field: "_uid",
        order: "asc",
      },
    ],
  };

  return graphQlFilters;
};

export const ssmTableSlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    getSsmTableData: builder.mutation<TopSsm, SsmsTableRequestParameters>({
      query: (request: SsmsTableRequestParameters) => ({
        query: SSMSTableGraphQLQuery,
        variables: generateFilter(request),
      }),
      transformResponse: (response: { data: ssmtableResponse }) => {
        const { consequence, ssm_id } = response?.data?.viewer?.explore?.ssms
          ?.hits?.edges?.[0]?.node ?? { consequence: {}, ssm_id: "" };
        const { aa_change, consequence_type } = consequence?.hits?.edges?.[0]
          ?.node?.transcript ?? { aa_change: "", consequence_type: "" };
        return {
          ssm_id,
          aa_change,
          consequence_type,
        };
      },
    }),
    getSssmTableData: builder.query({
      query: (request: SsmsTableRequestParameters) => ({
        query: SSMSTableGraphQLQuery,
        variables: generateFilter(request),
      }),
      transformResponse: (response: GraphQLApiResponse<ssmtableResponse>) => {
        const data = response.data.viewer.explore;
        const ssmsTotal = data.ssms.hits.total;
        const cases = data.cases.hits.total;
        const filteredCases = data.filteredCases.hits.total;
        const ssms = data.ssms.hits.edges.map(({ node }): SSMSData => {
          return {
            ssm_id: node.ssm_id,
            score: node.score,
            id: node.id,
            mutation_subtype: node.mutation_subtype,
            genomic_dna_change: node.genomic_dna_change,
            occurrence: node.occurrence.hits.total,
            filteredOccurrences: node.filteredOccurences.hits.total,
            consequence: node.consequence.hits.edges.map(({ node }) => {
              const transcript = node.transcript;
              return {
                id: node.id,
                transcript: {
                  aa_change: node.transcript.aa_change,
                  annotation: { ...node.transcript.annotation },
                  consequence_type: transcript.consequence_type,
                  gene: { ...transcript.gene },
                  is_canonical: transcript.is_canonical,
                },
              };
            }),
          };
        });
        return {
          ssmsTotal,
          cases,
          filteredCases,
          ssms,
        };
      },
    }),
  }),
});

export const { useGetSssmTableDataQuery, useGetSsmTableDataMutation } =
  ssmTableSlice;
