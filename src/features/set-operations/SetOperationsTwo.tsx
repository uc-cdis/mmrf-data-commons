import React from "react";
import { SetOperations } from "./SetOperations";
import { SetOperationsExternalProps } from "./types";

export const SetOperationsTwo: React.FC<SetOperationsExternalProps> = ({
  cohorts,
  entityType,
}: SetOperationsExternalProps) => {

  const intersectionData: Array<string>  = []
  const s1MinusS2Data: Array<string> = [];
  const s2MinusS1Data: Array<string> = [];

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
      entityType={entityType}
      data={data}
    />
  );
};
