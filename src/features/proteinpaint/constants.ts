import { FilterSet } from "@gen3/core";

export const DEMO_COHORT_FILTERS: FilterSet = {
  mode: "and",
  root: {
    "cases.project.project_id": {
      operator: "includes",
      field: "cases.project.project_id",
      operands: ["TCGA-LGG"],
    },
  },
};
