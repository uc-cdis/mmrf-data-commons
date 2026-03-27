import React, { useEffect, useMemo, useState } from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import { EmptyFilterSet } from '@gen3/core';
import { ProjectDefaults, SortBy } from '@/core';

import OverflowTooltippedLabel from '@/components/OverflowTooltippedLabel';
import { statusBooleansToDataStatus } from 'src/utils';
import VerticalTable from '@/components/Table/VerticalTable';
import {
  ColumnDef,
  ColumnOrderState,
  createColumnHelper,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';

import { HandleChangeInput } from '@/components/Table/types';
import TotalItems from '@/components/Table/TotalItem';
import { useProjectsQuery } from '@/core/features/projects/projectsSlice';
import { Image } from '@/components/Image';
import Link from 'next/link';

type ProjectDataType = {
  project: string;
  program: string;
  files: string;
};

const projectsTableColumnHelper = createColumnHelper<ProjectDataType>();

const ProjectsTable: React.FC = () => {
  const [pageSize, setPageSize] = useState(20);
  const [activePage, setActivePage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortBy[]>([
    { field: 'project_id', direction: 'desc' },
  ]);

  const {
    data: projectsData,
    isSuccess,
    isFetching,
    isError,
  } = useProjectsQuery({
    filter: EmptyFilterSet,
    size: pageSize,
    from: (activePage - 1) * pageSize,
    sortBy: sortBy,
    searchTerm: searchTerm,
  });

  const sortByActions = (sortByObj: SortingState) => {
    const COLUMN_ID_TO_FIELD: Record<string, string> = {
      project: 'project_id',
      files: 'summary.file_count',
      program: 'program.name',
    };
    const tempSortBy: SortBy[] = sortByObj.map((sortObj) => {
      // map sort ids to api ids
      return {
        field: COLUMN_ID_TO_FIELD[sortObj.id],
        direction: sortObj.desc ? 'desc' : 'asc',
      };
    });
    setSortBy(tempSortBy);
  };

  const [formattedTableData, tempPagination] = useDeepCompareMemo(() => {
    if (!isFetching && isSuccess) {

      return [
        projectsData?.projects?.map(
          ({ project_id, program, summary }: ProjectDefaults) => ({
            project: project_id,
            program: program?.name,
            files: summary?.file_count.toLocaleString(),
          }),
        ) as ProjectDataType[],
        {
          count: projectsData?.totalProjects,
          from: (activePage - 1) * pageSize,
          page: activePage,
          pages: Math.ceil(projectsData?.totalProjects / pageSize),
          size: pageSize,
          sort: sortBy,
          total: projectsData?.totalProjects ?? 0,
        },
      ];
    } else
      return [
        [],
        {
          count: 0,
          from: 0,
          page: 0,
          pages: 0,
          size: 0,
          sort: [],
          total: 0,
        },
      ];
  }, [isSuccess, isFetching, projectsData]);

  const projectsTableDefaultColumns = useMemo<
    ColumnDef<ProjectDataType, any>[]
  >(
    () => [
      projectsTableColumnHelper.accessor('project', {
        id: 'project',
        header: 'Project',
        cell: ({ row, getValue }) => {
          const value = getValue()?.toString() ?? '';
          const uuid = encodeURIComponent(
            row?.original?.project ?? 'Not Found',
          );
          return (
            <OverflowTooltippedLabel label={getValue()}>
              <div className="flex flex-nowrap items-center align-middle gap-2">
                <Image
                  src="/icons/OpenModal.svg"
                  width={10}
                  height={18}
                  layout="fixed"
                  alt=""
                />
                <Link
                  href={`/projects/${uuid?.toString()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-utility-link underline font-content text-left"
                >
                  {value}
                </Link>
              </div>
            </OverflowTooltippedLabel>
          );
        },
        enableSorting: true,
      }),
      projectsTableColumnHelper.accessor('program', {
        id: 'program',
        header: 'Program',
        cell: ({ getValue }) => (
          <OverflowTooltippedLabel label={getValue()} className="font-content">
            {getValue()}
          </OverflowTooltippedLabel>
        ),
        enableSorting: true,
      }),
      projectsTableColumnHelper.accessor('files', {
        id: 'files',
        header: 'Files',
        enableSorting: true,
      }),
    ],
    [],
  );

  const getRowId = (originalRow: ProjectDataType) => {
    return originalRow.project;
  };

  const [rowSelection, setRowSelection] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    projectsTableDefaultColumns.map((column) => column.id as string), //must start out with populated columnOrder so we can splice
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    files: false,
  });

  const [sorting, setSorting] = useState<SortingState>([
    { id: 'project', desc: true },
  ]);

  useEffect(() => {
    setRowSelection({});
    sortByActions(sorting);
  }, [sorting]);

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case 'newPageSize':
        setPageSize(parseInt(obj.newPageSize ?? '20'));
        setActivePage(1);
        break;
      case 'newPageNumber':
        setActivePage(obj.newPageNumber ?? 0);
        break;
      case 'newSearch':
        setSearchTerm(obj.newSearch ?? '');
        setActivePage(1);
        break;
    }
  };

  // const handleDownloadJSON = async () => {
  //   setJsonDownloadInProgress(true);
  //   await download({
  //     endpoint: "projects",
  //     method: "POST",
  //     params: {
  //       filters: tableFilters,
  //       size: 10000,
  //       attachment: true,
  //       format: "JSON",
  //       pretty: true,
  //       fields: [
  //         "project_id",
  //         "disease_type",
  //         "primary_site",
  //         "program.name",
  //         "summary.case_count",
  //         "summary.experimental_strategies.experimental_strategy",
  //         "summary.experimental_strategies.case_count",
  //         "summary.file_count",
  //       ].join(","),
  //     },
  //     dispatch: coreDispatch,
  //     done: () => setJsonDownloadInProgress(false),
  //   });
  // };

  // const handleDownloadTSV = async () => {
  //   await downloadTSV({
  //     tableData: formattedTableData,
  //     columnOrder,
  //     columnVisibility,
  //     columns: projectsTableDefaultColumns,
  //     fileName: `projects-table.${getFormattedTimestamp()}.tsv`,
  //     option: { blacklist: ["select"] },
  //   });
  // };

  return (
    <VerticalTable
      tableTotalDetail={
        <TotalItems total={projectsData?.totalProjects} itemName="project" />
      }
      data={formattedTableData}
      columns={projectsTableDefaultColumns}
      showControls={true}
      pagination={{
        ...tempPagination,
        label: 'project',
      }}
      search={{
        enabled: false,
        tooltip: 'e.g. MMRF-IA19',
      }}
      status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
      handleChange={handleChange}
      enableRowSelection={true}
      setRowSelection={setRowSelection}
      rowSelection={rowSelection}
      setColumnVisibility={setColumnVisibility}
      columnVisibility={columnVisibility}
      columnOrder={columnOrder}
      setColumnOrder={setColumnOrder}
      columnSorting="manual"
      sorting={sorting}
      setSorting={setSorting}
      getRowId={getRowId}
    />
  );
};

export default ProjectsTable;
