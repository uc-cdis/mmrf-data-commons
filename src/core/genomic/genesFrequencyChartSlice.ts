import {
  gen3Api,
  Operation,
  convertFilterSetToGqlFilter,
  FilterSet,
} from '@gen3/core';
import { convertFilterSetToNestedGqlFilter } from '@/core/utils';
import { GEN3_ANALYSIS_API, TablePageOffsetProps} from '@/core';
import { extractContents } from '@/core/utils';


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
        const caseFilters = convertFilterSetToGqlFilter(cohortFilters);
        const geneFilterContents = extractContents(convertFilterSetToGqlFilter(geneFilters)) ?? []
        const ssmFilterContents = extractContents(convertFilterSetToGqlFilter(ssmFilters)) ?? []

        const request = {
          cohort_filter: caseFilters ? caseFilters : {},
          gene_filter: {
            "and": [
              ...geneFilterContents,
            ],
          },
          ssm_filter: {
            "and": [
              ...ssmFilterContents,
            ],
          },
        };

        return ({
          url:`${GEN3_ANALYSIS_API}/genomic/gene_frequency_chart`,
          method: 'POST',
          body:  JSON.stringify(request),
        }) },
      transformResponse: (response: any) => {
        const data = response;
        return {
          filteredCases: data?.filteredCases ?? 0,
          cnvCases: 0, // TODO: add cnv data
          genesTotal: data?.genesTotal ?? 0,
          genes: data?.data ?? [],
        };
      },
    }),
  }),
});

export const { useGeneFrequencyChartQuery } = geneFrequencyChartSlice;
