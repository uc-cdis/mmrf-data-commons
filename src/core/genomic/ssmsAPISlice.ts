import { convertFilterSetToGqlFilter, gen3Api } from '@gen3/core';
import { GEN3_ANALYSIS_API, GraphQLApiResponse } from '@/core';
import { SsmsTableRequestParameters, SSMSTableResponse } from '@/core/genomic/types';
import { extractContents } from '@/core/utils';



const ssmPagedTableSlice = gen3Api.injectEndpoints({
  endpoints: (builder) => ({
    advancedSmmTableData: builder.query<
      GraphQLApiResponse<SSMSTableResponse>,
      SsmsTableRequestParameters
    >({
      query: ({
                cohortFilters,
                geneSymbol,
                geneFilters,
                ssmFilters,
                pageSize = 10,
                offset = 0,
              }: SsmsTableRequestParameters) => {
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
          size: offset + pageSize,
          offset: offset,
        };
        return {
          url: `${GEN3_ANALYSIS_API}/genomic/ssm_table`,
          method: 'POST',
          body: JSON.stringify(body),
        };
      },
    }),
  })
  });

export const { useAdvancedSmmTableDataQuery } = ssmPagedTableSlice;
