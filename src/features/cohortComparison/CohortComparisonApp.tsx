import React, { useContext, useEffect, useState } from 'react';
import {
  useCoreSelector,
  type Cohort,
  usePrevious,
  selectCohortIds,
  selectCohortById,
  EmptyFilterSet,
  selectCurrentCohort,
} from '@gen3/core';
import { useDeepCompareEffect } from 'use-deep-compare';
import { SelectionScreenContext } from '@/components/analysis';
import CohortComparison from './CohortComparison';
import AdditionalCohortSelection from './AdditionalCohortSelection';


const CohortComparisonApp = () => {
  const { selectionScreenOpen, setSelectionScreenOpen, app, setActiveApp } =
    useContext(SelectionScreenContext);

  const allCohortsIds =useCoreSelector(selectCohortIds);

  const primaryCohort = useCoreSelector((state) => selectCurrentCohort(state));

  const [comparisonCohort, setComparisonCohort] = useState<Cohort>();
  const comparisonCohortObj: Cohort | null = useCoreSelector((state) =>
    comparisonCohort?.id ? selectCohortById(state, comparisonCohort.id) : null,
  );
  const comparisonCohortFilter = comparisonCohortObj?.filters;
  /* Comparison Cohort Details End */

  useEffect(() => {
    console.log("CohortComparisonApp", comparisonCohort);
  }, [comparisonCohort]);

  const cohorts = {
    primary_cohort: {
      filter: primaryCohort.filters && 'case' in  primaryCohort.filters ?  primaryCohort.filters['case'] : EmptyFilterSet,
      name: primaryCohort.name ?? 'uninitialize',
      id: primaryCohort.id ?? 'uninitialized',
      counts: primaryCohort.counts?.['case'] ?? 0,
    },
    comparison_cohort: {
      filter: comparisonCohortFilter && 'case' in comparisonCohortFilter
        ? comparisonCohortFilter['case']
        : EmptyFilterSet,
      name: comparisonCohort?.name ?? 'uninitialize',
      id: comparisonCohort?.id ?? 'uninitialize',
      counts: comparisonCohort?.counts?.['case'] ?? 0,
    },
  };

  console.log("CohortComparisonApp", cohorts);

  const prevPrimaryCohortId  = usePrevious<string|undefined>( primaryCohort?.id);
  const prevComparisonCohortId = usePrevious<string|undefined>(comparisonCohort?.id);

  useDeepCompareEffect(() => {
    if (
      (prevPrimaryCohortId && !allCohortsIds.includes(prevPrimaryCohortId) ||
        prevComparisonCohortId&&  !allCohortsIds.includes(prevComparisonCohortId))
    ) {
      if (setSelectionScreenOpen)
        setSelectionScreenOpen(true);
    }
  }, [
    allCohortsIds,
    prevPrimaryCohortId,
    prevComparisonCohortId,
    setSelectionScreenOpen,
  ]);

  return selectionScreenOpen ? (
    <AdditionalCohortSelection
      app={app}
      setOpen={setSelectionScreenOpen}
      setActiveApp={setActiveApp}
      setComparisonCohort={setComparisonCohort}
      index="case"
    />
  ) : (
    <CohortComparison cohorts={cohorts} demoMode={false} />
  );
};

export default CohortComparisonApp;
