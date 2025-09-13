import React from "react";
import {
  useCoreSelector,
  Modals,
  selectCurrentModal,
  FacetDefinition,
  EmptyFilterSet,
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
import { DropdownPanel, useFieldNameToTitle, FacetDataHooks, EnumFacetDataHooks } from "@gen3/frontend";
import { useAppSelector } from "./appApi";
import { selectFiltersAppliedCount } from "./geneAndSSMFiltersSlice";
import {
  useOpenUploadModal,
  useUploadFilterItems,
} from "@/features/genomic/hooks";
import {
  FacetQueryParameters,
  FacetQueryResponse,
} from '@/features/Repository/types';

export const useGetFacetValuesQuery = (
  args: FacetQueryParameters,
): FacetQueryResponse => {
  const { data, isSuccess, isFetching, isError } = useGetAggsQuery(args);

  return {
    data: data ?? {},
    isError,
    isFetching,
    isSuccess,
  };
};

const GeneAndSSMFilterPanel = ({
  isDemoMode = false,
}: {
  isDemoMode?: boolean;
}): JSX.Element => {
  const modal = useCoreSelector((state) => selectCurrentModal(state));
  const updateFilters = useUpdateGenomicEnumFacetFilter();

  const {
    data: geneFacetData,
    isSuccess: isGeneFacetsQuerySuccess,
    isFetching: isGeneFacetsQueryFetching,
    isError: isGeneFacetsQueryError,
  } = useGetFacetValuesQuery({
    type: "genomic",
    fields: [],
    filters: EmptyFilterSet,
    indexPrefix: "Genes_",
  });

  const filters = {
    tabs: [
      {
        title: "Genes",
        fields: [
          "genes.biotype",
          "ssms.consequence.transcript.annotation.vep_impact"
        ],
        fieldsConfig: {}
      }
    ]
  }


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

  const GenomicFilterHooks : Record<'enum', FacetDataHooks | EnumFacetDataHooks> = { enum : {
    useGetFacetData: useGenesFacetValues,
    useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
    useClearFilter: useClearGenomicFilters,
    useTotalCounts: useTotalGenomicCounts,
    useGetFacetFilters: useGenomicFilterByName,
    useToggleExpandFilter: useToggleExpandFilter,
    useFilterExpanded: useFilterExpandedState,
    useFieldNameToTitle,
  }};

  return (
    <>
      <DropdownPanel<'enum'>
        index="genomic"
        filters={filters}
        facetDefinitions={facetDefinitions}
        facetDataHooks={GenomicFilterHooks}
        showAccessLevel={false}
        tabTitle={"Genomic Filters"}
      />
    </>
  );
};
export default GeneAndSSMFilterPanel;
