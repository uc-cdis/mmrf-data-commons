import React, { useEffect, useMemo, useState } from 'react';
import { EmptyFilterSet, FilterSet, Union } from '@gen3/core';
import { buildSSMSTableSearchFilters } from '@/core/genomic/ssmsTableSlice';
import { useDeepCompareMemo } from 'use-deep-compare';
import { statusBooleansToDataStatus } from '../../../utils';
import FunctionButton from '@/components/FunctionButton';
import { HeaderTitle } from '@/components/tailwindComponents';
import { SomaticMutation, SsmToggledHandler } from './types';
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
import { ComparativeSurvival } from '@/features/genomic/types';
import TotalItems from '@/components/Table/TotalItem';
import { SMTableClientSideSearch } from './Utils/SMTableClientSideSearch';
import useStandardPagination from '@/hooks/useStandardPagination';
import { appendSearchTermFilters } from '@/features/GenomicTables/utils';
import { joinFilters } from '@/core/utils';
import { useGetSsmsTableDataQuery } from '@/core/genomic/ssmsTableSlice'

export interface SMTableContainerProps {
  readonly selectedSurvivalPlot?: ComparativeSurvival;
  handleSurvivalPlotToggled?: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  geneFilters?: FilterSet;
  ssmFilters?: FilterSet;
  cohortFilters?: FilterSet;
  handleSsmToggled?: SsmToggledHandler;
  toggledSsms?: Array<string>;
  geneSymbol?: string;
  tableTitle?: string;
  isDemoMode?: boolean;
  /*
   * filter about case id sent from case summary for SMT
   */
  caseFilter?: FilterSet;
  /*
   * project id for case summary SM Table
   */
  projectId?: string;
  /*
   * boolean used to determine if the links need to be opened in a summary modal or a Link
   */
  isModal?: boolean;
  /*
   * boolean used to determine if being called in a modal
   */
  inModal?: boolean;
  /*
   *  This is being sent from GenesAndMutationFrequencyAnalysisTool when mutation count is clicked in genes table
   */
  searchTermsForGene?: { geneId?: string; geneSymbol?: string };
  /**
   *  This is required for TSV download SMTable in Gene summary page
   */
  clearSearchTermsForGene?: () => void;
  gene_id?: string;
  /**
   *  This is required for TSV download SMTable in Case summary page
   */
  case_id?: string;

  dataHook: (params: any) => any;
}

export const SMTableContainer: React.FC<SMTableContainerProps> = ({
  selectedSurvivalPlot,
  handleSurvivalPlotToggled = undefined,
  geneSymbol = undefined,
  projectId = undefined,
  geneFilters = { mode: 'and', root: {} },
  ssmFilters = { mode: 'and', root: {} },
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
  dataHook = useGetSsmsTableDataQuery
}: SMTableContainerProps) => {
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
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
      geneFilters,
      )
    : geneFilters;

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
  const { data, isSuccess, isFetching, isError } = dataHook({
    pageSize: pageSize,
    offset: pageSize * (page - 1),
    searchTerm: searchTerm.length > 0 ? searchTerm : undefined,
    geneSymbol: geneSymbol,
    geneFilters: EmptyFilterSet,
    ssmFilters: EmptyFilterSet,
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
    totalPages: Math.ceil(data?.ssmsTotal ? data?.ssmsTotal / pageSize : 0),
    cohortFilters,
  });

  const pagination = useMemo(() => {
    return isSuccess
      ? {
          count: pageSize,
          from: (page - 1) * pageSize,
          page: page,
          pages: Math.ceil(data?.ssmsTotal / pageSize),
          size: pageSize,
          total: data?.ssmsTotal,
          sort: 'None',
          label: 'somatic mutation',
        }
      : {
          count: 0,
          from: 0,
          page: 1,
          pages: 0,
          size: 0,
          total: 0,
          label: '',
        };
  }, [pageSize, page, data?.ssmsTotal, isSuccess]);
  const { displayedData } = useStandardPagination(
    formattedTableData,
    SMTableDefaultColumns,
  );
  const [displayedDataAfterSearch, setDisplayedDataAfterSearch] = useState(
    [] as SomaticMutation[],
  );

  useEffect(() => {
    if (searchTerm.length > 0) {
      setDisplayedDataAfterSearch(
        SMTableClientSideSearch(displayedData, searchTerm),
      );
    } else {
      setDisplayedDataAfterSearch(displayedData);
    }
  }, [searchTerm, displayedData]);

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
        setPageSize(parseInt(obj.newPageSize ?? '10'));
        setPage(1);
        break;
      case 'newPageNumber':
        setExpanded({});
        setPage(obj.newPageNumber ?? 1);
        break;
      case 'newSearch':
        setExpanded({});
        setSearchTerm(obj.newSearch ?? '');
        setPage(1);
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
            data={displayedDataAfterSearch ?? []}
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
            pagination={pagination}
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
