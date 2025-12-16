import React from "react";
import VerticalTable from "@/components/Table/VerticalTable";
import { createColumnHelper, SortingState } from "@tanstack/react-table";
import { upperFirst } from "lodash";
import { useMemo, useState } from "react";
import { SelectedEntities } from "./types";

type SummaryTableDataType = {
  idx: number;
  entityType: string;
  name: string;
  count: string | number;
};

export const SetOperationsSummaryTable = ({
  entities,
}: {
  entities: SelectedEntities;
}): JSX.Element => {
  const summaryTableData: SummaryTableDataType[] = useMemo(
    () =>
      entities.map((set, idx) => ({
        idx,
        entityType: 'Cohort',
        name: set.name,
        count: set.count,
      })),
    [entities],
  );

  const [summaryTableSorting, setSummaryTableSorting] = useState<SortingState>(
    [],
  );
  const summaryTableColumnsHelper = createColumnHelper<SummaryTableDataType>();
  const summaryTableColumns = useMemo(
    () => [
      summaryTableColumnsHelper.display({
        id: 'alias',
        header: 'Alias',
        cell: ({ row }) => (
          <span>
            S<sub>{row.original.idx + 1}</sub>
          </span>
        ),
      }),
      summaryTableColumnsHelper.accessor('entityType', {
        id: 'entityType',
        header: 'Entity Type',
        enableSorting: false,
      }),
      summaryTableColumnsHelper.accessor('name', {
        id: 'name',
        header: 'Name',
        enableSorting: false,
      }),
      summaryTableColumnsHelper.accessor('count', {
        header: '# Items',
        enableSorting: true,
        cell: ({ getValue }) =>
          getValue() !== undefined ? getValue().toLocaleString() : '...',
      }),
    ],
    [summaryTableColumnsHelper],
  );

  return (
    <VerticalTable
      customDataTestID="table-summary-set-operations"
      data={summaryTableData}
      columns={summaryTableColumns}
      showControls={false}
      sorting={summaryTableSorting}
      setSorting={setSummaryTableSorting}
      columnSorting="enable"
      customAriaLabel={'Summary Table'}
    />
  );
};
