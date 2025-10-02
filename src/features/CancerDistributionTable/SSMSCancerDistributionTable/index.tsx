import React from 'react';
import {

  useGetProjectsQuery,
} from '@/core';
import { useGetSSMSCancerDistributionTableQuery } from '@/core/features/cancerDistribution'
import { useCallback, useEffect, useState } from 'react';
import { ExpandedState, Row, SortingState } from '@tanstack/react-table';
import { useDeepCompareMemo } from 'use-deep-compare';
import {
  calculatePercentageAsNumber,
  statusBooleansToDataStatus,
} from '@/utils/index';
import useStandardPagination from '@/hooks/useStandardPagination';
import { HandleChangeInput } from '@/components/Table/types';
import VerticalTable from '@/components/Table/VerticalTable';
import TotalItems from '@/components/Table/TotalItem';
import FunctionButton from '@/components/FunctionButton';
import SubrowPrimarySiteDiseaseType from '@/components/SubrowPrimarySiteDiseaseType/SubrowPrimarySiteDiseaseType';
import { CancerDistributionSSMType } from '../types';
import { useSSMCancerDistributionColumns } from './useSSMCancerDistributionColumns';
import { handleJSONDownloadSSM, handleTSVDownloadSSM } from './utils';

export interface SSMSCancerDistributionTableProps {
  readonly ssms: string;
  readonly symbol: string;
}

const SSMSCancerDistributionTable: React.FC<
  SSMSCancerDistributionTableProps
> = ({ ssms, symbol }: SSMSCancerDistributionTableProps) => {
  // Added Apr 10 25 to get build to work
  interface SSMCancerDistributionData {
    [key: string]: any;
  }
  const { data, isFetching, isError, isSuccess } =
    useGetSSMSCancerDistributionTableQuery({ ssms });
  // Added Apr 10 25 to get build to work
  const ssmCancerDistributionData = data as SSMCancerDistributionData;
  const projectKeys = useDeepCompareMemo(
    () => ssmCancerDistributionData?.projects.map((p: any) => p.key) || [],
    [ssmCancerDistributionData],
  );

  const { data: projectsData, isFetching: projectsFetching } =
    useGetProjectsQuery({
      filters: {
        op: 'in',
        content: {
          field: 'project_id',
          value: projectKeys,
        },
      },
      expand: [
        'summary',
        'summary.data_categories',
        'summary.experimental_strategies',
        'program',
      ],
      size: ssmCancerDistributionData?.projects.length,
    });

  // added Apr 10 25 to address missing object type error projectsById[d.key]?.disease_type?.slice().sort() || [],
  interface ProjectsById {
    [key: string]: any;
  }
  const projectsById: ProjectsById = useDeepCompareMemo(
    () =>
      // Updated Apr 10 25 to get to build
      // (projectsData?.projectData || []).reduce(
      (projectsData[0]?.projectData || []).reduce(
        (acc, project) => ({
          ...acc,
          [project.project_id]: project,
        }),
        {},
      ),
    [projectsData],
  );

  const formattedData: CancerDistributionSSMType[] = useDeepCompareMemo(
    () =>
      isSuccess && !projectsFetching
        ? ssmCancerDistributionData?.projects.map((d: any) => {
            const row = {
              project: d.key,
              disease_type:
                projectsById[d.key]?.disease_type?.slice().sort() || [],
              primary_site:
                projectsById[d.key]?.primary_site?.slice().sort() || [],
              ssm_affected_cases: {
                numerator: ssmCancerDistributionData.ssmFiltered[d.key] || 0,
                denominator: ssmCancerDistributionData.ssmTotal[d.key] || 0,
              },
              ssm_affected_cases_percent: calculatePercentageAsNumber(
                ssmCancerDistributionData.ssmFiltered[d.key] || 0,
                ssmCancerDistributionData.ssmTotal[d.key] || 0,
              ),
            };
            return row;
          })
        : [],
    [ssmCancerDistributionData, projectsById, isSuccess, projectsFetching],
  );

  const [expanded, setExpanded] = useState<ExpandedState>({});
  // updated apr 10 25 to get build to work
  //   const [expandedColumnId, setExpandedColumnId] = useState(null);
  const [expandedColumnId, setExpandedColumnId] = useState('');
  const [expandedRowId, setExpandedRowId] = useState(null);

  const cancerDistributionTableColumns = useSSMCancerDistributionColumns({
    symbol,
    expandedColumnId,
    ssm_id: ssms,
  });

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: '#_ssm_affected_cases',
      desc: true,
    },
  ]);

  const getRowId = useCallback(
    (row: CancerDistributionSSMType) => row.project,
    [],
  );

  const {
    handlePageChange,
    handlePageSizeChange,
    handleSortByChange,
    page,
    pages,
    size,
    from,
    total,
    displayedData,
    updatedFullData,
  } = useStandardPagination(formattedData, cancerDistributionTableColumns);

  useEffect(() => handleSortByChange(sorting), [sorting, handleSortByChange]);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case 'newPageSize':
        handlePageSizeChange(obj.newPageSize as string);
        break;
      case 'newPageNumber':
        handlePageChange(obj.newPageNumber as number);
        break;
    }
  };

  const handleExpand = (
    row: Row<CancerDistributionSSMType>,
    columnId: string,
  ) => {
    if (
      Object.keys(expanded).length > 0 &&
      row.original.project === expandedRowId &&
      columnId === expandedColumnId
    ) {
      setExpanded({});
    }
    // updated april 10 25 to get build to work
    else if (row.original[columnId].length > 1) {
      setExpanded({ [row.original.project]: true });
      setExpandedColumnId(columnId);
      // updated april 10 25 to get build to work, added as any
      setExpandedRowId(row.original.project as any);
    }
  };

  return (
    <VerticalTable
      customDataTestID="SSMSCancerDistributionTable"
      data={displayedData}
      columns={cancerDistributionTableColumns}
      tableTotalDetail={
        <TotalItems total={formattedData?.length} itemName="project" />
      }
      columnSorting="manual"
      additionalControls={
        <div className="flex gap-2 mb-2">
          <FunctionButton
            onClick={() => handleJSONDownloadSSM(formattedData)}
            disabled={isFetching}
          >
            JSON
          </FunctionButton>
          <FunctionButton
            onClick={() =>
              handleTSVDownloadSSM(
                updatedFullData as any,
                cancerDistributionTableColumns as any,
              )
            }
            disabled={isFetching}
          >
            TSV
          </FunctionButton>
        </div>
      }
      expandableColumnIds={['disease_type', 'primary_site']}
      sorting={sorting}
      setSorting={setSorting}
      expanded={expanded}
      getRowCanExpand={() => true}
      setExpanded={handleExpand}
      renderSubComponent={({ row, clickedColumnId }) => (
        <SubrowPrimarySiteDiseaseType row={row} columnId={clickedColumnId} />
      )}
      pagination={{
        page,
        pages,
        size,
        from,
        total,
        label: 'project',
      }}
      status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
      handleChange={handleChange}
      getRowId={getRowId}
    />
  );
};

export default SSMSCancerDistributionTable;
