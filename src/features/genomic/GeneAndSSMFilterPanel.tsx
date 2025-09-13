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
  geneFacets: FacetQueryParameters,
  ssmFacets: FacetQueryParameters,
): FacetQueryResponse => {



  const { data: geneData, isSuccess: geneIsSuccess, isFetching: geneIsFetching, isError: geneIsError } = useGetAggsQuery(geneFacets);
  const { data: ssmData, isSuccess: ssmIsSuccess, isFetching: ssmIsFetching, isError: ssmIsError } = useGetAggsQuery(ssmFacets);
  return {
    data: geneData ?? {},
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

  const {
    data: geneFacetData,
    isSuccess: isGeneFacetsQuerySuccess,
    isFetching: isGeneFacetsQueryFetching,
    isError: isGeneFacetsQueryError,
  } = useGetFacetValuesQuery(
    {
      type: 'gene',
      fields: ['biotype'],
      filters: EmptyFilterSet,
      indexPrefix: 'Gene_',
    },
    {
      type: 'ssm',
      fields: [
        'consequence.transcript.annotation.vep_impact',
        'consequence.transcript.annotation.sift_impact',
        'consequence.transcript.annotation.polyphen_impact',
        'consequence.transcript.annotation.sift_impact',
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
