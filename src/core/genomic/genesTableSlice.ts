import {
  Union,
  convertFilterSetToGqlFilter,
  FilterSet,
  gen3Api,
} from '@gen3/core';

import { extractContents } from '@/core/utils';

import { GEN3_ANALYSIS_API, TablePageOffsetProps } from '@/core';


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
  readonly ssm_count: number;
  readonly ssm_cases_across_commons: number;
  readonly symbol: string;
}

interface GeneTableRequest extends TablePageOffsetProps {
  geneFilters: FilterSet;
  ssmFilters: FilterSet;
  cohortFilters: FilterSet;
  searchTerm?: string;
}

interface GeneTableResponse {
  totalCases: number;
  cnvCases: number;
  ssmCases: number;
  genesTotal: number;
  genes: ReadonlyArray<GeneRowInfo>;
}

const genesTableSlice = gen3Api.injectEndpoints({
  endpoints: (builder) => ({
    geneTableData: builder.query<GeneTableResponse, GeneTableRequest>({
      query: ({
        cohortFilters,
        geneFilters,
        ssmFilters,
        pageSize = 10,
        offset = 0,
        searchTerm = undefined
      }: GeneTableRequest) => {
        const caseFilters = convertFilterSetToGqlFilter(cohortFilters);
        const geneFilterContents =
          extractContents(convertFilterSetToGqlFilter(geneFilters)) ?? [];
        const ssmFilterContents =
          extractContents(convertFilterSetToGqlFilter(ssmFilters)) ?? [];
        const body = {
          cohort_filter: caseFilters ? caseFilters : {},
          gene_filter: {
            and: [...geneFilterContents],
          },
          ssm_filter: {
            and: [...ssmFilterContents],
          },
          size: (offset + pageSize),
          offset: offset,
            ...(searchTerm ? { search: searchTerm} : {})
        };

        return {
          url: `${GEN3_ANALYSIS_API}/genomic/gene_table`,
          method: 'POST',
          body: JSON.stringify(body),
        };
      },
    }),
  }),
});

export type CnvChange = 'Amplification' | 'Gain' | 'Loss' | 'Neutral' |'Homozygous Deletion';

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
