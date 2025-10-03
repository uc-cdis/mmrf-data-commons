import React from "react";
import {
  useCoreSelector,
  Modals,
  selectCurrentModal,
  FacetDefinition,
  EmptyFilterSet,
  CombineMode,
  isIntersection,
  extractEnumFilterValue,
  CoreState,
  selectIndexFilters,
  buildNestedFilterForOperation,
} from '@gen3/core';
import  FilterFacets from "@/features/genomic/filters";
import {
  useClearGenomicFilters,
  useGenesFacets,
  useUpdateGenomicEnumFacetFilter,
  useGenomicFilterByName,
  useGenomicFacetFilter,
  useGenesFacetValues,
  useAllFiltersCollapsed,
  useToggleAllFilters,
  useToggleExpandFilter,
  useFilterExpandedState,
  useTotalGenomicCounts,
  useClearAllGenomicFilters,
} from "@/features/genomic/hooks";
import { useGetAggsQuery } from '@gen3/core';
import {
  DropdownPanel,
  useFieldNameToTitle,
  FacetDataHooks,
  EnumFacetDataHooks,
  UploadFacetHooks,
  removeIntersectionFromEnum,
  processBucketData,
  classifyFacets,
} from '@gen3/frontend';
import { AppState, useAppSelector } from './appApi';
import {
  selectFiltersAppliedCount,
  selectGeneAndSSMFilters,
} from './geneAndSSMFiltersSlice';
import {
  useOpenUploadModal,
  useUploadFilterItems,
} from "@/features/genomic/hooks";
import {
  FacetQueryParameters,
  FacetQueryResponse,
} from '@/features/Repository/types';
import { useDeepCompareCallback, useDeepCompareEffect } from 'use-deep-compare';


// TODO move to hooks
 const useGetFacetValuesQuery = (
  geneFacets: FacetQueryParameters,
  ssmFacets: FacetQueryParameters,
): FacetQueryResponse => {

  const { data: geneData, isSuccess: geneIsSuccess, isFetching: geneIsFetching, isError: geneIsError } = useGetAggsQuery(geneFacets);
  const { data: ssmData, isSuccess: ssmIsSuccess, isFetching: ssmIsFetching, isError: ssmIsError } = useGetAggsQuery(ssmFacets);

  return {
    data: { ...(geneData ?? {}) , ...(ssmData ?? {}) },
    isError : geneIsError || ssmIsError,
    isFetching: geneIsFetching || ssmIsFetching,
    isSuccess: geneIsSuccess || ssmIsSuccess,
  };
};

const GeneAndSSMFilterPanel = ({
  isDemoMode = false,
}: {
  isDemoMode?: boolean;
}): JSX.Element => {
  const modal = useCoreSelector((state) => selectCurrentModal(state));
  const updateFilters = useUpdateGenomicEnumFacetFilter();

  const genomicFilters = useAppSelector((state: AppState) => selectGeneAndSSMFilters(state));

  const {
    data: facetData,
    isSuccess: isFacetsQuerySuccess,
    isFetching: isFacetsQueryFetching,
    isError: isFacetsQueryError,
  } = useGetFacetValuesQuery(
    {
      type: 'gene',
      fields: ['biotype'],
      filters: { mode: 'and', root: { "is_cancer_gene_census" :
          //@ts-expect-error type is wrong
            { operator: '=', field: "is_cancer_gene_census", operand: true} }},
      indexPrefix: 'Gene_',
    },
    {
      type: 'ssm',
      fields: [
        'gene_id',
        'ssm_id',
        'consequence.transcript.annotation.vep_impact',
        'consequence.transcript.annotation.sift_impact',
        'consequence.transcript.annotation.polyphen_impact',
        'consequence.transcript.consequence_type',
        'mutation_subtype'
      ],
      filters: EmptyFilterSet,
      indexPrefix: 'Ssm_',
    },
  );

  const filters = {
    tabs: [
      {
        title: "Genes",
        fields: [
          'gene_id',
          'ssm_id',
          "biotype",
          "consequence.transcript.annotation.vep_impact",
          'consequence.transcript.annotation.sift_impact',
          'consequence.transcript.annotation.polyphen_impact',
          'consequence.transcript.consequence_type',
          'mutation_subtype'
        ],
        fieldsConfig: {}
      }
    ]
  }

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
    "gene",
    FilterFacets.filter((f) => f.index === "genes").map((x) =>
      x.field.includes("upload") ? x.field.split(".upload").join("") : x.field,
    ),
    isDemoMode,
  );
  useGenesFacets(
    "ssm",
    FilterFacets.filter((f) => f.index === "ssms").map((x) =>
      x.field.includes("upload") ? x.field.split(".upload").join("") : x.field,
    ),
    isDemoMode,
  );

  const facetDefinitions = (FilterFacets satisfies Array<FacetDefinition>).reduce((acc: Record<string, FacetDefinition>, facet) => {
    acc[facet.field] = facet;
    return acc;
  }, {})

  const allFiltersCollapsed = useAllFiltersCollapsed();
  const toggleAllFiltersExpanded = useToggleAllFilters();
  const filtersAppliedCount = useAppSelector(selectFiltersAppliedCount);
  const clearAllFilters = useClearAllGenomicFilters();


  const GenomicFilterHooks : Record<'enum' | 'upload', FacetDataHooks | EnumFacetDataHooks | UploadFacetHooks> = {
    enum : {
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

    }
  };

  return (
    <>
      <DropdownPanel
        index="genomic"
        filters={filters}
        facetDefinitions={facetDefinitions}
        facetDataHooks={GenomicFilterHooks as any}
        showAccessLevel={false}
        tabTitle={"Genomic Filters"}
      />
    </>
  );
};
export default GeneAndSSMFilterPanel;
