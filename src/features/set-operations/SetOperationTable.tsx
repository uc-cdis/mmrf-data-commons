import React from "react";
import VerticalTable from "@/components/Table/VerticalTable";
import {
  ColumnDef,
  createColumnHelper,
  SortingState,
} from "@tanstack/react-table";
import { useState, useId } from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import CountButtonWrapperForSetsAndCases from "./CountButtonWrapperForSetsAndCases";
import { Checkbox, Tooltip } from "@mantine/core";
import { pickBy } from "lodash";
import { SelectedEntities, SetOperationEntityType } from "./types";
import DownloadButtonTotal from "./DownloadButton";

type SetOperationTableDataType = {
  setOperation: string;
  count: number;
  operationKey: string;
};

const setOperationTableColumnsHelper =
  createColumnHelper<SetOperationTableDataType>();

export const SetOperationTable = ({
  data,
  selectedSets,
  setSelectedSets,
  entityType,
  cohorts,
}: {
  readonly cohorts: SelectedEntities;
  readonly entityType: SetOperationEntityType;
  readonly data: {
    readonly label: string;
    readonly key: string;
    readonly value: number;
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


  const totalCount =
    Object.keys(pickBy(selectedSets, (v) => v)).length > 0
      ? cohorts.length
      : 0;
  const [rowSelection, setRowSelection] = useState({});
  const [operationTableSorting, setOperationTableSorting] =
    useState<SortingState>([]);
  const componentId = useId();

  const setOperationTableData: SetOperationTableDataType[] = useDeepCompareMemo(
    () =>
      data.map((r) => ({
        setOperation: r.label,
        count: r.value,
        operationKey: r.key,
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
            filters={{ and: [] }}
            entityType={entityType}
          />
        ),
        enableSorting: true,
      }),
      setOperationTableColumnsHelper.display({
        id: 'download',
        header: 'Download',
        cell: ({ row }) => (
          <DownloadButtonTotal
            filters={{ and: [] }}
            entityType={entityType}
            setKey={row.original.setOperation}
            disabled={row.original.count === 0}
          />
        ),
      }),
    ],

    [selectedSets, entityType, cohorts, setSelectedSets, componentId],
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
              filters={{ and: [] }}
              entityType={entityType}
            />
          </td>
          <td className="p-2.5">
            <DownloadButtonTotal
              entityType="cohort"
              setKey="union-of"
              filters={{ and: [] }}
              disabled={totalCount === 0}
            />
          </td>
        </tr>
      }
    />
  );
};
