import React from 'react';
import {
  CombineMode,
  convertFilterSetToGqlFilter,
  CoreState,
  extractEnumFilterValue,
  FacetDefinition,
  FilterSet,
  GQLFilter,
  isIntersection,
  selectIndexFilters,
  useCoreSelector,
} from '@gen3/core';
import FilterFacets from '@/features/genomic/filters';
import {
  useAllFiltersCollapsed,
  useClearAllGenomicFilters,
  useClearGenomicFilters,
  useFilterExpandedState,
  useGenesFacets,
  useGenomicFilterByName,
  useOpenUploadModal,
  useToggleAllFilters,
  useToggleExpandFilter,
  useTotalGenomicCounts,
  useUpdateGenomicEnumFacetFilter,
  useUploadFilterItems,
} from '@/features/genomic/hooks';
import {
  DropdownPanel,
  EnumFacetDataHooks,
  FacetHooks,
  processBucketData,
  removeIntersectionFromEnum,
  ToggleFacetDataHooks,
  UploadFacetDataHooks,
  useFieldNameToTitle,
} from '@gen3/frontend';
import { AppState, useAppSelector } from './appApi';
import { selectFiltersAppliedCount, selectGeneAndSSMFilters, } from './geneAndSSMFiltersSlice';
import { useDeepCompareCallback, useDeepCompareMemo } from 'use-deep-compare';
import { FacetQueryResponse } from '@/features/types';
import { COHORT_FILTER_INDEX } from '@/core';
import {
  addPrefixToFilterSet,
  GenomicIndexFilterPrefixes,
  mergeGeneAndSSMFilters,
  separateGeneAndSSMFilters,
} from '@/core/genomic/genomicFilters';
import {
  useGetGeneFacetsQuery,
  useGetSsmFacetsQuery,
} from '@/core/features/cohortQuery/cohortQuerySlice';
import { joinFilters } from '@/core/utils';
/**
 *  Get the facet values for both the gene and ssm facets using the current cohort filters
 *  as case filters
 * @param geneFacets
 * @param ssmFacets
 * @param cohortFilters
 */
const useGetFacetValuesQuery = (
  geneFacets: GQLFilter,
  ssmFacets: GQLFilter,
  cohortFilters: GQLFilter,
): FacetQueryResponse => {


  const {
    data: geneData,
    isSuccess: geneIsSuccess,
    isFetching: geneIsFetching,
    isError: geneIsError,
  } = useGetGeneFacetsQuery({
    cohortFilter: cohortFilters,
    filter: geneFacets,
  });
  const {
    data: ssmData,
    isSuccess: ssmIsSuccess,
    isFetching: ssmIsFetching,
    isError: ssmIsError,
  } = useGetSsmFacetsQuery({
    cohortFilter: cohortFilters,
    filter: ssmFacets,
  });

  return {
    data: { ...(geneData ?? {}), ...(ssmData ?? {}) },
    isError: geneIsError || ssmIsError,
    isFetching: geneIsFetching || ssmIsFetching,
    isSuccess: geneIsSuccess || ssmIsSuccess,
  };
};

const GenomicValueLabel = (def?:FacetDefinition) : string => {
  if (def) {
    if (def.index === 'gene_centric') {return 'Genes'}
    else if (def.index === 'ssm_centric') {return 'Mutations'}
    else return "Genes/SSMs";
  }
  return "Genes/SSMs"
}

const GeneAndSSMFilterPanel = ({
  isDemoMode = false,
}: {
  isDemoMode?: boolean;
}): JSX.Element => {
  const cohortFilters = useCoreSelector((state: CoreState) =>
    selectIndexFilters(state, COHORT_FILTER_INDEX),
  );

  const cohortFilterGQL = convertFilterSetToGqlFilter(cohortFilters)

  const genomicFilters : FilterSet = useAppSelector((state: AppState) =>
    selectGeneAndSSMFilters(state),
  );

  const { geneFilters, ssmFilters } = useDeepCompareMemo(() => {
    const filters = separateGeneAndSSMFilters(genomicFilters);

    const ssmFilterForGeneCentric = addPrefixToFilterSet(
      filters.ssm,
      `${GenomicIndexFilterPrefixes.gene.ssm}`
    );
    const geneFiltersForSSMCentric = addPrefixToFilterSet(
      filters.gene,
      `${GenomicIndexFilterPrefixes.ssm.gene}`,
    );

    const geneFilters = convertFilterSetToGqlFilter( joinFilters(ssmFilterForGeneCentric, filters.gene));
    const ssmFilters = convertFilterSetToGqlFilter( joinFilters(geneFiltersForSSMCentric, filters.ssm));
    return { geneFilters: geneFilters, ssmFilters: ssmFilters }
  }, [genomicFilters])

  const {
    data: facetData,
    isSuccess: isFacetsQuerySuccess,
    isFetching: isFacetsQueryFetching,
    isError: isFacetsQueryError,
  } = useGetFacetValuesQuery(
    geneFilters,
    ssmFilters,
    cohortFilterGQL,
  );

  const filters = {
    tabs: [
      {
        title: 'Genes',
        fields: [
          /** TODO turn back on later
          'gene_id',
          'ssm_id',
            *****/
          'biotype',
          'is_cancer_gene_census',
          // In for IA14 but removed for IA24
          // 'consequence.transcript.annotation.vep_impact',
          // 'consequence.transcript.annotation.sift_impact',
          // 'consequence.transcript.annotation.polyphen_impact',
          'consequence.transcript.consequence_type',
          'mutation_subtype',
        ],
        fieldsConfig: {},
      },
    ],
  };

  // Set the facet definitions based on the data only the first time the data is loaded
  const getEnumFacetData = useDeepCompareCallback(
    (field: string) => {
      let filters = undefined;
      let combineMode: CombineMode = 'or';
      if (field in genomicFilters.root) {
        if (isIntersection(genomicFilters.root[field])) {
          const intersectionFilters = removeIntersectionFromEnum(
            genomicFilters.root[field],
          );
          if (intersectionFilters) {
            filters = extractEnumFilterValue(intersectionFilters);
            combineMode = 'and';
          }
        } else {
          filters = extractEnumFilterValue(genomicFilters.root[field]);
        }
      }

      return {
        data: processBucketData(facetData?.[field]),
        enumFilters: filters,
        combineMode: combineMode,
        isSuccess: isFacetsQuerySuccess,
        isFetching: isFacetsQueryFetching,
      };
    },
    [genomicFilters.root, facetData, isFacetsQuerySuccess],
  );

  useGenesFacets(
    'gene',
    FilterFacets.filter((f) => f.index === 'genes').map((x) =>
      x.field.includes('upload') ? x.field.split('.upload').join('') : x.field,
    ),
    isDemoMode,
  );
  useGenesFacets(
    'ssm',
    FilterFacets.filter((f) => f.index === 'ssms').map((x) =>
      x.field.includes('upload') ? x.field.split('.upload').join('') : x.field,
    ),
    isDemoMode,
  );

  const facetDefinitions = (
    FilterFacets satisfies Array<FacetDefinition>
  ).reduce((acc: Record<string, FacetDefinition>, facet) => {
    acc[facet.field] = facet;
    return acc;
  }, {});

  const allFiltersCollapsed = useAllFiltersCollapsed();
  const toggleAllFiltersExpanded = useToggleAllFilters();
  const filtersAppliedCount = useAppSelector(selectFiltersAppliedCount);
  const clearAllFilters = useClearAllGenomicFilters();

  const GenomicFilterHooks: Record<
    'enum' | 'upload' | 'toggle',
    | FacetHooks
    | EnumFacetDataHooks
    | UploadFacetDataHooks
    | ToggleFacetDataHooks
  > = {
    enum: {
      useGetFacetData: getEnumFacetData,
      useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
      useClearFilter: useClearGenomicFilters,
      useTotalCounts: useTotalGenomicCounts,
      useGetFacetFilters: useGenomicFilterByName,
      useToggleExpandFilter: useToggleExpandFilter,
      useFilterExpanded: useFilterExpandedState,
      useFieldNameToTitle,
    },
    upload: {
      useFilterItems: useUploadFilterItems as any,
      useClearFilter: useClearGenomicFilters,
      useFieldNameToTitle,
      useOpenUploadModal: useOpenUploadModal,
      useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
      useGetFacetFilters: useGenomicFilterByName,
      useGetFacetData: () => ({
        data: {},
        enumFilters: undefined,
        isSuccess: true,
        isFetching: false
      })
    },
    toggle: {
      useGetFacetData: getEnumFacetData,
      useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
      useClearFilter: useClearGenomicFilters,
      useTotalCounts: useTotalGenomicCounts,
      useGetFacetFilters: useGenomicFilterByName,
      useToggleExpandFilter: useToggleExpandFilter,
      useFilterExpanded: useFilterExpandedState,
      useFieldNameToTitle,
    } satisfies ToggleFacetDataHooks,
  };

  return (
    <>
      <DropdownPanel
        filters={filters}
        facetDefinitions={facetDefinitions}
        facetDataHooks={GenomicFilterHooks as any}
        showAccessLevel={false}
        tabTitle={'Genomic Filters'}
        allFiltersCollapsed={allFiltersCollapsed}
        toggleAllFiltersExpanded={toggleAllFiltersExpanded}
        clearAllFilters={clearAllFilters}
        valueLabel={GenomicValueLabel}
      />
    </>
  );
};
export default GeneAndSSMFilterPanel;
