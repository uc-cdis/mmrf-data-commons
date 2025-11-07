import {
  gen3Api,
  Operation,
  convertFilterSetToGqlFilter,
  FilterSet,
} from '@gen3/core';

import { extractContents } from '@/core/utils';
import { GEN3_ANALYSIS_API} from '@/core';
import { extractFiltersWithPrefixFromFilterSet } from '@/features/cohort/utils';
import { convertFilterSetToNestedGqlFilter } from '../../core/utils/filters';
import { BaseQuery } from 'tern';
import {
  addPrefixToFilterSet,
  GenomicIndexFilterPrefixes,
  separateGeneAndSSMFilters,
} from '@/core/genomic/genomicFilters';


interface TopQueryRequest {
  cohortFilters: FilterSet;
  genomicFilters: FilterSet;
  type: "gene" | "ssm"
}

const topGeneAndSSMSlice = gen3Api.injectEndpoints({
  endpoints: (builder) => ({
    topGenomic: builder.query<any, TopQueryRequest>({
      query: ({ cohortFilters, genomicFilters, type  }: TopQueryRequest) => {
          const caseFilters = convertFilterSetToGqlFilter(cohortFilters);

        const filters = separateGeneAndSSMFilters(genomicFilters);

        const ssmFilters = addPrefixToFilterSet(
          filters.ssm,
          `${GenomicIndexFilterPrefixes[type].ssm}.`
        );
        const geneFilters = addPrefixToFilterSet(
          filters.gene,
          `${GenomicIndexFilterPrefixes[type].gene}.`,
        );



          const gf = convertFilterSetToGqlFilter(geneFilters);
          const sf = convertFilterSetToGqlFilter(ssmFilters);

        return ({
          url: `${GEN3_ANALYSIS_API}/genomic/${type}_frequency_chart`,
          method: 'POST',
          body: JSON.stringify({
            case_filters: caseFilters,
            gene_filters: gf,
            ssm_filters: sf,
            size: 1,
          }),
        });
        }
    }),
  }),
});

export const { useTopGenomicQuery } = topGeneAndSSMSlice;
