import React, { useCallback, useMemo, useState } from 'react';
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
  convertFilterSetToGqlFilter,
  selectAllCohortFiltersCollapsed,
  toggleCohortBuilderAllFilters,
  useCoreDispatch,
  useCoreSelector,
  clearCohortFilters
} from '@gen3/core';

import {
  classifyFacets,
  EnumFacetDataHooks,
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
  ErrorCard,
  FacetHooks,
} from '@gen3/frontend';
import { partial } from 'lodash';
import {
  useCohortFilterCombineState,
  useFilterExpandedState,
  useSetCohortFilterCombineState,
  useToggleExpandFilter,
} from './hooks';
import { useGetFacetValuesQuery } from './hooks';
import { StylingOverride} from '@/features/types/styling';
import { COHORT_FILTER_INDEX } from '@/core';


export interface TabConfig {
  title: string;
  fields: ReadonlyArray<string>; // list of fields
  fieldsConfig: Record<string, FacetDefinition>; // extra/override configuration
  classNames?: StylingOverride;
  defaultSort?: FacetSortType;
}

export interface TabsConfig {
  readonly tabs: ReadonlyArray<TabConfig>;
}

interface FileFacetPanelProps {
  filters: TabsConfig;
  index: string;
  fieldMapping?: ReadonlyArray<FieldToName>;
  tabTitle: string;
  indexPrefix?: string;
}

export const FileFacetPanel = ({
  filters,
  index,
  tabTitle,
  fieldMapping,
  indexPrefix = '',
}: FileFacetPanelProps): JSX.Element => {

  const coreDispatch = useCoreDispatch();


  const repositoryFilters = useCoreSelector((state: CoreState) =>
    selectIndexFilters(state, index),
  );

  const cohortFilters = useCoreSelector((state: CoreState) =>
    selectIndexFilters(state, COHORT_FILTER_INDEX),
  );

  const cohortFilterGQL = convertFilterSetToGqlFilter(cohortFilters)

  const fields = useMemo(
    () => getAllFieldsFromFilterConfigs(filters?.tabs ?? []),
    [filters?.tabs],
  );

  const [accessLevel, setAccessLevel] = useState<Accessibility>(
    Accessibility.ALL,
  );

  const [facetDefinitions, setFacetDefinitions] = useState<
    Record<string, FacetDefinition>
  >({});

  const allFiltersCollapsed = useCoreSelector((state) =>
    selectAllCohortFiltersCollapsed(state, index),
  );

  const toggleAllFiltersExpanded = (expand: boolean) => {
    coreDispatch(toggleCohortBuilderAllFilters({ expand, index }));
  };

  const clearAllFilters = useCallback(() => {
    coreDispatch(clearCohortFilters({ index }));
  }, [coreDispatch, index]);


  const {
    data: facetData,
    isSuccess: isFacetsQuerySuccess,
    isFetching: isFacetsQueryFetching,
    isError: isFacetsQueryError,
  } = useGetFacetValuesQuery({
    cohortFilter: cohortFilterGQL,
    type: index,
    fields: fields,
    filter: repositoryFilters,
    caseIdsFilterPath: "cases.case_id",
    indexPrefix: indexPrefix,
  });

  // Set the facet definitions based on the data only the first time the data is loaded
  useDeepCompareEffect(() => {
    if (isFacetsQuerySuccess && Object.keys(facetDefinitions).length === 0) {
      const configFacetDefs = filters?.tabs.reduce(
        (acc: Record<string, FacetDefinition>, tab: any) => {
          return { ...tab.fieldsConfig, ...acc };
        },
        {},
      );
      console.log("classifyFacets", facetData, index, fieldMapping, configFacetDefs)
      const facetDefs = classifyFacets(
        facetData,
        index,
        fieldMapping ?? [],
        configFacetDefs ?? {},
      );
      setFacetDefinitions(facetDefs);
    }
  }, [isFacetsQuerySuccess, facetData, facetDefinitions, index, fieldMapping]);

  const getEnumFacetData = useDeepCompareCallback(
    (field: string) => {
      let filters = undefined;
      let combineMode: CombineMode = 'or';
      if (field in repositoryFilters.root) {
        if (isIntersection(repositoryFilters.root[field])) {
          const intersectionFilters = removeIntersectionFromEnum(
            repositoryFilters.root[field],
          );
          if (intersectionFilters) {
            filters = extractEnumFilterValue(intersectionFilters);
            combineMode = 'and';
          }
        } else {
          filters = extractEnumFilterValue(repositoryFilters.root[field]);
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
    [repositoryFilters.root, facetData, isFacetsQuerySuccess],
  );

  const facetDataHooks: Record<'enum', FacetHooks | EnumFacetDataHooks> =
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
      filters={filters}
      facetDefinitions={facetDefinitions}
      facetDataHooks={facetDataHooks}
      showAccessLevel={false}
      tabTitle={tabTitle}
      onAccessChange={setAccessLevel}
      accessLevel={accessLevel}
      allFiltersCollapsed={allFiltersCollapsed}
      toggleAllFiltersExpanded={toggleAllFiltersExpanded}
      clearAllFilters={clearAllFilters}
    />
  );
};

export default FileFacetPanel;
