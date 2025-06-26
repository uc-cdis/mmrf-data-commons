import React from 'react';
import { FilterSet } from '@gen3/core';

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

const GenesAndMutationFrequencyAnalysisTool = () => {
  return (
    <div>Placeholder</div>
  )
}

export default GenesAndMutationFrequencyAnalysisTool;
