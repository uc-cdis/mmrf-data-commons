import React from 'react';
import { FileAccessBadge } from '@/components/FileAccessBadge';
import FunctionButton from '@/components/FunctionButton';
import VerticalTable from '@/components/Table/VerticalTable';
import { HandleChangeInput } from '@/components/Table/types';
import { TableActionButtons } from '@/components/TableActionButtons';
import { HeaderTitle } from '@/components/tailwindComponents';
import { capitalize, statusBooleansToDataStatus } from '@/utils/index';
import { GdcFile, GqlOperation } from '@/core';
import {
  ColumnDef,
  ColumnOrderState,
  SortingState,
  VisibilityState,
  createColumnHelper,
} from '@tanstack/react-table';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDeepCompareEffect, useDeepCompareMemo } from 'use-deep-compare';
import { downloadTSV } from '@/components/Table/utils';
import { getFormattedTimestamp } from '@/utils/date';
import TotalItems from '@/components/Table/TotalItem';
import { useCoreDispatch } from '@gen3/core';
import { useGetFilesQuery } from './mockedHooks';
import { handleJSONDownload } from './utils';

const fileSize = (input: any) => null;
const currentCart = null;

interface FilesTableProps {
  caseId: string;
}

interface SortBy {
  readonly field: string;
  readonly direction: 'asc' | 'desc';
}

export type CaseFilesTableDataType = Pick<
  GdcFile,
  | 'access'
  | 'file_name'
  | 'data_category'
  | 'data_type'
  | 'data_format'
  | 'experimental_strategy'
  | 'platform'
  | 'file_size'
> & { file: GdcFile; file_uuid: string };

const caseFilesTableColumnHelper = createColumnHelper<CaseFilesTableDataType>();

const FilesTable = ({ caseId }: FilesTableProps) => {
  // const currentCart = useCoreSelector((state) => selectCart(state));
  // const dispatch = useCoreDispatch();
  // const modal = useCoreSelector((state) => selectCurrentModal(state));
  const [tableData, setTableData] = useState<CaseFilesTableDataType[]>([]);
  const [sortBy, setSortBy] = useState<SortBy[]>([
    { field: 'experimental_strategy', direction: 'asc' },
  ]);
  // const [fileToDownload, setFileToDownload] = useState(null);
  // const [downloadJSONActive, setDownloadJSONActive] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [activePage, setActivePage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const sortByActions = (sortByObj: SortingState) => {
    const tempSortBy: SortBy[] = sortByObj.map((sortObj) => ({
      field: sortObj.id === 'file_uuid' ? 'file_id' : sortObj.id,
      direction: sortObj.desc ? 'desc' : 'asc',
    }));
    setSortBy(tempSortBy);
  };

  const tableFilters: any | GqlOperation = {
    op: 'and',
    content: [
      {
        op: 'in',
        content: {
          field: 'cases.case_id',
          value: [caseId],
        },
      },
      {
        op: 'or',
        content: [
          {
            op: '=',
            content: {
              field: 'files.file_id',
              value: `*${searchTerm}*`,
            },
          },
          {
            op: '=',
            content: {
              field: 'files.file_name',
              value: `*${searchTerm}*`,
            },
          },
        ],
      },
    ],
  };

  const { data, isFetching, isSuccess, isError } = useGetFilesQuery({
    size: pageSize as any,
    from: pageSize * (activePage - 1),
    filters: tableFilters as any,
    sortBy: sortBy,
  });
  console.log('data from FilesTable', data);

  useDeepCompareEffect(() => {
    setTableData(
      isSuccess
        ? (data?.files.map((file: any | GdcFile) => ({
            file: file,
            file_uuid: file.file_id,
            access: file.access,
            file_name: file.file_name,
            data_category: file.data_category,
            data_type: file.data_type,
            data_format: file.data_format,
            experimental_strategy: file.experimental_strategy || '--',
            platform: file.platform || '--',
            file_size: file.file_size,
            annotations: file.annotations,
          })) as CaseFilesTableDataType[])
        : [],
    );
  }, [isSuccess, data?.files]);

  const pagination = useDeepCompareMemo(() => {
    return isSuccess
      ? {
          count: pageSize,
          from: (activePage - 1) * pageSize,
          page: activePage,
          pages: Math.ceil(data?.pagination?.total / pageSize),
          size: pageSize,
          total: data?.pagination?.total,
          sort: 'None',
          label: 'file',
        }
      : {
          count: undefined,
          from: undefined,
          page: undefined,
          pages: undefined,
          size: undefined,
          total: undefined,
          label: undefined,
        };
  }, [pageSize, activePage, data?.pagination?.total, isSuccess]);

  const caseFilesTableDefaultColumns = useDeepCompareMemo<
    ColumnDef<CaseFilesTableDataType>[]
  >(
    () => [
      caseFilesTableColumnHelper.accessor('access', {
        id: 'access',
        header: 'Access',
        cell: ({ getValue }) => <FileAccessBadge access={getValue()} />,
        enableSorting: true,
      }) as ColumnDef<CaseFilesTableDataType>,
      caseFilesTableColumnHelper.accessor('file_name', {
        id: 'file_name',
        header: 'File Name',
        cell: ({ row }) => (
          <Link
            href={`/files/${row.original.file_uuid}`}
            className="underline text-primary"
          >
            {row.original.file_name}
          </Link>
        ),
        enableSorting: true,
      }) as ColumnDef<CaseFilesTableDataType>,
      caseFilesTableColumnHelper.accessor('file_uuid', {
        id: 'file_uuid',
        header: 'File UUID',
        cell: ({ row }) => (
          <Link
            href={`/files/${row.original.file_uuid}`}
            className="underline text-primary"
          >
            {row.original.file_uuid}
          </Link>
        ),
        enableSorting: true,
      }) as ColumnDef<CaseFilesTableDataType>,
      caseFilesTableColumnHelper.accessor('data_category', {
        id: 'data_category',
        header: 'Data Category',
        enableSorting: true,
      }) as ColumnDef<CaseFilesTableDataType>,
      caseFilesTableColumnHelper.accessor('data_type', {
        id: 'data_type',
        header: 'Data Type',
        enableSorting: true,
      }) as ColumnDef<CaseFilesTableDataType>,
      caseFilesTableColumnHelper.accessor('data_format', {
        id: 'data_format',
        header: 'Data Format',
        enableSorting: true,
      }) as ColumnDef<CaseFilesTableDataType>,
      caseFilesTableColumnHelper.accessor('experimental_strategy', {
        id: 'experimental_strategy',
        header: 'Experimental Strategy',
        enableSorting: true,
      }) as ColumnDef<CaseFilesTableDataType>,
      caseFilesTableColumnHelper.accessor('platform', {
        id: 'platform',
        header: 'Platform',
        enableSorting: true,
      }) as ColumnDef<CaseFilesTableDataType>,
      caseFilesTableColumnHelper.accessor('file_size', {
        id: 'file_size',
        header: 'File Size',
        cell: ({ row }) => <>{fileSize(row.original.file_size)}</>,
        enableSorting: true,
      }) as ColumnDef<CaseFilesTableDataType>,
      caseFilesTableColumnHelper.display({
        id: 'action',
        header: 'Action',
        cell: ({ row }) => {
          /* const isOutputFileInCart = fileInCart(
            currentCart,
            row.original.file_uuid,
          ); */
          const isOutputFileInCart = false;
          return (
            <TableActionButtons
            // isOutputFileInCart={isOutputFileInCart}
            // file={mapGdcFileToCartFile([row.original.file])}
            // downloadFile={row.original.file}
            // setFileToDownload={setFileToDownload}
            />
          );
        },
      }),
    ],
    [currentCart],
  );

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    caseFilesTableDefaultColumns.map((column) => column.id as string), //must start out with populated columnOrder so we can splice
  );
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'experimental_strategy', desc: false },
  ]);
  useEffect(() => {
    sortByActions(sorting);
  }, [sorting]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    file_uuid: false,
    data_type: false,
    platform: false,
  });

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case 'newPageSize':
        setActivePage(1);
        setPageSize(parseInt(obj.newPageSize as string));
        break;
      case 'newPageNumber':
        setActivePage(obj.newPageNumber as number);
        break;
      case 'newSearch':
        setActivePage(1);
        setSearchTerm(obj.newSearch as string);
        break;
    }
  };
  const downloadFileNameBase = `files-table.${getFormattedTimestamp()}`;

  const handleDownloadTSV = async () => {
    await downloadTSV({
      tableData,
      columnOrder,
      fileName: `${downloadFileNameBase}.tsv`,
      columnVisibility,
      columns: caseFilesTableDefaultColumns,
      option: {
        blacklist: ['action'],
        overwrite: {
          access: {
            composer: (file) => capitalize(file.access),
          },
        },
      },
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <HeaderTitle>Files</HeaderTitle>
      <VerticalTable
        customDataTestID="table-files-case-summary"
        data={tableData}
        columns={caseFilesTableDefaultColumns}
        tableTotalDetail={
          <TotalItems total={pagination?.total} itemName="file" />
        }
        status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
        additionalControls={
          <div className="flex gap-2 mb-2">
            <FunctionButton
              data-testid="button-json-files-case-summary"
              onClick={() =>
                handleJSONDownload(downloadFileNameBase, tableData)
              }
              aria-label="Download JSON"
            >
              JSON
            </FunctionButton>
            <FunctionButton
              data-testid="button-tsv-files-case-summary"
              onClick={handleDownloadTSV}
              aria-label="Download TSV"
            >
              TSV
            </FunctionButton>
          </div>
        }
        showControls={true}
        setColumnVisibility={setColumnVisibility}
        columnVisibility={columnVisibility}
        columnOrder={columnOrder}
        columnSorting="manual"
        handleChange={handleChange}
        pagination={pagination as any}
        search={{
          enabled: true,
          tooltip:
            'e.g. HCM-CSHL-0062-C18.json, 4b5f5ba0-3010-4449-99d4-7bd7a6d73422',
        }}
        baseZIndex={400}
        sorting={sorting}
        setSorting={setSorting}
        setColumnOrder={setColumnOrder}
      />

      {/*       <AgreementModal
        openModal={modal === Modals.AgreementModal && fileToDownload !== null}
        file={fileToDownload}
        dbGapList={fileToDownload?.acl}
      /> */}

      {/*       <NoAccessToProjectModal
        openModal={modal === Modals.NoAccessToProjectModal}
      /> */}

      {/*  <GeneralErrorModal openModal={modal === Modals.GeneralErrorModal} /> */}
    </div>
  );
};

export default FilesTable;
