import React, { ReactElement } from "react";
import {
  Cohort,
} from "@gen3/core";
import { Loader } from "@mantine/core";
import { SetOperationsTwo } from "./SetOperationsTwo";
import { SetOperationsThree } from "./SetOperationsThree";
import { useDeepCompareEffect, useDeepCompareMemo } from "use-deep-compare";

/**
 * This component handles the case when the user has selected cohorts for set operations.
 * It will render the selection panel if the user has not selected cohorts yet.
 * Otherwise, it will render the set operations for the selected cohorts
 * @param selectedEntities - the selected cohorts
 */
const SetOperationChartsForCohorts = ({
  cohorts,
}: {
  cohorts: Cohort[] | undefined;
}): ReactElement => {

  return cohorts?.length === 0 ? (
    <div className="flex items-center justify-center w-100 h-96">
      <Loader size={100} />
    </div>
  ) : cohorts?.length === 2 ? (
    <SetOperationsTwo
      cohorts={cohorts}
    />
  ) : (
    <SetOperationsThree
      cohorts={cohorts}
    />
  );
};

export default SetOperationChartsForCohorts;
