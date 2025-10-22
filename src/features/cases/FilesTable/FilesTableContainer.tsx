import React, { useState } from 'react';
import FilesTable, { CaseFilesTableDataType } from './FilesTable';
import { useDeepCompareEffect } from 'react-use';
import { GdcFile } from '@/core';
import { useGetFilesQuery } from '../mockedHooks';

interface FilesTableProps {
  caseId: string;
}

const FilesTableWrapper = ({ caseId }: FilesTableProps) => {
  const [tableData, setTableData] = useState<CaseFilesTableDataType[]>([]);
  const { data, isFetching, isSuccess, isError } = useGetFilesQuery({});

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
  const [displayedDataAfterSearch, setDisplayedDataAfterSearch] =
    useState(tableData);

  return (
    <FilesTable
      tableData={tableData}
      displayedDataAfterSearch={displayedDataAfterSearch}
      setDisplayedDataAfterSearch={setDisplayedDataAfterSearch}
      isFetching={isFetching}
      isSuccess={isSuccess}
      isError={isError}
    />
  );
};
export default FilesTableWrapper;
