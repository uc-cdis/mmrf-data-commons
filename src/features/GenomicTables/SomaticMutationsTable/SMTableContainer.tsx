import React, { useEffect, useMemo, useState } from 'react';
import { EmptyFilterSet, FilterSet, Union } from '@gen3/core';
import {
  buildSSMSTableSearchFilters,
  useGetSsmsTableDataQuery,
} from '@/core/genomic/ssmsTableSlice';
import { useDeepCompareMemo } from 'use-deep-compare';
import { statusBooleansToDataStatus } from '../../../utils';
import FunctionButton from '@/components/FunctionButton';
import { HeaderTitle } from '@/components/tailwindComponents';
import {
  SMTableContainerProps,
  SomaticMutation,
  SsmToggledHandler,
} from './types';
import { HandleChangeInput } from '@/components/Table/types';
import {
  ColumnOrderState,
  ExpandedState,
  Row,
  VisibilityState,
} from '@tanstack/react-table';
import { getMutation, useGenerateSMTableColumns } from './Utils/utils';
import { handleJSONDownload, handleTSVDownload } from './Utils/download';
import VerticalTable from '@/components/Table/VerticalTable';
import SMTableSubcomponent from './SMTableSubcomponent';
import TotalItems from '@/components/Table/TotalItem';
import { SMTableClientSideSearch } from './Utils/SMTableClientSideSearch';
import useStandardPagination from '@/hooks/useStandardPagination';
import { appendSearchTermFilters } from '@/features/GenomicTables/utils';
import { joinFilters } from '@/core/utils';

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
  const [searchTerm, setSearchTerm] = useState(
    searchTermsForGene?.geneId ?? '',
  );
  const genomicFiltersWithPossibleGeneSymbol = geneSymbol
    ? joinFilters(
        {
          mode: 'and',
          root: {
            'genes.symbol': {
              field: 'genes.symbol',
              operator: 'includes',
              operands: [geneSymbol],
            },
          },
        },
        genomicFilters,
      )
    : genomicFilters;

  const searchFilters =
    buildSSMSTableSearchFilters(searchTerm) ??
    ({ operator: 'or', operands: [] } satisfies Union);
  const genomicTableFilters = appendSearchTermFilters(
    genomicFiltersWithPossibleGeneSymbol,
    searchFilters,
  );
  const caseTableFilters = appendSearchTermFilters(
    caseFilter ?? EmptyFilterSet,
    searchFilters,
  );

  const tableFilters = caseFilter ? caseTableFilters : genomicTableFilters;

  /* SM Table Call */
  const { data, isSuccess, isFetching, isError } = useGetSsmsTableDataQuery({
    pageSize: 100,
    offset: 0,
    searchTerm: '',
    geneSymbol: geneSymbol,
    genomicFilters: genomicFilters,
    cohortFilters: cohortFilters,
    tableFilters,
  });

  const formattedTableData: SomaticMutation[] = useDeepCompareMemo(() => {
    if (!data?.ssms) return [];

    return data.ssms.map((sm: any) =>
      getMutation(
        sm,
        selectedSurvivalPlot,
        data.filteredCases,
        data.cases,
        data.ssmsTotal,
      ),
    );
  }, [data, selectedSurvivalPlot]);

  const setEntityMetadata = null;
  const generateFilters = () => null;

  const SMTableDefaultColumns = useGenerateSMTableColumns({
    isDemoMode,
    handleSsmToggled,
    toggledSsms,
    handleSurvivalPlotToggled,
    isModal,
    geneSymbol,
    setEntityMetadata,
    projectId,
    generateFilters,
    currentPage: 1,
    totalPages: 0,
    cohortFilters,
  });

  const [displayedDataAfterSearch, setDisplayedDataAfterSearch] =
    useState(formattedTableData);

  const {
    handlePageChange,
    handlePageSizeChange,
    page,
    pages,
    size,
    from,
    total,
    displayedData,
  } = useStandardPagination(displayedDataAfterSearch, SMTableDefaultColumns);

  useEffect(() => {
    if (searchTerm.length > 0) {
      setDisplayedDataAfterSearch(
        SMTableClientSideSearch(formattedTableData, searchTerm),
      );
    } else {
      setDisplayedDataAfterSearch(formattedTableData);
    }
  }, [searchTerm, formattedTableData]);

  useEffect(() => {
    if (searchTerm === '' && clearSearchTermsForGene) {
      clearSearchTermsForGene();
    }
  }, [searchTerm, clearSearchTermsForGene]);

  const getRowId = (originalRow: SomaticMutation) => {
    return originalRow.mutation_id;
  };
  const [rowSelection, setRowSelection] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    SMTableDefaultColumns.map((column: any) => column.id as string), //must start out with populated columnOrder so we can splice
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    mutation_id: false,
  });

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case 'newPageSize':
        /*         setPageSize(parseInt(obj.newPageSize ?? '10'));
        setPage(1);
        break; */
        handlePageChange(1);
        handlePageSizeChange(obj.newPageSize as string);
        break;
      case 'newPageNumber':
        /*         setExpanded({});
        setPage(obj.newPageNumber ?? 1);
        break; */
        handlePageChange(obj.newPageNumber as number);
        break;
      case 'newSearch':
        /*         setExpanded({});
        setSearchTerm(obj.newSearch ?? '');
        setPage(1);
        break; */
        handlePageChange(1);
        setSearchTerm(obj.newSearch as string);
        break;
    }
  };

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowId, setRowId] = useState('');
  const handleExpand = (row: Row<SomaticMutation>) => {
    if (
      Object.keys(expanded).length > 0 &&
      row.original.mutation_id === rowId
    ) {
      setExpanded({});
    } else if (
      row.original['#_affected_cases_across_the_mmrf'].numerator !== 0
    ) {
      setExpanded({ [row.original.mutation_id]: true });
      setRowId(row.original.mutation_id);
    }
  };

  return (
    <>
      {searchTerm.length === 0 &&
      formattedTableData.length === 0 &&
      isSuccess ? (
        <h2>❌ Somatic Mutations Table Data Error</h2>
      ) : (
        <>
          {searchTermsForGene?.geneSymbol && (
            <div id="announce" aria-live="polite" className="sr-only">
              <p>
                You are now viewing the Mutations table filtered by
                {searchTermsForGene.geneSymbol}
              </p>
            </div>
          )}
          {tableTitle && <HeaderTitle>{tableTitle}</HeaderTitle>}
          <VerticalTable
            customDataTestID="table-most-frequent-somatic-mutations"
            data={displayedData ?? []}
            columns={SMTableDefaultColumns}
            additionalControls={
              <div className="flex gap-2 items-center">
                <FunctionButton
                  data-testid="button-json-mutation-frequency"
                  onClick={() => handleJSONDownload(formattedTableData ?? [])}
                  aria-label="Download JSON"
                  disabled={isFetching}
                >
                  JSON
                </FunctionButton>
                <FunctionButton
                  data-testid="button-tsv-mutation-frequency"
                  onClick={() =>
                    handleTSVDownload(
                      formattedTableData ?? [],
                      SMTableDefaultColumns,
                    )
                  }
                  aria-label="Download TSV"
                  disabled={isFetching}
                >
                  TSV
                </FunctionButton>
              </div>
            }
            search={{
              enabled: true,
              defaultSearchTerm: searchTerm,
              tooltip: 'e.g. TP53, ENSG00000141510, chr17:g.7675088C>T, R175H',
            }}
            tableTotalDetail={
              <TotalItems total={data?.ssmsTotal} itemName="somatic mutation" />
            }
            pagination={{
              page,
              pages,
              size,
              from,
              total,
              label: 'somatic mutation',
            }}
            showControls={true}
            enableRowSelection={true}
            setRowSelection={setRowSelection}
            rowSelection={rowSelection}
            status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
            getRowCanExpand={() => true}
            expandableColumnIds={['#_affected_cases_across_the_mmrf']}
            renderSubComponent={({ row }) => <SMTableSubcomponent row={row} />}
            handleChange={handleChange}
            setColumnVisibility={setColumnVisibility}
            columnVisibility={columnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            expanded={expanded}
            setExpanded={handleExpand}
            getRowId={getRowId}
            baseZIndex={inModal ? 300 : 0}
          />
        </>
      )}
    </>
  );
};

export default SMTableContainer;
