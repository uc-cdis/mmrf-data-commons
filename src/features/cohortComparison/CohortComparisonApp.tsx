import React from 'react';
import { FilterSet } from '@gen3/core';
import { buildNested } from "@gen3/frontend"
import CohortComparison from './CohortComparison';
import { fromArc } from 'zrender/lib/core/bbox';

const PlaceHolderCohorts = {
  "primary_cohort": {
    "filter": {
      "mode": "and",
      "root": {
        "demographic.race": buildNested("demographic.race",  {
          "operator": "includes",
          "field": "demographic.race",
          "operands": [
            "white"
          ]
        })
      },
    } as FilterSet,
    "name": "Cohort A",
    "id": "ef9ae92d-746f-4a90-a7b4-bae2aed9d9ff"
  },
  "comparison_cohort": {
    "filter": {
      "mode": "and",
      "root": {
        "demographic.gender": buildNested("demographic.gender", {

          "operator": "includes",
          "field": "demographic.gender",
          "operands": [
            "male"
          ]
        })
      }
    } as FilterSet,
    "name": "Cohort B",
    "id": "a1b4d048-1d48-45f2-a6dd-f4c33352f7d1"
  }
};

const CohortComparisonApp = () => {
  return (
    <CohortComparison cohorts={PlaceHolderCohorts} demoMode={false}/>)

}

export default CohortComparisonApp;
