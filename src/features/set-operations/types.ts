import { Cohort } from '@gen3/core';

export type SetOperationEntityType = "cohort";
export type SelectedEntity = {
  name: string;
  id: string;
  count: number;
};
export type SelectedEntities = SelectedEntity[];

export interface SetOperationsChartInputProps {
  selectedEntities: SelectedEntities | undefined;
  selectedEntityType?: SetOperationEntityType;
  isLoading?: boolean;
  isCohortComparisonDemo?: boolean;
}

export interface SetOperationsProps {
  readonly entities: SelectedEntities;
  readonly data: {
    readonly label: string;
    readonly key: string;
    readonly value: number;
    readonly caseIds: string[];
  }[];
}

export interface SetOperationsExternalProps {
  readonly cohorts: Cohort[];
}

export interface SetOperationsData {
  case_ids: string[];
}
