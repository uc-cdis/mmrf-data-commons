import React, { useContext, useEffect, useState } from "react";
import {
  SelectedEntities,
  SetOperationEntityType,
} from "@/features/set-operations/types";
import SetOperationChartsForCohorts from "@/features/set-operations/SetOperationChartsForCohorts";
import { SelectionScreenContext } from '@/components/analysis';
import SelectionPanel from "@/features/set-operations/SelectionPanel";
import { useRouter } from "next/router";
import { useCoreSelector } from "@gen3/core";
import { LoadingOverlay } from "@mantine/core";
import { useDeepCompareEffect } from "use-deep-compare";

const SetOperationsSelection = (): JSX.Element => {
  const [selectedEntities, setSelectedEntities] = useState<SelectedEntities>(
    [],
  );
  const [selectedEntityType, setSelectedEntityType] = useState<
    SetOperationEntityType
  >('cohort');

  const {
    query: { cohort1Id, cohort2Id },
    isReady,
  } = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isReady) {
      setReady(true);
    }
  }, [isReady]);

  const { selectionScreenOpen, setSelectionScreenOpen, app, setActiveApp } =
    useContext(SelectionScreenContext);

  // Link from Cohort Comparison app can set the viewed cohorts
  const overwriteSelectedEntities = cohort1Id && cohort2Id;

  // Need to get current ids of selected cohorts because the ids update after the cohort is saved
  const cohorts = useCoreSelector((state: any) =>
    selectMultipleCohortsByIdOrName(
      state,
      overwriteSelectedEntities
        ? [{ id: cohort1Id as string }, { id: cohort2Id as string }]
        : selectedEntityType === "cohort"
        ? selectedEntities
        : [],
    ),
  );

  useDeepCompareEffect(() => {
    if ( overwriteSelectedEntities) {
      setSelectedEntityType("cohort");
    }

    // A cohort has been deleted, kick user back to selection screen
    if (cohorts.length < 2) {
      setSelectionScreenOpen(true);
    }
  }, [
    cohorts,
    setSelectionScreenOpen,
    overwriteSelectedEntities,
  ]);

  return !ready ? (
    <LoadingOverlay data-testid="loading-spinner" visible />
  ) : selectionScreenOpen ? (
    <SelectionPanel
      app={app ?? ''}
      setActiveApp={setActiveApp}
      setOpen={setSelectionScreenOpen}
      selectedEntities={
        selectedEntityType === "cohort"
          ? cohorts.map((cohort: any) => ({
              id: cohort.id,
              name: cohort.name,
            }))
          : selectedEntities
      }
      setSelectedEntities={setSelectedEntities}
      selectedEntityType={selectedEntityType}
      setSelectedEntityType={setSelectedEntityType}
    />
  ) : (
    // handle cohorts as they require case set to be available
    <SetOperationChartsForCohorts
      cohorts={cohorts}
    />
  );
};

export default SetOperationsSelection;
