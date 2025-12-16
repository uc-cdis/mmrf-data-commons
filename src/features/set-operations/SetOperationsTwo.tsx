import React, { useMemo } from 'react';
import { SetOperations } from "./SetOperations";
import { SelectedEntities, SetOperationsExternalProps } from "./types";
import { useCohortCaseIdQuery } from '@/core/features/cases/caseSlice';
import { computeS2SetValues } from '@/features/set-operations/utils';
import { x } from 'tar';

export const SetOperationsTwo: React.FC<SetOperationsExternalProps> = ({
  cohorts,
}: SetOperationsExternalProps) => {

  const entities = useMemo< SelectedEntities>(() =>
    cohorts.map((x) => ({
    name: x.name, id: x.id, count: x.counts?.['case_centric'] ?? 0
  })), [cohorts]);

  const {
    data: s1Cases,
    isFetching: s1CasesFetching,
    isError: s1CasesError,
    isSuccess: s1CasesSuccess,
  } = useCohortCaseIdQuery({
    filter: cohorts[0].filters['case_centric'],
  });

  const {
    data: s2Cases,
    isFetching: s2CasesFetching,
    isError: s2CasesError,
    isSuccess: s2CasesSuccess,
  } = useCohortCaseIdQuery({
    filter: cohorts[1].filters['case_centric'],
  });

  const setData = useMemo(() => {
    if (s1CasesSuccess && s2CasesSuccess)
      return computeS2SetValues(s1Cases, s2Cases);
  }, [s1CasesSuccess, s2CasesSuccess, s1Cases, s2Cases]);

  const data = [
    {
      label: '( S1 ∩ S2 )',
      key: 'S1_intersect_S2',
      caseIds: setData?.S1_intersect_S2 ?? [],
      value: setData?.S1_intersect_S2.length ?? 0,
    },
    {
      label: '( S1 ) - ( S2 )',
      key: 'S1_minus_S2',
      caseIds: setData?.S1_minus_S2 ?? [],
      value: setData?.S1_minus_S2.length ?? 0,
    },
    {
      label: '( S2 ) - ( S1 )',
      key: 'S2_minus_S1',
      caseIds: setData?.S2_minus_S1 ?? [],
      value: setData?.S2_minus_S1.length ?? 0,
    },
  ];

  return <SetOperations entities={entities} data={data} />;
};
