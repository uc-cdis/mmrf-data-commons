import React from "react";
import { useCoreSelector, Modals, selectCurrentModal, FacetDefinition } from '@gen3/core';
import FilterFacets from "@/features/genomic/filters.json";
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
import { FacetDocTypeToLabelsMap } from "@/features/facets/hooks";
import FiltersPanel as FilterPanel, useFieldNameToTitle }  from "@gen3/frontend";
import { useAppSelector } from "./appApi";
import { selectFiltersAppliedCount } from "./geneAndSSMFiltersSlice";
import { useSearchEnumTerms } from "../cohortBuilder/hooks";
import {
  useOpenUploadModal,
  useUploadFilterItems,
} from "@/features/genomic/hooks";

const GeneAndSSMFilterPanel = ({
  isDemoMode,
}: {
  isDemoMode: boolean;
}): JSX.Element => {
  const modal = useCoreSelector((state) => selectCurrentModal(state));
  const updateFilters = useUpdateGenomicEnumFacetFilter();

  useGenesFacets(
    "genes",
    "explore",
    FilterFacets.filter((f) => f.queryOptions.docType === "genes").map((x) =>
      x.field.includes("upload") ? x.field.split(".upload").join("") : x.field,
    ),
    isDemoMode,
  );
  useGenesFacets(
    "ssms",
    "explore",
    FilterFacets.filter((f) => f.queryOptions.docType === "ssms").map((x) =>
      x.field.includes("upload") ? x.field.split(".upload").join("") : x.field,
    ),
    isDemoMode,
  );

  const allFiltersCollapsed = useAllFiltersCollapsed();
  const toggleAllFiltersExpanded = useToggleAllFilters();
  const filtersAppliedCount = useAppSelector(selectFiltersAppliedCount);
  const clearAllFilters = useClearAllGenomicFilters();

  const GenomicFilterHooks = {
    useGetEnumFacetData: useGenesFacetValues,
    useUpdateFacetFilters: useUpdateGenomicEnumFacetFilter,
    useClearFilter: useClearGenomicFilters,
    useTotalCounts: useTotalGenomicCounts,
    useGetFacetFilters: useGenomicFilterByName,
    useToggleExpandFilter: useToggleExpandFilter,
    useFilterExpanded: useFilterExpandedState,
    useFieldNameToTitle,
    useSearchEnumTerms,
    useOpenUploadModal,
    useFilterItems: useUploadFilterItems,
    useFormatValue,
  };

  return (
    <>
      <FiltersPanel
        facetDefinitions={FilterFacets as FacetDefinition[]}
        facetHooks={GenomicFilterHooks}
        valueLabel={({ index }: { index: string }) =>
          FacetDocTypeToLabelsMap[docType]
        }
        app="genes-mutations-app"
        toggleAllFiltersExpanded={toggleAllFiltersExpanded}
        allFiltersCollapsed={allFiltersCollapsed}
        hideIfEmpty={false}
        showPercent={false}
        filtersAppliedCount={filtersAppliedCount}
        handleClearAll={clearAllFilters}
      />
    </>
  );
};
export default GeneAndSSMFilterPanel;
