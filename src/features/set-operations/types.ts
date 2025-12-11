import {
  useSetOperationsCasesTotalQuery,
  useCaseSetCountsQuery,
} from "@gen3/core";

export type SetOperationEntityType = "cohort";
export type SelectedEntity = {
  name: string;
  id: string;
};
export type SelectedEntities = SelectedEntity[];

export interface SetOperationsChartInputProps {
  selectedEntities: SelectedEntities | undefined;
  selectedEntityType?: SetOperationEntityType;
  isLoading?: boolean;
  isCohortComparisonDemo?: boolean;
}

export interface SetOperationsProps {
  readonly sets: SelectedEntities;
  readonly entityType: SetOperationEntityType;
  readonly data: {
    readonly label: string;
    readonly key: string;
    readonly value: number;
  }[];
  readonly queryHook: typeof useSetOperationsCasesTotalQuery;
  readonly countHook: typeof useCaseSetCountsQuery;
  readonly isLoading: boolean;
}

export interface SetOperationsExternalProps {
  readonly sets: SelectedEntities;
  readonly entityType: SetOperationEntityType;
  readonly queryHook: typeof useSetOperationsCasesTotalQuery;
  readonly countHook: typeof useCaseSetCountsQuery;
}
