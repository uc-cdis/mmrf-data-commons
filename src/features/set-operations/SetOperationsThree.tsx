import React, { useMemo } from 'react';
import { SetOperations } from './SetOperations';
import { SelectedEntities, SetOperationsExternalProps } from './types';
import { useCohortCaseIdQuery } from '@/core/features/cases/caseSlice';
import { computeS3SetValues } from '@/features/set-operations/utils';
import { LoadingOverlay } from '@mantine/core';

export const SetOperationsThree: React.FC<SetOperationsExternalProps> = ({
  cohorts,
}: SetOperationsExternalProps) => {

  const entities = useMemo<SelectedEntities>(
    () =>
      cohorts.map((x) => ({
        name: x.name,
        id: x.id,
        count: x.counts?.['case_centric'] ?? 0,
      })),
    [cohorts],
  );

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

  const {
    data: s3Cases,
    isFetching: s3CasesFetching,
    isError: s3CasesError,
    isSuccess: s3CasesSuccess,
  } = useCohortCaseIdQuery({
    filter: cohorts[2].filters['case_centric'],
  });

  const setData = useMemo(() => {
    if (s1CasesSuccess && s2CasesSuccess && s3CasesSuccess)
      return computeS3SetValues(s1Cases, s2Cases, s3Cases);
  }, [
    s1CasesSuccess,
    s2CasesSuccess,
    s3CasesSuccess,
    s1Cases,
    s2Cases,
    s3Cases,
  ]);

  const data = [
    {
      label: '( S1 ∩ S2 ∩ S3 )',
      key: 'S1_intersect_S2_intersect_S3',
      caseIds: setData?.S1_intersect_S2_intersect_S3 ?? [],
      value: setData?.S1_intersect_S2_intersect_S3.length ?? 0,
    },
    {
      label: '( S1 ∩ S2 ) - ( S3 )',
      key: 'S1_intersect_S2_minus_S3',
      caseIds: setData?.S1_intersect_S2_minus_S3 ?? [],
      value: setData?.S1_intersect_S2_minus_S3.length ?? 0,
    },
    {
      label: '( S2 ∩ S3 ) - ( S1 )',
      key: 'S2_intersect_S3_minus_S1',
      caseIds: setData?.S1_intersect_S2_minus_S3 ?? [],
      value: setData?.S2_intersect_S3_minus_S1.length ?? 0,
    },
    {
      label: '( S1 ∩ S3 ) - ( S2 )',
      key: 'S1_intersect_S3_minus_S2',
      caseIds: setData?.S2_intersect_S3_minus_S1 ?? [],
      value: setData?.S2_intersect_S3_minus_S1.length ?? 0,
    },
    {
      label: '( S1 ) - ( S2 ∪ S3 )',
      key: 'S1_minus_S2_union_S3',
      caseIds: setData?.S1_minus_S2_union_S3 ?? [],
      value: setData?.S1_minus_S2_union_S3.length ?? 0,
    },
    {
      label: '( S2 ) - ( S1 ∪ S3 )',
      key: 'S2_minus_S1_union_S3',
      caseIds: setData?.S2_minus_S1_union_S3 ?? [],
      value: setData?.S2_minus_S1_union_S3.length ?? 0,
    },
    {
      label: '( S3 ) - ( S1 ∪ S2 )',
      key: 'S3_minus_S1_union_S2',
      caseIds: setData?.S3_minus_S1_union_S2 ?? [],
      value: setData?.S3_minus_S1_union_S2.length ?? 0,
    },
  ];

  if (s1CasesError || s2CasesError || s3CasesError)
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="font-medium font-montserrat text-2xl text-base-contrast-lighter">
          Error fetching data.
        </div>
      </div>
    )
  if (s1CasesFetching || s2CasesFetching || s3CasesFetching) {
    return (
      <div className="relative w-full h-64">
      <LoadingOverlay visible={s1CasesFetching || s2CasesFetching || s3CasesFetching} />
      </div>
    )
  }

  return (
      <SetOperations entities={entities} data={data} />
  );
};
