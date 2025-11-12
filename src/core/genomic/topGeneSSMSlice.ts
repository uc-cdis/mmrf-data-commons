import {
  gen3Api,
  Operation,
  convertFilterSetToGqlFilter,
  FilterSet,
  JSONObject,
} from '@gen3/core';

import { extractContents } from '@/core/utils';
import { GEN3_ANALYSIS_API } from '@/core';
import { extractFiltersWithPrefixFromFilterSet } from '@/features/cohort/utils';
import { convertFilterSetToNestedGqlFilter } from '../../core/utils/filters';
import { BaseQuery } from 'tern';
import {
  addPrefixToFilterSet,
  GenomicIndexFilterPrefixes,
  separateGeneAndSSMFilters,
} from '@/core/genomic/genomicFilters';
import { GeneSSMSEntry } from '@/core/genomic/types';

interface TopQueryRequest {
  cohortFilters: FilterSet;
  genomicFilters: FilterSet;
  type: 'gene' | 'ssm';
}

const topGeneAndSSMSlice = gen3Api.injectEndpoints({
  endpoints: (builder) => ({
    topGenomic: builder.query<GeneSSMSEntry, TopQueryRequest>({
      query: ({ cohortFilters, genomicFilters, type }: TopQueryRequest) => {
        const caseFilters = convertFilterSetToGqlFilter(cohortFilters);

        const filters = separateGeneAndSSMFilters(genomicFilters);

        const ssmFilters = addPrefixToFilterSet(
          filters.ssm,
          `${GenomicIndexFilterPrefixes[type].ssm}`,
        );
        const geneFilters = addPrefixToFilterSet(
          filters.gene,
          `${GenomicIndexFilterPrefixes[type].gene}`,
        );

        const gf = convertFilterSetToGqlFilter(geneFilters);
        const sf = convertFilterSetToGqlFilter(ssmFilters);

        return {
          url: `${GEN3_ANALYSIS_API}/genomic/${type}_frequency_chart`,
          method: 'POST',
          body: JSON.stringify({
            cohort_filter: caseFilters,
            gene_filter: gf,
            ssm_filter: sf,
            size: 1,
          }),
        };
      },
      transformResponse: (results: Record<string, any>, _meta, args) => {
        if (args.type === 'gene') {
          return {
            genes: {
              symbol: results?.data?.[0]?.symbol,
              name: results?.data?.[0]?.name,
            },
            ssms: {
              name: '',
              symbol: '',
              aa_change: '',
              consequence_type: '',
            },
          };
        } else {
          return {
            genes: {
              symbol: '',
              name: '',
            },
            ssms: {
              symbol: results?.data?.[0]?.ssm_id,
              name: results?.data?.[0]?.consequence?.transcript?.gene?.symbol,
              aa_change: results?.data?.[0]?.consequence[0]?.aa_change,
              consequence_type: results?.data?.[0]?.consequence[0]?.consequence_type,
            },
          };
        }
      },
    }),
  }),
});

export const { useTopGenomicQuery } = topGeneAndSSMSlice;
