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

interface GeneTableRequest extends TablePageOffsetProps {
  geneFilters: FilterSet;
  ssmFilters: FilterSet;
  cohortFilters: FilterSet;
}

const genesTableSlice = gen3Api.injectEndpoints({
  endpoints: (builder) => ({
    geneTableData: builder.query<any, GeneTableRequest>({
      query: ({ cohortFilters, geneFilters, ssmFilters, pageSize= 20, offset = 0 } : GeneTableRequest) => {
        const caseFilters = convertFilterSetToGqlFilter(cohortFilters);
        const geneFilterContents = extractContents(convertFilterSetToGqlFilter(geneFilters)) ?? []
        const ssmFilterContents = extractContents(convertFilterSetToGqlFilter(ssmFilters)) ?? []

        const body = {
          case_filter: caseFilters ? caseFilters : {},
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
          body:  JSON.stringify(body),
        }) },

      transformResponse: (response: { data: any }) => {

        console.log("genesTableSlice", response);

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
