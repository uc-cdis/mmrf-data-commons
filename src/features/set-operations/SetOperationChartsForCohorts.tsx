import React, { ReactElement } from "react";
import {
  Cohort,
  type CoreState,
  selectAvailableCohorts,
  useCoreSelector,
} from '@gen3/core';
import { Loader } from "@mantine/core";
import { SetOperationsTwo } from "./SetOperationsTwo";
import { SetOperationsThree } from "./SetOperationsThree";
import { useDeepCompareEffect, useDeepCompareMemo } from "use-deep-compare";
import { SelectedEntity } from '@/features/set-operations/types';

/**
 * This component handles the case when the user has selected cohorts for set operations.
 * It will render the selection panel if the user has not selected cohorts yet.
 * Otherwise, it will render the set operations for the selected cohorts
 * @param selectedEntities - the selected cohorts
 */
const SetOperationChartsForCohorts = ({
  selection,
}: {
  selection: SelectedEntity[] | undefined;
}): ReactElement => {

  const cohorts = useCoreSelector((state: CoreState) =>
    selectAvailableCohorts(state),
  );

  const selectedCohorts = useDeepCompareMemo(
    () => selection?.map((x) => cohorts.find((c) => x.id === c.id) as Cohort), [selection, cohorts]
  );

  return selection?.length === 0 ? (
    <div className="flex items-center justify-center w-100 h-96">
      <Loader size={100} />
    </div>
  ) : selectedCohorts?.length === 2 ? (
    <SetOperationsTwo cohorts={selectedCohorts} />
  ) : (
    <SetOperationsThree cohorts={selectedCohorts} />
  );
};

export default SetOperationChartsForCohorts;
