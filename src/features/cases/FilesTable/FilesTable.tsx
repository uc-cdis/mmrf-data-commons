import React from 'react';
import { FileAccessBadge } from '@/components/FileAccessBadge';
import FunctionButton from '@/components/FunctionButton';
import VerticalTable from '@/components/Table/VerticalTable';
import { HandleChangeInput } from '@/components/Table/types';
import { HeaderTitle } from '@/components/tailwindComponents';
import { capitalize, statusBooleansToDataStatus } from '@/utils/index';
import { GdcFile } from '@/core';
import {
  ColumnDef,
  ColumnOrderState,
  ColumnSort,
  SortingState,
  VisibilityState,
  createColumnHelper,
} from '@tanstack/react-table';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import { downloadTSV } from '@/components/Table/utils';
import { getFormattedTimestamp } from '@/utils/date';
import TotalItems from '@/components/Table/TotalItem';
import { handleJSONDownload } from '../utils';
import { FilesTableClientSideSearch } from './FilesTableClientSideSearch';
import useStandardPagination from '@/hooks/useStandardPagination';

const currentCart = null;

interface FilesTableProps {
  tableData: CaseFilesTableDataType[];
  displayedDataAfterSearch: CaseFilesTableDataType[];
  setDisplayedDataAfterSearch: React.Dispatch<
    React.SetStateAction<CaseFilesTableDataType[]>
  >;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
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
const fileSize = (input: number) => {
  const megabytes = input / 1000000;
  return `${Number(megabytes.toFixed(2)).toLocaleString()} mB`;
};

const FilesTable = ({
  tableData,
  displayedDataAfterSearch,
  setDisplayedDataAfterSearch,
  isFetching,
  isSuccess,
  isError,
}: FilesTableProps) => {
  // const currentCart = useCoreSelector((state) => selectCart(state));
  // const dispatch = useCoreDispatch();
  // const modal = useCoreSelector((state) => selectCurrentModal(state));
  const [searchTerm, setSearchTerm] = useState('');
  const [sorting, setSorting] = useState<ColumnSort[]>([]);

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
        header: 'File GUID',
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
          return (
            <>
              <FunctionButton
                showDownloadIcon
                onClick={() =>
                  handleJSONDownload(row.original.file.file_name, [
                    row.original.file,
                  ])
                }
              >
                Download
              </FunctionButton>
            </>
          );
        },
      }),
    ],
    [currentCart],
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
  } = useStandardPagination(
    displayedDataAfterSearch,
    caseFilesTableDefaultColumns,
  );

  useEffect(
    () => handleSortByChange(sorting as SortingState),
    [sorting, handleSortByChange],
  );
  useEffect(() => {
    if (searchTerm.length > 0) {
      setDisplayedDataAfterSearch(
        FilesTableClientSideSearch(tableData, searchTerm),
      );
    } else {
      setDisplayedDataAfterSearch(tableData);
    }
  }, [searchTerm, tableData]);

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    caseFilesTableDefaultColumns.map((column) => column.id as string), //must start out with populated columnOrder so we can splice
  );

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    file_uuid: false,
    data_type: false,
    platform: false,
  });

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case 'newPageSize':
        handlePageChange(1);
        handlePageSizeChange(obj.newPageSize as string);
        break;
      case 'newPageNumber':
        handlePageChange(obj.newPageNumber as number);
        break;
      case 'newSearch':
        handlePageChange(1);
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
        data={displayedData ?? []}
        columns={caseFilesTableDefaultColumns}
        tableTotalDetail={<TotalItems total={total} itemName="file" />}
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
        sorting={sorting}
        setSorting={setSorting}
        handleChange={handleChange}
        pagination={{
          page,
          pages,
          size,
          from,
          total,
          label: 'somatic mutation',
        }}
        search={{
          enabled: true,
          tooltip:
            'e.g. HCM-CSHL-0062-C18.json, 4b5f5ba0-3010-4449-99d4-7bd7a6d73422',
        }}
        baseZIndex={350}
        setColumnOrder={setColumnOrder}
      />
      {/*
      <AgreementModal
        openModal={modal === Modals.AgreementModal && fileToDownload !== null}
        file={fileToDownload}
        dbGapList={fileToDownload?.acl}
      />
      <NoAccessToProjectModal
        openModal={modal === Modals.NoAccessToProjectModal}
      />
      <GeneralErrorModal openModal={modal === Modals.GeneralErrorModal} />
      */}
    </div>
  );
};

export default FilesTable;
