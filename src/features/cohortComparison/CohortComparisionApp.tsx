import React from 'react';
import CohortComparison from './CohortComparison';

const PlaceHolderCohorts = {
  "primary_cohort": {
    "filter": {
      "mode": "and",
      "root": {
        "cases.project.project_id": {
          "operator": "includes",
          "field": "cases.project.project_id",
          "operands": [
            "MMRF-COMMPASS"
          ]
        },
        "cases.diagnoses.treatments.therapeutic_agents": {
          "operator": "includes",
          "field": "cases.diagnoses.treatments.therapeutic_agents",
          "operands": [
            "carfilzomib"
          ]
        },
        "cases.demographic.ethnicity": {
          "operator": "includes",
          "field": "cases.demographic.ethnicity",
          "operands": [
            "not hispanic or latino"
          ]
        }
      },
      "isLoggedIn": false
    },
    "name": "MMRF agents4",
    "id": "ef9ae92d-746f-4a90-a7b4-bae2aed9d9ff"
  },
  "comparison_cohort": {
    "filter": {
      "mode": "and",
      "root": {
        "cases.project.project_id": {
          "operator": "includes",
          "field": "cases.project.project_id",
          "operands": [
            "MMRF-COMMPASS"
          ]
        },
        "cases.diagnoses.treatments.therapeutic_agents": {
          "operator": "includes",
          "field": "cases.diagnoses.treatments.therapeutic_agents",
          "operands": [
            "bortezomib"
          ]
        }
      }
    },
    "name": "MMRF agents1",
    "id": "a1b4d048-1d48-45f2-a6dd-f4c33352f7d1"
  }
};

const CohortComparisonApp = () => {
  return (
    <CohortComparison cohorts={PlaceHolderCohorts}/>)

}

export default CohortComparisonApp;
