import React, { useState } from 'react';
import { useDeepCompareEffect } from 'react-use';
import { GdcFile } from '@/core';
import { SMTableContainerProps } from './types';
import SMTable from './SMTable';


export const SMTableContainer: React.FC<SMTableContainerProps> = ({
  selectedSurvivalPlot,
  handleSurvivalPlotToggled = undefined,
  geneSymbol = undefined,
  projectId = undefined,
  genomicFilters = { mode: 'and', root: {} },
  cohortFilters = { mode: 'and', root: {} },
  caseFilter = undefined,
  handleSsmToggled = undefined,
  toggledSsms = undefined,
  isDemoMode = false,
  isModal = false,
  inModal = false,
  tableTitle = undefined,
  searchTermsForGene,
  clearSearchTermsForGene,
  gene_id,
  case_id,
}: SMTableContainerProps) => {

  // const [tableData, setTableData] = useState<CaseFilesTableDataType[]>([]);
  // const { data, isFetching, isSuccess, isError } = useGetFilesQuery({});

  /*useDeepCompareEffect(() => {
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
  */
  return (
    <SMTable
      projectId={projectId}
      case_id={case_id}
      cohortFilters={cohortFilters}
      caseFilter={caseFilter}
      tableTitle="Most Frequent Somatic Mutations"
      inModal={isModal}
    />
  );
};
export default SMTableContainer;
