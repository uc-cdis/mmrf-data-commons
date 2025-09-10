import {
  FacetQueryParameters,
  FacetQueryResponse,
  FileCountsQueryParameters,
  FilesSizeData,
} from './types';
import {
  Accessibility,
  customQueryStrForField,
  useGeneralGQLQuery,
  useGetAggsQuery,
  useCoreSelector,
  useCoreDispatch,
  CoreState,
  selectCohortFilterExpanded,
  CombineMode,
  setCohortFilterCombineMode,selectCohortFilterCombineMode,toggleCohortBuilderCategoryFilter
} from '@gen3/core';
import { getByPath} from '@gen3/frontend';
import { useState } from 'react';
import { useDeepCompareEffect } from 'use-deep-compare';
import {
  convertFilterSetToNestedGqlFilter,
} from '@/core/utils/filters';


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

const buildFileStatsdQuery = (
  type: string,
  fileSizeField: string,
  cohortItemIdField: string,
  fileItemIdField: string,
  indexPrefix: string = '',
) => {
  const fileStatsQuery = `query repositoryTotals ($filter: JSON, $accessibility:${indexPrefix}Accessibility) {
    ${indexPrefix}_aggregation {
        ${type} (accessibility: $accessibility, filter: $filter) {
            ${customQueryStrForField(fileItemIdField, '{_totalCount }')}
             ${customQueryStrForField(fileSizeField, ' {  histogram {sum} }')}
                ${customQueryStrForField(cohortItemIdField, '{histogram { count }}')}
        }
    }
}`;
  return fileStatsQuery;
};
interface FileCountsQueryResponse {
  [aggregationKey: `${string}_aggregation`]: Record<
    string,
    Record<string, any>
  >;
}

export const useTotalFileSizeQuery = ({
  repositoryFilters,
  repositoryIndex,
  cohortIndex,
  fileSizeField,
  cohortItemIdField,
  fileItemIdField,
  accessibility = Accessibility.ALL,
  cohortIndexPrefix = '',
  repositoryIndexPrefix = '',
}: FileCountsQueryParameters) => {
  const [totals, setTotals] = useState<FilesSizeData>({
    totalFileSize: 0,
    totalCaseCount: 0,
    totalFileCount: 0,
  });
  const query = buildFileStatsdQuery(
    repositoryIndex,
    fileSizeField,
    cohortItemIdField,
    fileItemIdField,
    repositoryIndexPrefix,
  );

  const { data, isSuccess, isFetching, isError } = useGeneralGQLQuery({
    query,
    variables: {
      accessibility,
      filter: convertFilterSetToNestedGqlFilter(repositoryFilters),  // Must used nested for MMRF
    },
  });

  useDeepCompareEffect(() => {
    if (isSuccess) {
      const response = data.data as unknown as FileCountsQueryResponse;
      const countsRoot = getByPath(
        response?.[`${repositoryIndexPrefix}_aggregation`]?.[repositoryIndex],
        cohortItemIdField,
      );
      const totalFileSize =
        response?.[`${repositoryIndexPrefix}_aggregation`]?.[repositoryIndex]?.[
          fileSizeField
        ]?.histogram?.[0]?.sum || 0;
      const totalCaseCount = countsRoot?.histogram?.length || 0;
      const totalFileCount =
        response?.[`${repositoryIndexPrefix}_aggregation`]?.[repositoryIndex]?.[
          fileItemIdField
        ]?._totalCount || 0;
      setTotals({
        totalFileSize,
        totalCaseCount,
        totalFileCount,
      });
    }
  }, [data, isSuccess]);

  return {
    data: totals,
    isError,
    isFetching,
    isSuccess,
  };
};

export const useFilterExpandedState = (index: string, field: string) => {
  return useCoreSelector((state: CoreState) =>
    selectCohortFilterExpanded(state, index, field),
  );
};

export const useSetCohortFilterCombineState = (index: string) => {
  const dispatch = useCoreDispatch();
  return (field: string, mode: CombineMode) => {
    dispatch(setCohortFilterCombineMode({ index, field, mode }));
  };
};

export const useCohortFilterCombineState = (index: string, field: string) => {
  return useCoreSelector((state: CoreState) =>
    selectCohortFilterCombineMode(state, index, field),
  );
};

export const useToggleExpandFilter = (index: string) => {
  const dispatch = useCoreDispatch();
  return (field: string, expanded: boolean) => {
    dispatch(toggleCohortBuilderCategoryFilter({ index, field, expanded }));
  };
};
