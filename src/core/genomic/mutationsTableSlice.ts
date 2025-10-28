import {
  Union,
  convertFilterSetToGqlFilter,
  FilterSet,
  gen3Api,
} from '@gen3/core';

import { extractContents } from '@/core/utils';
import { SsmsTableRequestParameters } from './types';

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
}

interface GeneTableResponse {
  cases: number;
  cnvCases: number;
  filteredCases: number;
  genesTotal: number;
  genes: ReadonlyArray<GeneRowInfo>;
}

const mutationsTableSlice = gen3Api.injectEndpoints({
  endpoints: (builder) => ({
    mutationTableData: builder.query<any, GeneTableRequest>({
      query: ({
        cohortFilters,
        geneFilters,
        ssmFilters,
        pageSize = 20,
        offset = 0,
      }: SsmsTableRequestParameters) => {
        const caseFilters = convertFilterSetToGqlFilter(cohortFilters);
        const geneFilterContents =
          extractContents(convertFilterSetToGqlFilter(geneFilters)) ?? [];
        const ssmFilterContents =
          extractContents(convertFilterSetToGqlFilter(ssmFilters)) ?? [];

        const body = {
          case_filter: caseFilters ? caseFilters : {},
          gene_filter: {
            and: [...geneFilterContents],
          },
          ssm_filter: {
            and: [...ssmFilterContents],
          },
        };

        return {
          url: `${GEN3_ANALYSIS_API}/genomic/ssm_table`,
          method: 'POST',
          body: JSON.stringify(body),
        };
      },
    }),
  }),
});

export const { useMutationTableDataQuery } = mutationsTableSlice;
