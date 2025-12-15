import React, { useMemo } from 'react';
import { SetOperations } from "./SetOperations";
import { SetOperationsExternalProps } from "./types";
import { useCohortCaseIdQuery } from '@/core/features/cases/caseSlice';
import { computeS2SetValues } from '@/features/set-operations/utils';

export const SetOperationsTwo: React.FC<SetOperationsExternalProps> = ({
  cohorts,
}: SetOperationsExternalProps) => {

  const intersectionData: Array<string>  = []
  const s1MinusS2Data: Array<string> = [];
  const s2MinusS1Data: Array<string> = [];

  const { data: s1Cases, isFetching: s1CasesFetching, isError: s1CasesError, isSuccess: s1CasesSuccess } = useCohortCaseIdQuery({
    filter: cohorts[0].filters['case_centric'],
  });

  const {
    data: s2Cases,
    isFetching: s2CasesFetching,
    isError: s2CasesError,
    isSuccess: s2CasesSuccess,
  } = useCohortCaseIdQuery({
    filter: cohorts[0].filters['case_centric'],
  });

  const setData = useMemo(() => {
    if (s1CasesSuccess && s2CasesSuccess)
      return computeS2SetValues(s1Cases, s2Cases);

  }, [s1CasesSuccess, s2CasesSuccess, s1Cases, s2Cases]);


  const data = [
    {
      label: '( S1 ∩ S2 )',
      key: 'S1_intersect_S2',
      caseIds: intersectionData,
      value: intersectionData.length,
    },
    {
      label: '( S1 ) - ( S2 )',
      key: 'S1_minus_S2',
      caseIds: s1MinusS2Data,
      value: s1MinusS2Data.length,
    },
    {
      label: '( S2 ) - ( S1 )',
      key: 'S2_minus_S1',
      caseIds: s2MinusS1Data,
      value: s2MinusS1Data.length,
    },
  ];

  return (
    <SetOperations
      cohorts={cohorts}
      data={data}
    />
  );
};
