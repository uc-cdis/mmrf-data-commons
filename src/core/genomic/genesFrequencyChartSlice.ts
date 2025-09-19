import {
  gen3Api,
  FilterSet,
} from '@gen3/core';
import { convertFilterSetToNestedGqlFilter } from '@/core/utils';
import { GEN3_ANALYSIS_API, TablePageOffsetProps} from '@/core';
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
  geneFilters: FilterSet;
  ssmFilters: FilterSet;
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
  readonly genes: ReadonlyArray<GeneFrequencyEntry>;
  readonly filteredCases: number;
  readonly genesTotal: number;
  readonly cnvCases?: number;
}

const geneFrequencyChartSlice = gen3Api.injectEndpoints({
  endpoints: (builder) => ({
    geneFrequencyChart: builder.query<
      GenesFrequencyChart,
      GeneFrequencyTableProps
    >({
      query: ({ cohortFilters, geneFilters, ssmFilters, pageSize= 20, offset = 0 }) => {
        const caseFilters = convertFilterSetToNestedGqlFilter(cohortFilters);
        const geneFilterContents = extractContents(convertFilterSetToNestedGqlFilter(geneFilters)) ?? []
        const ssmFilterContents = extractContents(convertFilterSetToNestedGqlFilter(ssmFilters)) ?? []

        const request = {
          case_filters: caseFilters ? caseFilters : {},
          gene_filters: {
            "and": [

              ...geneFilterContents,
            ],
          },
          ssm_filters: {
            "and": [
              ...ssmFilterContents,
            ],
          },
        };

        return ({
          url:`${GEN3_ANALYSIS_API}/cohorts/top_genes_in_cohort`,
          method: 'POST',
          body:  JSON.stringify(request),
        }) },
      transformResponse: (response: any) => {
        const data = response.data;
        return {
          filteredCases: data?.totalCases ?? 0,
          cnvCases: 0, // TODO: add cnv data
          genesTotal: data?.totalGenes ?? 0,
          genes: data?.genes ?? [],
        };
      },
    }),
  }),
});

export const { useGeneFrequencyChartQuery } = geneFrequencyChartSlice;
