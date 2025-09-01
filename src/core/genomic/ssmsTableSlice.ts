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
import { convertFilterSetToNestedGqlFilter } from '@/core/utils';

const SSMSTableGraphQLQuery = `query SsmsTable(
    $ssmTested: JSON
    $ssmCaseFilter: JSON
    $ssmTotalFilter: JSON
    $caseTotalFilter: JSON
    $ssmsTable_size: Int
    $ssmsTable_offset: Int
    $ssmsTable_filters: JSON
    $sort: JSON
) {
    cases: CaseCentric__aggregation {
        case_centric(filter: $ssmTested) {
            _totalCount
        }
        filteredCases: case_centric(filter: $caseTotalFilter) {
            _totalCount
        }
    }
    ssm: Ssm_ssm(
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
        occurrence {
            case {
                case_id
            }
        }
    }
    filteredOccurrences: Ssm__aggregation {
        ssm(filter: $ssmCaseFilter) {
            _totalCount
        }
    }
    ssms: Ssm__aggregation {
        ssm(filter: $ssmTotalFilter) {
            _totalCount
        }
    }
}`;

interface CaseIdData {
  case : {
        case_id: string;
  }
}

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
      readonly dbsnp_rs: string;
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
  readonly filteredOccurrences: number;
  readonly id: string;
  readonly score: number;
  readonly genomic_dna_change: string;
  readonly mutation_subtype: string;
  readonly consequence: ReadonlyArray<SSMSConsequence>;
  readonly occurrence: number
}

export interface SSMSDataResponse extends Omit<SSMSData, "occurrence" | "filteredOccurrences"> {
  readonly occurrence: ReadonlyArray<CaseIdData>;
  readonly filteredOccurrences: { ssm: { _totalCount: number } };
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
      cases: {
        case_centric: {
          _totalCount: number;
        };
        filteredCases: {
          _totalCount: number;
        };
      };
      ssm: SSMSDataResponse[];
      filteredOccurrences: { ssm : { _totalCount: number;  }};
      ssms: {
        ssm: {
          _totalCount: number;
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

  console.log("tableFilters", tableFilters);
  const contextFilters = convertFilterSetToNestedGqlFilter(tableFilters) ?? {};
  const graphQlFilters = {
    ssmCaseFilter: getSSMTestedCases(geneSymbol),
    // for table filters use both cohort and genomic filter along with search filter
    // for case summary we need to not use case filter
    caseFilters: cohortFiltersGQL,

    ssmsTable_filters: {
      "and": [
        {
          "nested": {
            "path": "consequence",
            "nested": {
              "path": "consequence.transcript",
              "eq": {
                "is_canonical": true
              }
            }
          }
        },
        {
          "nested": {
            "path": "consequence",
            "nested": {
              "path": "consequence.transcript",
              "nested": {
                "path": "consequence.transcript.gene",
                "in": {
                  "symbol": [
                    geneSymbol
                  ]
                }}
            }
          }
        },
        contextFilters
      ]
    },
    caseTotalFilter: {
      "and": [
        {
          "in": {
            "available_variation_data": [
              "ssm"
            ]
          }
        },
        {
          "nested": {
            "path": "gene",
            "in": {
              "symbol": [
                geneSymbol
              ]
            }
          }
        }
      ]
    },
    ssmTested: {
      "and": [
        {
          "in": {
            "available_variation_data": [
              "ssm"
            ]
          }
        }
      ]
    },
    ssmTotalFilter : {
      "and": [
        {
          "nested": {
            "path": "occurrence",
            "nested": {
              "path": "occurrence.case",
              "in": {
                "available_variation_data": [
                  "ssm"
                ]
              }
            }
          }
        }
      ]
    },
    ssmsTable_size: pageSize,
    ssmsTable_offset: offset,
    sort: [
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
        const { consequence, ssm_id } = response?.data?.ssm[0] ?? { consequence: {}, ssm_id: "" };
        const { aa_change, consequence_type } = consequence?.[0]?.transcript ?? { aa_change: "", consequence_type: "" };
        return {
          ssm_id,
          aa_change,
          consequence_type,
        };
      },
    }),
    getSsmsTableData: builder.query({
      query: (request: SsmsTableRequestParameters) => ({
        query: SSMSTableGraphQLQuery,
        variables: generateFilter(request),
      }),
      transformResponse: (response: GraphQLApiResponse<ssmtableResponse>) => {
        const data = response.data;
        console.log("data", data);
        const ssmsTotal = data.ssms.ssm._totalCount;
        const cases = data.cases.case_centric._totalCount;
        const filteredCases = data.cases.filteredCases._totalCount;

        const ssms  = data.ssm.map(( node ): SSMSData => {
          return {
            ssm_id: node.ssm_id,
            score: 1.0,
            id:  node.ssm_id,
            mutation_subtype: node.mutation_subtype,
            genomic_dna_change: node.genomic_dna_change,
            occurrence: node.occurrence.length,
            filteredOccurrences: node.occurrence.length,
            consequence: node.consequence.reduce((acc : SSMSConsequence[],  node ) => {
              const transcript = node.transcript;
              if (!transcript.is_canonical)  // only return canonical
                return acc;
              acc.push( {
                id: node.id,
                transcript: {
                  aa_change: node.transcript.aa_change,
                  annotation: { ...node.transcript.annotation },
                  consequence_type: transcript.consequence_type,
                  gene: { ...transcript.gene },
                  is_canonical: transcript.is_canonical,
                },
              });
              return acc;
            }, []),
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

export const { useGetSsmsTableDataQuery, useGetSsmTableDataMutation } =
  ssmTableSlice;
