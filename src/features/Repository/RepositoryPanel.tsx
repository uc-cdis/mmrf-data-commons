import React, { useMemo, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import {
  Accessibility,
  CoreState,
  EmptyFilterSet,
  selectIndexFilters,
  useCoreSelector,
} from '@gen3/core';
import {
  ExplorerTable,
  DownloadsPanel,
  TableXPositionContext,
  getAllFieldsFromFilterConfigs,
} from '@gen3/frontend';
import { useTotalFileSizeQuery } from './hooks';
import Stats from './Stats';
import FileFacetPanel from './FileFacetPanel';
import { RepositoryProps } from './types';
import RepositoryDownloadsPanel from './RepositoryDownloadsPanel';

export const RepositoryPanel = ({
  guppyConfig,
  filters,
  table,
  dropdowns,
  buttons,
  loginForDownload,
  fileStatsConfiguration,
  additionalControls = null,
}: RepositoryProps) => {
  const isSm = useMediaQuery('(min-width: 639px)');
  const isMd = useMediaQuery('(min-width: 1373px)');
  const isXl = useMediaQuery('(min-width: 1600px)');
  const [tableXPosition, setTableXPosition] = useState<number | undefined>(
    undefined,
  );
  const defaultDropdowns = useMemo(() => dropdowns ?? {}, [dropdowns]);
  const defaultButtons = useMemo(() => buttons ?? [], [buttons]);

  const [accessLevel, setAccessLevel] = useState<Accessibility>(
    Accessibility.ALL,
  );

  const index = guppyConfig.dataType;
  const indexPrefix = guppyConfig?.indexPrefix ?? '';
  const fields = useMemo(
    () => getAllFieldsFromFilterConfigs(filters?.tabs ?? []),
    [filters?.tabs],
  );

  const repositoryFilters = useCoreSelector((state: CoreState) =>
    selectIndexFilters(state, index),
  );

  const { data: fileSizeSliceData, isFetching: isFileSizeFetching } =
    useTotalFileSizeQuery({
      repositoryFilters: repositoryFilters,
      cohortFilters: EmptyFilterSet,
      repositoryIndexPrefix: indexPrefix,
      ...fileStatsConfiguration,
    });

  if (fileStatsConfiguration)
    return (
      <TableXPositionContext.Provider
        value={{ xPosition: tableXPosition, setXPosition: setTableXPosition }}
      >
        <div className="flex flex-col mt-3 relative px-4 bg-base-lightest w-full">
          {/* Flex container to ensure proper 25/75 split */}
          <div className="flex w-full pt-2">
            {/* Left panel - 25% */}
            <div
              id="cohort-builder-filters"
              className="flex-shrink-0 md:w-1/4 lg:w-1/5"
            >
              {filters?.tabs && (
                <FileFacetPanel
                  index={index}
                  filters={filters}
                  tabTitle="Files"
                  fieldMapping={guppyConfig?.fieldMapping ?? []}
                  indexPrefix={indexPrefix}
                />
              )}
            </div>

            {/* Right content - 75% */}
            <div
              id="cohort-builder-content"
              className="flex flex-col md:w-3/4 lg:w-4/5 pl-4"
            >
              <RepositoryDownloadsPanel localFilters={repositoryFilters}  fileDataFetching={isFileSizeFetching}

              />
              {/* Table Section */}
              {table?.enabled && (
                <ExplorerTable
                  index={index}
                  tableConfig={table}
                  accessibility={accessLevel}
                  indexPrefix={indexPrefix}
                  additionalControls={
                    <DownloadsPanel
                      dropdowns={defaultDropdowns}
                      buttons={defaultButtons}
                      loginForDownload={loginForDownload}
                      index={index}
                      totalCount={fileSizeSliceData.totalCaseCount ?? 0}
                      fields={table?.fields ?? []}
                      filter={repositoryFilters}
                    />
                  }
                  tableTotalDetail={
                    <div className="ml-auto">
                      <Stats
                        totalFileCount={fileSizeSliceData.totalFileCount}
                        totalCaseCount={fileSizeSliceData.totalCaseCount}
                        totalFileSize={fileSizeSliceData.totalFileSize}
                        isFetching={isFileSizeFetching}
                      />
                    </div>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </TableXPositionContext.Provider>
    );
};

export default RepositoryPanel;
