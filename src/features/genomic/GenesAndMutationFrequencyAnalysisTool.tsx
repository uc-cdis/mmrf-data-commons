import React, { useCallback, useState } from "react";
import { useDeepCompareCallback, useDeepCompareEffect } from "use-deep-compare";
import { Tabs } from "@mantine/core";
import {
  FilterSet,
  useCoreSelector,
  useCoreDispatch,
  removeCohortFilter,
  updateCohortFilter as updateActiveCohortFilter,
  selectCurrentCohortId,
  usePrevious,
} from "@gen3/core";
import { useAppDispatch } from "@/features/genomic/appApi";
import { clearGeneAndSSMFilters } from "@/features/genomic/geneAndSSMFiltersSlice";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { ComparativeSurvival, AppModeState } from "./types";

export const overwritingDemoFilterMutationFrequency: FilterSet = {
  mode: "and",
  root: {
    "cases.project.project_id": {
      operator: "includes",
      field: "cases.project.project_id",
      operands: ["TCGA-LGG"],
    },
  },
};

interface GeneSearchTerms {
  geneId?: string;
  geneSymbol?: string;
}

const GenesAndMutationFrequencyAnalysisTool = () => {
  const isDemoMode = useIsDemoApp();
  const coreDispatch = useCoreDispatch();
  const appDispatch = useAppDispatch();
  const [comparativeSurvival, setComparativeSurvival] =
    useState<ComparativeSurvival|undefined>(undefined);
  const [appMode, setAppMode] = useState<AppModeState>("genes");
  const [searchTermsForGeneId, setSearchTermsForGeneId] = useState<GeneSearchTerms>({
    geneId: undefined,
    geneSymbol: undefined,
  });

  const cohortId = useCoreSelector((state) => selectCurrentCohortId(state));
  const prevId = usePrevious(cohortId);

  /**
   * Update the survival plot in response to user actions. There are two "states"
   * for the survival plot: If comparativeSurvival is undefined it will show the
   * plot for the currentCohort plus whatever local filters are selected for the "top"
   * gene or mutation.
   * If comparativeSurvival is set, then it will show two separate plots.
   * @param symbol - symbol (Gene or SSMS) to compare
   * @param name - used as the label for the symbol in the Survival Plot
   * @param field - which gene or ssms field the symbol applied to
   */
  const handleSurvivalPlotToggled = useDeepCompareCallback(
    (symbol: string, name: string, field: string) => {
      if (comparativeSurvival && comparativeSurvival?.symbol === symbol) {
        setComparativeSurvival(undefined);
      } else {
        setComparativeSurvival({
          symbol: symbol,
          name: name,
          field: field,
          setManually: true,
        });
      }
    },
    [comparativeSurvival],
  );

  /**
   * remove comparative survival plot when tabs or filters change.
   */
  const handleTabChanged = useCallback(
    (tabKey: string) => {
      setAppMode(tabKey as AppModeState);
      setComparativeSurvival(undefined);
      if (searchTermsForGeneId.geneId || searchTermsForGeneId.geneSymbol) {
        setSearchTermsForGeneId({ geneId: undefined, geneSymbol: undefined });
      }
    },
    [searchTermsForGeneId.geneId, searchTermsForGeneId.geneSymbol],
  );

  const handleMutationCountClick = useCallback(
    (geneId: string, geneSymbol: string) => {
      setAppMode("ssms");
      setSearchTermsForGeneId({ geneId: geneId, geneSymbol: geneSymbol });
    },
    [],
  );

  const clearSearchTermsForGene = useCallback(() => {
    setSearchTermsForGeneId({ geneId: undefined, geneSymbol: undefined });
  }, [setSearchTermsForGeneId]);

  const [tableXPosition, setTableXPosition] = useState<number|undefined>(undefined);

  return (
    <div>Placeholder</div>
  )
}

export default GenesAndMutationFrequencyAnalysisTool;
