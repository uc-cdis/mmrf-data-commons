import React, { useContext, useMemo, useState } from 'react';
import { FilterSet } from '@gen3/core';
import { useGeneTableDataQuery } from '@/core';
import { useDeepCompareCallback, useDeepCompareMemo } from 'use-deep-compare';
import FunctionButton from '@/components/FunctionButton';
import { joinFilters } from '@/core/utils';
import { statusBooleansToDataStatus } from 'src/utils';
import { SummaryModalContext } from '@/utils/contexts';
import VerticalTable from '@/components/Table/VerticalTable';
import {
  ColumnOrderState,
  ExpandedState,
  Row,
  VisibilityState,
} from '@tanstack/react-table';
import { HandleChangeInput } from '@/components/Table/types';
import { Gene, GeneToggledHandler } from './types';
import GenesTableSubcomponent from './GenesTableSubcomponent';
import { getFormattedTimestamp } from '@/utils/date';
import { ComparativeSurvival } from '@/features/genomic/types';
import TotalItems from '@/components/Table/TotalItem';
import {
  CnvChange,
} from '@/core/genomic/genesTableSlice';
import { getGene, useGenerateGenesTableColumns } from './utils';
import { extractFiltersWithPrefixFromFilterSet } from '@/features/cohort/utils';
import { downloadTSV } from '@/components/Table/utils';
import saveAs from 'file-saver';
import {
  addPrefixToFilterSet, GenomicIndexFilterPrefixes,
  separateGeneAndSSMFilters,
} from '@/core/genomic/genomicFilters';
import { useGetTotalCountsQuery } from '@/core/features/counts/countsSlice';

const DEFAULT_PAGE_SIZE = 10;

export interface GTableContainerProps {
  readonly selectedSurvivalPlot: ComparativeSurvival;
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  handleGeneToggled: GeneToggledHandler;
  handleMutationCountClick: (geneId: string, geneSymbol: string) => void;
  genomicFilters: FilterSet;
  cohortFilters: FilterSet;
  toggledGenes?: ReadonlyArray<string>;
  isDemoMode?: boolean;
}

export const GenesTableContainer: React.FC<GTableContainerProps> = ({
  selectedSurvivalPlot,
  handleSurvivalPlotToggled,
  handleGeneToggled,
  genomicFilters,
  cohortFilters,
  toggledGenes = [],
  isDemoMode = false,
  handleMutationCountClick,
}: GTableContainerProps) => {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const { setEntityMetadata } = useContext(SummaryModalContext);

  const { geneFilters, ssmFilters, geneFiltersForCaseCentric } = useDeepCompareMemo(() => {
    const filters = separateGeneAndSSMFilters(genomicFilters);

    const ssmFilterForGeneCentric = addPrefixToFilterSet(
      filters.ssm,
      `${GenomicIndexFilterPrefixes.gene.ssm}`
    );
    const geneFiltersForCaseCentric = addPrefixToFilterSet(
      filters.gene,
      `${GenomicIndexFilterPrefixes.case.gene}`,
    );

    return {
      geneFilters: filters.gene,
      ssmFilters: ssmFilterForGeneCentric,
      geneFiltersForCaseCentric: geneFiltersForCaseCentric
    };
  }, [genomicFilters]);

  // GeneTable call
  const { data, isSuccess, isFetching, isError } = useGeneTableDataQuery({
    pageSize: pageSize,
    offset: (page - 1) * pageSize,
    searchTerm: searchTerm.length > 0 ? `*${searchTerm}*` : undefined,
    geneFilters: geneFilters,
    ssmFilters: ssmFilters,
    cohortFilters: cohortFilters,
  });
  // GeneTable call end

  // get the totals for all cases
  const { data: countsData} = useGetTotalCountsQuery({});

  const generateFilters = useDeepCompareCallback(
    (cnvType: CnvChange | undefined, geneId: string) => {
      if (cnvType !== undefined) {
        // only genes filters
        return joinFilters(geneFiltersForCaseCentric, {
          mode: 'and',
          root: { // TODO: test when cvn data becomes available
            'gene.cnv.cnv_change': { // TODO: change to case_centric version of the cnv filter
              field: 'genes.cnv.cnv_change_5_category',
              operator: '=',
              operand: cnvType,
            },
            'gene_id': {
              field: 'gene_id',
              operator: '=',
              operand: geneId,
            },
          },
        });
      } else {
        // any other type will use all filters
        return joinFilters(geneFiltersForCaseCentric, {
          mode: 'and',
          root: { // NOTE: case_centric version of the geneId filter
            'gene.gene_id': {
              field: 'gene.gene_id',
              operator: 'includes',
              operands: [geneId],
            },
          },
        });
      }
    },
    [geneFilters, geneFiltersForCaseCentric],
  );
  // End Create Cohort /

  const formattedTableData = useDeepCompareMemo(() => {
    if (!data?.genes) return [];
    const { ssmCases, cnvCases, totalCases, genes, genesTotal } = data;
    return genes.map((gene: any) =>
      getGene(gene, selectedSurvivalPlot, ssmCases,countsData?.ssmCaseCount ?? 0, cnvCases),
    );
  }, [data?.genes, selectedSurvivalPlot, countsData]);

  const genesTableDefaultColumns = useGenerateGenesTableColumns({
    handleSurvivalPlotToggled,
    handleGeneToggled,
    toggledGenes,
    isDemoMode,
    setEntityMetadata,
    cohortFilters,
    genomicFilters: geneFilters,
    generateFilters,
    handleMutationCountClick,
    currentPage: page,
    totalPages: Math.ceil((data?.genesTotal ?? 1) / pageSize),
  });

  const pagination = useMemo(() => {
    return isSuccess
      ? {
          count: pageSize,
          from: (page - 1) * pageSize,
          page: page,
          pages: Math.ceil((data?.genesTotal ?? 1) / pageSize),
          size: pageSize,
          total: data?.genesTotal,
          sort: 'None',
          label: 'gene',
        }
      : {
          count: 0,
          from: 0,
          page: 1,
          pages: 0,
          size: DEFAULT_PAGE_SIZE,
          total: 0,
          label: '---',
        };
  }, [pageSize, page, data?.genesTotal, isSuccess]);

  const getRowId = (originalRow: Gene) => {
    return originalRow.gene_id;
  };
  const [rowSelection, setRowSelection] = useState({});
  /*   const selectedGenes = Object.entries(rowSelection)?.map(
    ([gene_id]) => gene_id,
  ); */
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    genesTableDefaultColumns.map((column: any) => column.id as string), //must start out with populated columnOrder so we can splice
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    gene_id: false,
    cytoband: false,
    type: false,
    '#_cnv_homozygous_deletions': false,
    '#_cnv_amplifications': false,
  });

  /*   const setFilters =
    selectedGenes.length > 0
      ? ({
          root: {
            "genes.gene_id": {
              field: "genes.gene_id",
              operands: selectedGenes.slice(0, SET_COUNT_LIMIT),
              operator: "includes",
            },
          },
          mode: "and",
        } as FilterSet)
      : genesTableFilters; */

  const handleTSVDownload = () => {
    const fileName = `genes-table.${getFormattedTimestamp()}.tsv`;
    downloadTSV({
      tableData: formattedTableData,
      columns: genesTableDefaultColumns,
      columnOrder,
      columnVisibility,
      fileName,
    });
  };
  const handleJSONDownload = () => {
    const fileName = `genes-table.${getFormattedTimestamp()}.json`;
    const blob = new Blob([JSON.stringify(formattedTableData, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, fileName);
  };

  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowId, setRowId] = useState(null);
  const handleExpand = (row: Row<Gene>) => {
    if (Object.keys(expanded).length > 0 && row.original.gene_id === rowId) {
      setExpanded({});
    } else if (
      row.original['#_ssm_affected_cases_across_the_mmrf'].numerator !== 0
    ) {
      setExpanded({ [row.original.gene_id]: true });
      setRowId(row.original.gene_id as any);
    }
  };

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case 'newPageSize':
        setPageSize(parseInt(obj?.newPageSize ?? '20'));
        setPage(1);
        break;
      case 'newPageNumber':
        setPage(obj?.newPageNumber ?? 1);
        setExpanded({});
        break;
      case 'newSearch':
        setSearchTerm(obj?.newSearch ?? '');
        setPage(1);
        setExpanded({});
        break;
    }
  };

  return (
    <>
      <VerticalTable
        customDataTestID="table-genes"
        data={formattedTableData}
        columns={genesTableDefaultColumns}
        additionalControls={
          <div className="flex gap-2 items-center">
            <FunctionButton
              onClick={handleJSONDownload}
              data-testid="button-json-mutation-frequency"
              disabled={isFetching}
            >
              JSON
            </FunctionButton>
            <FunctionButton
              onClick={handleTSVDownload}
              data-testid="button-tsv-mutation-frequency"
              disabled={isFetching}
            >
              TSV
            </FunctionButton>
          </div>
        }
        tableTotalDetail={
          <TotalItems total={data?.genesTotal} itemName="gene" />
        }
        pagination={pagination}
        showControls={true}
        search={{
          enabled: true,
          defaultSearchTerm: searchTerm,
          tooltip: 'e.g. TP53, ENSG00000141510, 17p13.1, tumor protein p53',
        }}
        status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
        handleChange={handleChange}
        enableRowSelection={false}
        setRowSelection={setRowSelection}
        rowSelection={rowSelection}
        getRowCanExpand={() => false} // TODO: change to true > 1 project: ['#_ssm_affected_cases_across_the_mmrf']
        expandableColumnIds={[/* TODO: turn on when > 1 project: ['#_ssm_affected_cases_across_the_mmrf'] */]}
        renderSubComponent={({ row }) => <GenesTableSubcomponent row={row} />}
        setColumnVisibility={setColumnVisibility}
        columnVisibility={columnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        expanded={expanded}
        setExpanded={handleExpand}
        getRowId={getRowId}
      />
    </>
  );
};
