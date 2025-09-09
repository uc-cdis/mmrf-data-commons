import React, { useMemo, useState } from 'react';
import {
  useDeepCompareCallback,
  useDeepCompareEffect,
  useDeepCompareMemo,
} from 'use-deep-compare';
import {
  Accessibility,
  CombineMode,
  CoreState,
  extractEnumFilterValue,
  FacetDefinition,
  isIntersection,
  selectIndexFilters,
  useCoreSelector,
} from '@gen3/core';

import {
  classifyFacets,
  EnumFacetDataHooks,
  FacetDataHooks,
  FieldToName,
  DropdownPanel,
  getAllFieldsFromFilterConfigs,
  processBucketData,
  removeIntersectionFromEnum,
  useClearFilters,
  useFieldNameToTitle,
  useGetFacetFilters,
  useUpdateFilters,
  FacetSortType,
  ErrorCard
} from '@gen3/frontend';
import { partial } from 'lodash';
import {
  useFilterExpandedState,
  useToggleExpandFilter,
  useCohortFilterCombineState,
  useSetCohortFilterCombineState,
} from './hooks';
import { useGetFacetValuesQuery } from './hooks';
import { selectCohortFilters } from '@gen3/core';
import { TabsConfig } from '@gen3/frontend';



interface GeneAndSSMFilterPanelProps {
  filters: TabsConfig;
  geneFacets: Record<string, FacetDefinition>
  ssmFacets:  Record<string, FacetDefinition>;
}

export const GeneAndSSMFilterPanel = ({
  geneFacets, ssmFacets, filters,
}: GeneAndSSMFilterPanelProps): JSX.Element => {
  const index = "geneAndSSM";
  const cohortFilters = useCoreSelector((state: CoreState) => selectCohortFilters(state));
  const geneFilters = useCoreSelector((state: CoreState) =>
    selectIndexFilters(state, "gene"),
  );
  const ssmFilter = useCoreSelector((state: CoreState) =>
    selectIndexFilters(state, "ssm"),
  );
  const [accessLevel, setAccessLevel] = useState<Accessibility>(
    Accessibility.ALL,
  );

  const fields = useMemo(
    () => getAllFieldsFromFilterConfigs(filters?.tabs ?? []),
    [filters?.tabs],
  );

  const facetDefinitions = {...geneFacets, ...ssmFacets};

  const {
    data: facetData,
    isSuccess: isFacetsQuerySuccess,
    isFetching: isFacetsQueryFetching,
    isError: isFacetsQueryError,
  } = useGetFacetValuesQuery({
    type: index,
    fields: fields,
    filters: geneFilters,
    indexPrefix: indexPrefix,
  });


  const getEnumFacetData = useDeepCompareCallback(
    (field: string) => {
      let filters = undefined;
      let combineMode: CombineMode = 'or';
      if (field in geneFilters.root) {
        if (isIntersection(geneFilters.root[field])) {
          const intersectionFilters = removeIntersectionFromEnum(
            geneFilters.root[field],
          );
          if (intersectionFilters) {
            filters = extractEnumFilterValue(intersectionFilters);
            combineMode = 'and';
          }
        } else {
          filters = extractEnumFilterValue(geneFilters.root[field]);
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
    [geneFilters.root, facetData, isFacetsQuerySuccess],
  );

  const facetDataHooks: Record<'enum', FacetDataHooks | EnumFacetDataHooks> =
    useDeepCompareMemo(() => {
      return {
        enum: {
          useGetFacetData: getEnumFacetData,
          useUpdateFacetFilters: partial(useUpdateFilters, index),
          useGetFacetFilters: partial(useGetFacetFilters, index),
          useClearFilter: partial(useClearFilters, index),
          useFilterExpanded: partial(useFilterExpandedState, index),
          useToggleExpandFilter: partial(useToggleExpandFilter, index),
          useGetCombineMode: partial(useCohortFilterCombineState, index),
          useSetCombineMode: partial(useSetCohortFilterCombineState, index),
          useFieldNameToTitle: useFieldNameToTitle,
          useTotalCounts: undefined,
          useUpdateCombineMode: () => null,
        },
      };
    }, [getEnumFacetData, index]);

  if (isFacetsQueryError) {
    return <ErrorCard message="Unable to fetch data from server" />; // TODO: replace with configurable message
  }

  return (
    <DropdownPanel<'enum'>
      index={"geneAndSSM"}
      filters={filters}
      facetDefinitions={facetDefinitions}
      facetDataHooks={facetDataHooks}
      showAccessLevel={false}
      tabTitle={"Genomic Filters"}
      onAccessChange={setAccessLevel}
      accessLevel={accessLevel}
    />
  );
};

export default GeneAndSSMFilterPanel;
