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
  FacetDataHooks,
  processBucketData,
  removeIntersectionFromEnum,
  ToggleFacetDataHooks,
  UploadFacetDataHooks,
  useFieldNameToTitle,
} from '@gen3/frontend';
import { AppState, useAppSelector } from './appApi';
import { selectFiltersAppliedCount, selectGeneAndSSMFilters, } from './geneAndSSMFiltersSlice';
import { useDeepCompareCallback, useDeepCompareMemo } from 'use-deep-compare';
import { FacetQueryParameters, FacetQueryResponse } from '@/features/types';
import { COHORT_FILTER_INDEX, useGetCohortCentricAggsQuery } from '@/core';
import { mergeGeneAndSSMFilters, } from '@/features/genomic/utils';
import { separateGeneAndSSMFilters } from '@/core/genomic/genomicFilters';

/**
 *  Get the facet values for both the gene and ssm facets using the current cohort filters
 *  as case filters
 * @param geneFacets
 * @param ssmFacets
 * @param cohortFilters
 */
const useGetFacetValuesQuery = (
  geneFacets: FacetQueryParameters,
  ssmFacets: FacetQueryParameters,
  cohortFilters: GQLFilter,
): FacetQueryResponse => {

  const {
    data: geneData,
    isSuccess: geneIsSuccess,
    isFetching: geneIsFetching,
    isError: geneIsError,
  } = useGetCohortCentricAggsQuery({
    cohortFilter: cohortFilters,
    ...geneFacets,
  });
  const {
    data: ssmData,
    isSuccess: ssmIsSuccess,
    isFetching: ssmIsFetching,
    isError: ssmIsError,
  } = useGetCohortCentricAggsQuery({
    cohortFilter: cohortFilters,
    ...ssmFacets,
  });

  return {
    data: { ...(geneData ?? {}), ...(ssmData ?? {}) },
    isError: geneIsError || ssmIsError,
    isFetching: geneIsFetching || ssmIsFetching,
    isSuccess: geneIsSuccess || ssmIsSuccess,
  };
};

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


  const geneAndSSMFilters = useDeepCompareMemo(() => {

    const filters = separateGeneAndSSMFilters(genomicFilters);
    console.log('filters before mergeGeneAndSSMFilters', filters);
    return mergeGeneAndSSMFilters(filters);
  }, [genomicFilters])

  const {
    data: facetData,
    isSuccess: isFacetsQuerySuccess,
    isFetching: isFacetsQueryFetching,
    isError: isFacetsQueryError,
  } = useGetFacetValuesQuery(
    {
      type: 'gene_centric',
      fields: ['biotype', 'is_cancer_gene_census'],
      filter: geneAndSSMFilters.gene,
      indexPrefix: 'GeneCentric_',
      caseIdsFilterPath: "case.case_id"
    },
    {
      type: 'ssm_centric',
      fields: [
        'consequence.transcript.annotation.vep_impact',
        'consequence.transcript.annotation.sift_impact',
        'consequence.transcript.annotation.polyphen_impact',
        'consequence.transcript.consequence_type',
        'mutation_subtype',
      ],
      filter: geneAndSSMFilters.ssm,
      indexPrefix: 'SsmCentric_',
      caseIdsFilterPath: "occurrence.case.case_id"
    },
    cohortFilterGQL,
  );

  const filters = {
    tabs: [
      {
        title: 'Genes',
        fields: [
          'gene_id',
          'ssm_id',
          'biotype',
          'is_cancer_gene_census',
          'consequence.transcript.annotation.vep_impact',
          'consequence.transcript.annotation.sift_impact',
          'consequence.transcript.annotation.polyphen_impact',
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
    | FacetDataHooks
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
      />
    </>
  );
};
export default GeneAndSSMFilterPanel;
