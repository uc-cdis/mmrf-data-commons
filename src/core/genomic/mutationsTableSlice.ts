import {
  Union,
  convertFilterSetToGqlFilter,
  FilterSet,
  gen3Api,
} from '@gen3/core';

import { extractContents } from '@/core/utils';
import { SsmsTableRequestParameters } from './types';

import { GEN3_ANALYSIS_API, TablePageOffsetProps } from '@/core';

const mutationsTableSlice = gen3Api.injectEndpoints({
  endpoints: (builder) => ({
    mutationTableData: builder.query<any, SsmsTableRequestParameters>({
      query: ({
        geneSymbol,
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
            and: [...geneFilterContents, geneSymbol],
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
