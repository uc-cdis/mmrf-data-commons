import React from "react";
import { SetOperations } from "./SetOperations";
import { SetOperationsExternalProps } from "./types";

export const SetOperationsThree: React.FC<SetOperationsExternalProps> = ({
  cohorts,
  entityType,
}: SetOperationsExternalProps) => {

  const S1_intersect_S2_intersect_S3: Array<string> = [];
  const S1_intersect_S2_minus_S3: Array<string> = [];
  const S2_intersect_S3_minus_S1: Array<string> = [];
  const S1_minus_S2_union_S3: Array<string> = [];
  const S2_minus_S1_union_S3: Array<string> = [];
  const S3_minus_S1_union_S2: Array<string> = [];

  const data = [
    {
      label: '( S1 ∩ S2 ∩ S3 )',
      key: 'S1_intersect_S2_intersect_S3',
      caseIds: S1_intersect_S2_intersect_S3,
      value: S1_intersect_S2_intersect_S3.length,
    },
    {
      label: '( S1 ∩ S2 ) - ( S3 )',
      key: 'S1_intersect_S2_minus_S3',
      caseIds: S1_intersect_S2_minus_S3,
      value: S1_intersect_S2_minus_S3.length,
    },
    {
      label: '( S2 ∩ S3 ) - ( S1 )',
      key: 'S2_intersect_S3_minus_S1',
      caseIds: S1_intersect_S2_minus_S3,
      value: S2_intersect_S3_minus_S1.length,
    },
    {
      label: '( S1 ∩ S3 ) - ( S2 )',
      key: 'S1_intersect_S3_minus_S2',
      caseIds: S2_intersect_S3_minus_S1,
      value: S2_intersect_S3_minus_S1.length,
    },
    {
      label: '( S1 ) - ( S2 ∪ S3 )',
      key: 's1_minus_S2_union_S3',
      caseIds: S1_minus_S2_union_S3,
      value: S1_minus_S2_union_S3.length,
    },
    {
      label: '( S2 ) - ( S1 ∪ S3 )',
      key: 'S2_minus_S1_union_S3',
      caseIds: S2_minus_S1_union_S3,
      value: S2_minus_S1_union_S3.length,
    },
    {
      label: '( S3 ) - ( S1 ∪ S2 )',
      key: 'S3_minus_S1_union_S2',
      caseIds: S3_minus_S1_union_S2,
      value: S3_minus_S1_union_S2.length,
    },
  ];

  return (
    <SetOperations
      cohorts={cohorts}
      entityType={entityType}
      data={data}
    />
  );
};
