import {
  Union,
  guppyApi,
  FilterSet,
  convertFilterToGqlFilter,
  UnionOrIntersection,
  filterSetToOperation,
  convertFilterSetToGqlFilter as buildCohortGqlOperator,
} from '@gen3/core';
import { TablePageOffsetProps} from '@/core';
import { extractContents } from '@/core/utils';


const GeneMutationFrequencyQuery = `
    query CaseCentric__aggregation(
        $geneCaseFilter: JSON
        $geneFrequencyChart_filters: JSON
        $geneFrequencyChart_size: Int
        $geneFrequencyChart_offset: Int
    ) {
        cases: CaseCentric__aggregation {
            case_centric(filter: $geneCaseFilter) {
                case_id {
                    _totalCount
                }
            }
        }
        genes: Gene_gene(
            filter: $geneFrequencyChart_filters
            offset: $geneFrequencyChart_offset
            first: $geneFrequencyChart_size
        ) {
            gene_id
            name
            case {
                case_id
            }
            is_cancer_gene_census
            biotype
            symbol
        }
        geneCounts: Gene__aggregation {
            gene {
                gene_id {
                    _totalCount
                }
            }
        }
    }
`;

export interface GeneFrequencyTableProps extends TablePageOffsetProps {
  genomicFilters: FilterSet;
  cohortFilters: FilterSet;
}

interface GeneFrequencyEntry {
  readonly gene_id: string;
  readonly numCases: number;
  readonly symbol: string;
}

interface GeneFrequencyEntryResponse extends Omit<GeneFrequencyEntry, 'numCases'> {
readonly case: {
    case_id: string;
  }[];
}

export interface GenesFrequencyChart {
  readonly geneCounts: ReadonlyArray<GeneFrequencyEntry>;
  readonly casesTotal: number;
  readonly genesTotal: number;
}

const geneFrequencyChartSlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    geneFrequencyChart: builder.query<
      GenesFrequencyChart,
      GeneFrequencyTableProps
    >({
      query: ({ cohortFilters, genomicFilters, pageSize = 20, offset = 0 }) => {
        const caseFilters = buildCohortGqlOperator(cohortFilters);
        const cohortFiltersContent = extractContents(caseFilters)
          ? Object(extractContents(caseFilters))
          : [];

        const graphQlVariables = {
          geneFrequencyChart_filters:
            buildCohortGqlOperator(genomicFilters) ?? {},
          geneFrequencyChart_size: pageSize,
          geneFrequencyChart_offset: offset,
          geneCaseFilter: {
            "and": [
              {
                "nested": {
                  "path": "cases",
                  "in": {
                    "available_variation_data": [
                      "ssm"
                    ]
                  }
                }
              },
              ...cohortFiltersContent,
            ],
          },
        };

        return {
          query: GeneMutationFrequencyQuery,
          variables: graphQlVariables,
        };
      },
      transformResponse: (response) => {
        const data = response.data;
        return {
          casesTotal: data.cases.case_centric.case_id._totalCount,
          genesTotal: data.geneCounts.gene.gend_id._totalCount,
          geneCounts: data.genes.map(
            ({ node }: { node: GeneFrequencyEntryResponse }) => ({
              gene_id: node.gene_id,
              numCases: node.case.length,
              symbol: node.symbol,
            }),
          ),
        };
      },
    }),
  }),
});

export const { useGeneFrequencyChartQuery } = geneFrequencyChartSlice;
