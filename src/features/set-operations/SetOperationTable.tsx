import React, { useState, useId } from "react";
import VerticalTable from "@/components/Table/VerticalTable";
import {
  ColumnDef,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { useDeepCompareMemo } from "use-deep-compare";
import CountButtonWrapperForSetsAndCases from "./CountButtonWrapperForSetsAndCases";
import { Checkbox, Tooltip } from "@mantine/core";
import DownloadButtonTotal from "./DownloadButton";
import { FilterSet } from '@gen3/core';

type SetOperationTableDataType = {
  setOperation: string;
  count: number;
  operationKey: string;
  caseIds: string[];
};

const setOperationTableColumnsHelper =
  createColumnHelper<SetOperationTableDataType>();

export const SetOperationTable = ({
  data,
  selectedSets,
  setSelectedSets,
}: {
  readonly data: {
    readonly label: string;
    readonly key: string;
    readonly value: number;
    readonly caseIds: string[];
  }[];
  selectedSets: {
    [k: string]: boolean;
  };
  setSelectedSets: React.Dispatch<
    React.SetStateAction<{
      [k: string]: boolean;
    }>
  >;
}): JSX.Element => {



  const [rowSelection, setRowSelection] = useState({});
  const [operationTableSorting, setOperationTableSorting] =
    useState<SortingState>([]);
  const componentId = useId();

  const unionData = useDeepCompareMemo(() => {
    const ids =  data.reduce((acc: string[], set) => {
      return set.caseIds.length > 0 ? [...acc, ...set.caseIds] : acc;
    }, [] )

    return [...new Set(ids)];
  }, [data])

  const totalCount = unionData.length;

  const setOperationTableData: SetOperationTableDataType[] = useDeepCompareMemo(
    () =>
      data.map((r) => ({
        setOperation: r.label,
        count: r.value,
        operationKey: r.key,
        caseIds: r.caseIds
      })),
    [data],
  );

  const setOperationTableColumns = useDeepCompareMemo<
    ColumnDef<SetOperationTableDataType, any>[]
  >(
    () => [
      {
        id: 'select',
        header: 'Select',
        cell: ({ row }) => (
          <Tooltip
            label="This region contains 0 items"
            disabled={row.original.count !== 0}
            position="right"
          >
            <Checkbox
              data-testid={`checkbox-${row.original.operationKey}-set-operations`}
              size="xs"
              classNames={{
                input: 'checked:bg-accent checked:border-accent',
              }}
              value={row.original.operationKey}
              id={`${componentId}-setOperation-${row.original.operationKey}`}
              checked={selectedSets[row.original.operationKey]}
              onChange={(e) => {
                setSelectedSets({
                  ...selectedSets,
                  [e.target.value]: !selectedSets[e.target.value],
                });
              }}
              disabled={row.original.count === 0}
            />
          </Tooltip>
        ),
      },
      setOperationTableColumnsHelper.accessor('setOperation', {
        header: 'Set Operation',
        enableSorting: false,
        cell: ({ getValue, row }) => (
          <label
            data-testid={`text-${row.original.operationKey}-label-set-operations`}
            htmlFor={`${componentId}-setOperation-${row.original.operationKey}`}
          >
            {getValue()}
          </label>
        ),
      }),
      setOperationTableColumnsHelper.accessor('count', {
        header: '# Items',
        cell: ({ row, getValue }) => (
          <CountButtonWrapperForSetsAndCases
            count={getValue()}
            filters={ { mode: "and", root : { "case_id" : {operator: 'in', field: "case_id", operands: row.original.caseIds }}} satisfies FilterSet }
            entityType="cohort"
          />
        ),
        enableSorting: true,
      }),
      setOperationTableColumnsHelper.display({
        id: 'download',
        header: 'Download',
        cell: ({ row }) => (
          <DownloadButtonTotal
            data={row.original.caseIds}
            setKey={row.original.setOperation}
            disabled={row.original.count === 0}
          />
        ),
      }),
    ],

    [selectedSets, setSelectedSets, componentId],
  );

  return (
    <VerticalTable
      customDataTestID="table-set-operations"
      data={setOperationTableData}
      columns={setOperationTableColumns}
      enableRowSelection={true}
      setRowSelection={setRowSelection}
      rowSelection={rowSelection}
      showControls={false}
      status="fulfilled"
      sorting={operationTableSorting}
      setSorting={setOperationTableSorting}
      columnSorting="enable"
      customAriaLabel="Overlap Table"
      footer={
        <tr data-testid="row-union-of-selected-sets">
          <td />
          <td className="p-2 font-bold">Union of selected sets:</td>
          <td className="w-52 px-2.5">
            <CountButtonWrapperForSetsAndCases
              count={totalCount}
              filters={
                {
                  mode: 'and',
                  root: {
                    case_id: {
                      operator: 'in',
                      field: 'case_id',
                      operands: unionData,
                    },
                  },
                } satisfies FilterSet
              }
              entityType="cohort"
            />
          </td>
          <td className="p-2.5">
            <DownloadButtonTotal
              setKey="union-of"
              data={unionData}
              disabled={totalCount === 0}
            />
          </td>
        </tr>
      }
    />
  );
};
