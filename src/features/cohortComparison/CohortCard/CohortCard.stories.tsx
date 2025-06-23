import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import CohortCard from './CohortCard';
import { CohortComparisonType } from '@/features/cohortComparison/types';
import { convertFilterSetToGqlFilter, FilterSet, GEN3_API, GEN3_AUTHZ_API, GEN3_FENCE_API } from '@gen3/core';
import { http, HttpResponse } from 'msw';
import { GEN3_COHORT_COMPARISON_API } from '@/core/features/cohortComparison/constants';
import cohortComparisonQueryData from '@/core/features/cohortComparison/test/cohortComparisonQuery.json';
import pValueQueryResults from '@/core/features/cohortComparison/test/pValueQuery.json';
import { useCohortFacetsQuery } from '@/core/features/cohortComparison';
import { entityMetadataType, SummaryModalContext } from '@/utils/contexts';
import vennData from '@/core/features/cohortComparison/test/vennData.json';

const primary: FilterSet = {
  mode: 'and',
  root: {
    case_id: {
      field: 'case_id',
      operator: 'in',
      operands: ['0000001'],
    },
  },
};

const comparison: FilterSet = {
  mode: 'and',
  root: {
    case_id: {
      field: 'case_id',
      operator: 'in',
      operands: ['0000001', '0000002'],
    },
  },
};

const fields = {
  survival: "Survival",
  ethnicity: "demographic.ethnicity",
  gender: "demographic.gender",
  race: "demographic.race",
  vital_status: "demographic.vital_status",
  age_at_diagnosis: "diagnoses.age_at_diagnosis",
};

interface CohortCardWrappedProps {
  readonly options: Record<string, string>;
  readonly cohorts: CohortComparisonType;
  readonly survivalPlotSelectable: boolean;
  readonly caseSetIds: string[];
  readonly casesFetching: boolean;
}
const CohortCardWrapped = ({
    options,
  cohorts,
  survivalPlotSelectable,
  caseSetIds,
  casesFetching,
                           } : CohortCardWrappedProps) => {

  const [selectedCards, setSelectedCards] = useState({
    survival: true,
    ethnicity: false,
    gender: true,
    race: false,
    vital_status: true,
    age_at_diagnosis: true,
  } as Record<string, boolean>);

  const fieldsToQuery = Object.values(fields).filter((v) => v !== "Survival");

  const {
    data: cohortFacetsData,
    isFetching: cohortFacetsFetching,
    isLoading: cohortFacetsLoading,
    isUninitialized: cohortFacetsUninitialized,
  } = useCohortFacetsQuery({
    primaryCohort: convertFilterSetToGqlFilter(cohorts.primary_cohort.filter),
    comparisonCohort: convertFilterSetToGqlFilter(
      cohorts.comparison_cohort.filter,
    ),
    facetFields: fieldsToQuery,
  });

  const counts = cohortFacetsData?.caseCounts || [];

  return (
    <CohortCard cohorts={cohorts}
                selectedCards={selectedCards}
                setSelectedCards={setSelectedCards}
                counts={counts}
                options={options}
                survivalPlotSelectable={survivalPlotSelectable}
                caseSetIds={caseSetIds}
                casesFetching={casesFetching}
                />

  );
};

const meta = {
  component: CohortCardWrapped,
  title: 'features/CohortComparison/CohortCard',
} satisfies Meta<typeof CohortCardWrapped>;

export default meta;

type Story = StoryObj<typeof meta>;

const handlers = {
  success: [
    http.get(`${GEN3_API}/_status`, () => {
      return HttpResponse.json({
        "message": "Feeling good with storybook!",
        "csrf": "6640e4857e5cb3b42db303d8ee3a4ace11900.0002025-06-17T15:24:53+00:00"
      });
    }),
    http.get(`${GEN3_AUTHZ_API}/mapping`, () => {
      return HttpResponse.json({
      });
    }),
    http.get(`${GEN3_FENCE_API}/user`, () => {
      return HttpResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }),

    http.post(`${GEN3_COHORT_COMPARISON_API}/graphql`, () => {
      return HttpResponse.json(cohortComparisonQueryData);
    }),

    http.post(`${GEN3_COHORT_COMPARISON_API}/pvalue`, () => {
      return HttpResponse.json(pValueQueryResults);
    }),
    http.post(`${GEN3_COHORT_COMPARISON_API}/venn`, () => {
      return HttpResponse.json(vennData);
    }),
  ],
};


export const Default: Story = {
  args: {
    cohorts: {
      primary_cohort: {
        name: 'Primary',
        id: 'primary',
        filter: primary,
      },
      comparison_cohort: {
        name: 'Comparison',
        id: 'comparison',
        filter: comparison,
      },
    },
    caseSetIds: [],
    casesFetching: false,
    survivalPlotSelectable: true,
    options: {
      'Survival Plot': 'survival',
      'Ethnicity': 'ethnicity',
      'Gender': 'gender',
      'Race': 'race',
      'Vital Status': 'vital_status',
    }
  },
  parameters: {
    msw: handlers.success,
  },
};
