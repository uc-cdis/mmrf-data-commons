import React from "react";
import {
  // useGenesTable,
  FilterSet,
  SET_COUNT_LIMIT,
/*   usePrevious,
  useCreateGeneSetFromFiltersMutation,
  useCreateTopNGeneSetFromFiltersMutation,
  useCoreSelector,
  selectSetsByType,
  useGeneSetCountQuery,
  useGeneSetCountsQuery,
  useAppendToGeneSetMutation,
  useRemoveFromGeneSetMutation,
  joinFilters,
  buildCohortGqlOperator,
  useCoreDispatch,
  extractFiltersWithPrefixFromFilterSet,
  buildGeneTableSearchFilters,
  filterSetToOperation,
  convertFilterToGqlFilter,
  CnvChange, */
} from "@/core";
import { useGeneTable } from "../../genomic/mockedHooks";

import { filterSetToOperation, useCoreDispatch, usePrevious } from  "@gen3/core";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDeepCompareCallback, useDeepCompareMemo } from "use-deep-compare";
import FunctionButton from "@/components/FunctionButton";
import isEqual from "lodash/isEqual";
/* import SaveSelectionAsSetModal from "@/components/Modals/SetModals/SaveSelectionAsSetModal";
import AddToSetModal from "@/components/Modals/SetModals/AddToSetModal";
import RemoveFromSetModal from "@/components/Modals/SetModals/RemoveFromSetModal"; */
import { joinFilters, statusBooleansToDataStatus } from "src/utils";
import { SummaryModalContext } from "@/utils/contexts";
import VerticalTable from "@/components/Table/VerticalTable";
import {
  ColumnOrderState,
  ExpandedState,
  Row,
  VisibilityState,
} from "@tanstack/react-table";
import { HandleChangeInput } from "@/components/Table/types";
import { CountsIcon } from "@/components/tailwindComponents";
import { Gene, GeneToggledHandler } from './types';
//import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
//import GenesTableSubcomponent from "./GenesTableSubcomponent";
import { getFormattedTimestamp } from "@/utils/date";
import { ComparativeSurvival } from "@/features/genomic/types";
import { appendSearchTermFilters } from "../utils";
import TotalItems from "@/components/Table/TotalItem";
import { buildGeneTableSearchFilters, CnvChange } from "@/core/genomic/genesTableSlice";
// import { extractFiltersWithPrefixFromFilterSet } from
// import { selectSetsByType } from "@/features/sets/setsSlice";
import { getGene, useGenerateGenesTableColumns } from "./utils";
import { buildCohortGqlOperator } from "@/core/utils";
import { DropdownWithIcon } from "@gen3/frontend";
import { extractFiltersWithPrefixFromFilterSet } from "@/features/cohort/utils";
import { downloadTSV } from "@/components/Table/utils";
import saveAs from 'file-saver';
//import { SET_COUNT_LIMIT } from "@/components/Modals/SetModals/constants";

export interface GTableContainerProps {
  readonly selectedSurvivalPlot: ComparativeSurvival;
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  handleGeneToggled: GeneToggledHandler;
  handleMutationCountClick: (geneId: string, geneSymbol: string) => void;
  genomicFilters?: FilterSet;
  cohortFilters?: FilterSet;
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
  /* States for table */
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [downloadMutatedGenesTSVActive, setDownloadMutatedGenesTSVActive] =
    useState(false);
  const dispatch = useCoreDispatch();
  const { setEntityMetadata } = useContext(SummaryModalContext);

  /* Modal start */
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  /* Modal end */






 const searchFilters = buildGeneTableSearchFilters(searchTerm);
  // filters for the genes table using local filters
  const genesTableFilters = appendSearchTermFilters(
    genomicFilters as any,
    searchFilters as any,
  );

  // GeneTable call
  const { data, isSuccess, isFetching, isError, isUninitialized } =
    useGeneTable({
      pageSize: pageSize,
      offset: (page - 1) * pageSize,
      searchTerm: searchTerm.length > 0 ? searchTerm : undefined,
      genomicFilters: genomicFilters,
      cohortFilters: cohortFilters,
      genesTableFilters,
    });
  // GeneTable call end

  // Extract only the "genes." filters
  const genesOnlyFilters = extractFiltersWithPrefixFromFilterSet(
    genomicFilters as any,
    "genes.",
  );


  const generateFilters = useDeepCompareCallback(
    (cnvType: CnvChange, geneId: string) => {
      if (cnvType !== undefined) {
        // only genes filters
        return joinFilters(genesOnlyFilters, {
          mode: "and",
          root: {
            "genes.cnv.cnv_change": {
              field: "genes.cnv.cnv_change_5_category",
              operator: "=",
              operand: cnvType,
            },
            "genes.gene_id": {
              field: "genes.gene_id",
              operator: "=",
              operand: geneId,
            },
          },
        });
      } else {
        // any other type will use all filters
        return joinFilters(genomicFilters as any, {
          mode: "and",
          root: {
            "ssms.ssm_id": {
              field: "ssms.ssm_id",
              operator: "exists",
            },
            "genes.gene_id": {
              field: "genes.gene_id",
              operator: "includes",
              operands: [geneId],
            },
          },
        });
      }
    },
    [genomicFilters, genesOnlyFilters],
  );
  // End Create Cohort /

  // TODO: Causes type error TypeError: can't access property "genes", state.sets is undefined
  //const sets = useCoreSelector((state) => selectSetsByType(state, "genes"));
  const sets = '';
  const prevGenomicFilters = usePrevious(genomicFilters);
  const prevCohortFilters = usePrevious(cohortFilters);


  useEffect(() => {
    if (
      !isEqual(prevGenomicFilters, genomicFilters) ||
      !isEqual(prevCohortFilters, cohortFilters)
    )
      setPage(1);
  }, [cohortFilters, genomicFilters, prevCohortFilters, prevGenomicFilters]);



  const formattedTableData = useDeepCompareMemo(() => {
    if (!data?.genes) return [];

    const { cases, cnvCases, mutationCounts, filteredCases, genes } =
      data.genes;

    return genes.map((gene) =>
      getGene(
        gene,
        selectedSurvivalPlot,
        mutationCounts,
        filteredCases,
        cases,
        cnvCases,
      ),
    );
  }, [data?.genes, selectedSurvivalPlot]);

  const pagination = useMemo(() => {
    return isSuccess
      ? {
          count: pageSize,
          from: (page - 1) * pageSize,
          page: page,
          pages: Math.ceil(data?.genes?.genes_total / pageSize),
          size: pageSize,
          total: data?.genes?.genes_total,
          sort: "None",
          label: "gene",
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
  }, [pageSize, page, data?.genes?.genes_total, isSuccess]);




  const genesTableDefaultColumns = useGenerateGenesTableColumns({
    handleSurvivalPlotToggled,
    handleGeneToggled,
    toggledGenes,
    isDemoMode,
    setEntityMetadata,
    cohortFilters,
    genomicFilters,
    generateFilters,
    handleMutationCountClick,
    currentPage: page,
    totalPages: Math.ceil(data?.genes?.genes_total / pageSize),
  });

  const getRowId = (originalRow: Gene) => {
    return originalRow.gene_id;
  };
  const [rowSelection, setRowSelection] = useState({});
  const selectedGenes = Object.entries(rowSelection)?.map(
    ([gene_id]) => gene_id,
  );
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    genesTableDefaultColumns.map((column:any) => column.id as string), //must start out with populated columnOrder so we can splice
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    gene_id: false,
    cytoband: false,
    type: false,
    "#_cnv_gains": false,
    "#_cnv_heterozygous_deletions": false,
  });

  const setFilters =
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
      : genesTableFilters;


  const handleTSVDownload = () => {
    const fileName = `genes-table.${getFormattedTimestamp()}.tsv`;
    downloadTSV({tableData:formattedTableData, columns: genesTableDefaultColumns, columnOrder, columnVisibility, fileName});
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
      row.original["#_ssm_affected_cases_across_the_gdc"].numerator !== 0
    ) {
      setExpanded({ [row.original.gene_id]: true });
      setRowId(row.original.gene_id as any);
    }
  };


  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageSize":
        setPageSize(parseInt(obj.newPageSize));
        setPage(1);
        break;
      case "newPageNumber":
        setPage(obj.newPageNumber);
        setExpanded({});
        break;
      case "newSearch":
        setSearchTerm(obj.newSearch);
        setPage(1);
        setExpanded({});
        break;
    }
  };

  const handleSaveSelectionAsSetModalClose = useCallback(
    () => setShowSaveModal(false),
    [],
  );

  const handleAddToSetModalClose = useCallback(
    () => setShowAddModal(false),
    [],
  );

  const handleRemoveFromSetModalClose = useCallback(
    () => setShowRemoveModal(false),
    [],
  );

  const operationCohortFilters = filterSetToOperation(cohortFilters);
  const operationSetFilters = filterSetToOperation(setFilters as any);


  /*
  return (
            {/*
      {isUninitialized || isFetching ? null : (
        <>

          <SaveSelectionAsSetModal
            opened={showSaveModal}
            closeModal={handleSaveSelectionAsSetModalClose}
            cohortFilters={
              selectedGenes.length === 0 && operationCohortFilters
                ? convertFilterToGqlFilter(operationCohortFilters)
                : undefined
            }
            filters={
              operationSetFilters
                ? convertFilterToGqlFilter(operationSetFilters)
                : undefined
            }
            sort="case.project.project_id"
            isManualSelection={selectedGenes.length > 0}
            saveCount={
              selectedGenes.length === 0
                ? data?.genes?.genes_total
                : selectedGenes.length
            }
            setType="genes"
            setTypeLabel="gene"
            createSetHook={
              selectedGenes.length === 0
                ? useCreateTopNGeneSetFromFiltersMutation
                : useCreateGeneSetFromFiltersMutation
            }
          />

          <AddToSetModal
            opened={showAddModal}
            closeModal={handleAddToSetModalClose}
            filters={setFilters}
            addToCount={
              selectedGenes.length === 0
                ? data?.genes?.genes_total
                : selectedGenes.length
            }
            setType="genes"
            setTypeLabel="gene"
            singleCountHook={useGeneSetCountQuery}
            countHook={useGeneSetCountsQuery}
            appendSetHook={useAppendToGeneSetMutation}
            field={"genes.gene_id"}
            sort="case.project.project_id"
          />

          <RemoveFromSetModal
            opened={showRemoveModal}
            closeModal={handleRemoveFromSetModalClose}
            filters={setFilters}
            removeFromCount={
              selectedGenes.length === 0
                ? data?.genes?.genes_total
                : selectedGenes.length
            }
            setType="genes"
            setTypeLabel="gene"
            countHook={useGeneSetCountsQuery}
            removeFromSetHook={useRemoveFromGeneSetMutation}
          />
        </>
      )}
      */
     return (<>
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
              isActive={downloadMutatedGenesTSVActive}
              isDownload
            >
              JSON
            </FunctionButton>
            <FunctionButton
              onClick={handleTSVDownload}
              data-testid="button-tsv-mutation-frequency"
              disabled={isFetching}
              isActive={downloadMutatedGenesTSVActive}
              isDownload
            >
              TSV
            </FunctionButton>
          </div>
        }
        tableTotalDetail={
          <TotalItems total={data?.genes?.genes_total} itemName="gene" />
        }
        pagination={pagination}
        showControls={true}
        search={{
          enabled: true,
          defaultSearchTerm: searchTerm,
          tooltip: "e.g. TP53, ENSG00000141510, 17p13.1, tumor protein p53",
        }}
        status={statusBooleansToDataStatus(isFetching, isSuccess, isError)}
        handleChange={handleChange}
        enableRowSelection={true}
        setRowSelection={setRowSelection}
        rowSelection={rowSelection}
        getRowCanExpand={() => true}
        expandableColumnIds={["#_ssm_affected_cases_across_the_gdc"]}
        // renderSubComponent={({ row }) => <GenesTableSubcomponent row={row} />}
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
