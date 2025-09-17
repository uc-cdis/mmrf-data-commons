import React from 'react';
import { FilterSet } from '@gen3/core';
import { useGetProjectsQuery } from '@/core';
import { useGetGeneCancerDistributionTableQuery } from '@/core/features/cancerDistribution';
import { useCallback, useEffect, useState } from 'react';
import {
  ColumnOrderState,
  ExpandedState,
  Row,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
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
import { CancerDistributionGeneType } from '../types';
import { useGeneCancerDistributionColumns } from './useGeneCancerDistributionColumns';
import { handleJSONDownloadGene, handleTSVDownloadGene } from './utils';

export interface GeneCancerDistributionTableProps {
  readonly gene: string;
  readonly symbol: string;
  readonly genomicFilters?: FilterSet;
  readonly cohortFilters?: FilterSet;
}
const GeneCancerDistributionTable: React.FC<
  GeneCancerDistributionTableProps
> = ({
  gene,
  symbol,
  genomicFilters = undefined,
  cohortFilters = undefined,
}: GeneCancerDistributionTableProps) => {
  const {
    data: geneCancerDistributionData = {} as any,
    isFetching,
    isError,
    isSuccess,
  } = useGetGeneCancerDistributionTableQuery({
    gene,
    genomicFilters,
    cohortFilters,
  });
  console.log('geneCancerDistributionData', geneCancerDistributionData);

  const projectKeys = useDeepCompareMemo(
    () => geneCancerDistributionData?.projects?.map((p: any) => p.key) || [],
    [geneCancerDistributionData],
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
      size: geneCancerDistributionData?.projects?.length,
    });

  const projectsById: any = useDeepCompareMemo(
    () =>
      // updated from projectsData?.projectData to get project to compile 5/14/25
      (projectsData[0]?.projectData || []).reduce(
        (acc, project) => ({
          ...acc,
          [project.project_id]: project,
        }),
        {},
      ),
    [projectsData],
  );

  const formattedData: CancerDistributionGeneType[] = useDeepCompareMemo(
    () =>
      isSuccess && !projectsFetching
        ? geneCancerDistributionData?.projects.map((d: any) => {
            const row = {
              project: d.key,
              disease_type:
                projectsById[d.key]?.disease_type?.slice().sort() || [],
              primary_site:
                projectsById[d.key]?.primary_site?.slice().sort() || [],
              ssm_affected_cases: {
                numerator: geneCancerDistributionData.ssmFiltered[d.key] || 0,
                denominator: geneCancerDistributionData.ssmTotal[d.key] || 0,
              },
              ssm_affected_cases_percent: calculatePercentageAsNumber(
                geneCancerDistributionData.ssmFiltered[d.key] || 0,
                geneCancerDistributionData.ssmTotal[d.key] || 0,
              ),
              cnv_amplifications: {
                numerator:
                  geneCancerDistributionData.cnvAmplification[d.key] || 0,
                denominator: geneCancerDistributionData.cnvTotal[d.key] || 0,
              },
              cnv_amplifications_percent: calculatePercentageAsNumber(
                geneCancerDistributionData.cnvAmplification[d.key] || 0,
                geneCancerDistributionData.cnvTotal[d.key] || 0,
              ),

              cnv_gains: {
                numerator: geneCancerDistributionData.cnvGain[d.key] || 0,
                denominator: geneCancerDistributionData.cnvTotal[d.key] || 0,
              },
              cnv_gains_percent: calculatePercentageAsNumber(
                geneCancerDistributionData.cnvGain[d.key] || 0,
                geneCancerDistributionData.cnvTotal[d.key] || 0,
              ),

              cnv_heterozygous_deletions: {
                numerator: geneCancerDistributionData.cnvLoss[d.key] || 0,
                denominator: geneCancerDistributionData.cnvTotal[d.key] || 0,
              },
              cnv_heterozygous_deletions_percent: calculatePercentageAsNumber(
                geneCancerDistributionData.cnvLoss[d.key] || 0,
                geneCancerDistributionData.cnvTotal[d.key] || 0,
              ),

              cnv_homozygous_deletions: {
                numerator:
                  geneCancerDistributionData.cnvHomozygousDeletion[d.key] || 0,
                denominator: geneCancerDistributionData.cnvTotal[d.key] || 0,
              },
              cnv_homozygous_deletions_percent: calculatePercentageAsNumber(
                geneCancerDistributionData.cnvHomozygousDeletion[d.key] || 0,
                geneCancerDistributionData.cnvTotal[d.key] || 0,
              ),

              num_mutations:
                (geneCancerDistributionData.ssmFiltered[d.key] || 0) === 0
                  ? 0
                  : d.count,
            };
            return row;
          })
        : [],
    [geneCancerDistributionData, projectsById, isSuccess, projectsFetching],
  );

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [expandedColumnId, setExpandedColumnId] = useState('');
  const [expandedRowId, setExpandedRowId] = useState(null);

  const cancerDistributionTableColumns = useGeneCancerDistributionColumns({
    isGene: true,
    symbol,
    expandedColumnId,
    gene_id: gene,
    cohortFilters,
    genomicFilters,
  });

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: '#_ssm_affected_cases', // need to be column ids
      desc: true,
    },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    '#_cnv_gains': false,
    '#_cnv_heterozygous_deletions': false,
  });
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    cancerDistributionTableColumns.map((column) => column.id as any), //must start out with populated columnOrder so we can splice
  );

  const getRowId = useCallback(
    (row: CancerDistributionGeneType) => row.project,
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
        if (obj.newPageSize !== undefined) {
          handlePageSizeChange(obj.newPageSize);
        }
        break;
      case 'newPageNumber':
        if (obj.newPageNumber !== undefined) {
          handlePageChange(obj.newPageNumber);
        }
        break;
    }
  };

  const handleExpand = (
    row: Row<CancerDistributionGeneType>,
    columnId: string,
  ) => {
    if (
      Object.keys(expanded).length > 0 &&
      row.original.project === expandedRowId &&
      columnId === expandedColumnId
    ) {
      setExpanded({});
    } else if ((row.original[columnId] as string[]).length > 1) {
      setExpanded({ [row.original.project]: true });
      setExpandedColumnId(columnId);
      setExpandedRowId(row.original.project as any);
    }
  };

  return (
    <VerticalTable
      data={displayedData}
      columns={cancerDistributionTableColumns}
      tableTotalDetail={
        <TotalItems total={formattedData?.length} itemName="project" />
      }
      columnSorting="manual"
      additionalControls={
        <div className="flex gap-2 mb-2">
          <FunctionButton
            onClick={() => handleJSONDownloadGene(formattedData)}
            disabled={isFetching}
          >
            JSON
          </FunctionButton>
          <FunctionButton
            onClick={() =>
              handleTSVDownloadGene(
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
      showControls={true}
      setColumnVisibility={setColumnVisibility}
      columnVisibility={columnVisibility}
      columnOrder={columnOrder}
      setColumnOrder={setColumnOrder}
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

export default GeneCancerDistributionTable;
