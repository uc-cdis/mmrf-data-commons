import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { entityMetadataType } from '@/utils/contexts';
import { SummaryModalContext } from '@/utils/contexts';
import { useCohortFacetsQuery } from '@/core/features/cohortComparison';
import { convertFilterSetToGqlFilter, FilterSet, GEN3_API, GEN3_AUTHZ_API, GEN3_FENCE_API } from '@gen3/core';
import { CohortComparisonFields } from "../types";

import cohortComparisonQueryData from '@/core/features/cohortComparison/test/cohortComparisonQuery.json';
import pValueQueryResults from '@/core/features/cohortComparison/test/pValueQuery.json';

import FacetCard from './index';
import { http, HttpResponse } from 'msw';
import { CohortComparisonType } from '@/features/cohortComparison/types';
import { GEN3_COHORT_COMPARISON_API } from '@/core/features/cohortComparison/constants';

interface FacetCardWrappedProps {
  readonly field: string;
  readonly cohorts: CohortComparisonType;
}

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

const FacetCardWrapped = ({ field, cohorts }: FacetCardWrappedProps) => {
  const facetFields = [
    'demographic.ethnicity',
    'demographic.gender',
    'demographic.race',
    'demographic.vital_status',
    'diagnoses.age_at_diagnosis',
  ];

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
    facetFields: facetFields,
  });

  const counts = cohortFacetsData?.caseCounts || [];
  return (
    <FacetCard
      cohorts={cohorts}
      counts={counts}
      data={
        cohortFacetsData?.aggregations
          ? cohortFacetsData.aggregations.map(
            (d: any) => d[CohortComparisonFields[field]], // TODO: tighten typing
          )
          : []
      }
      field={CohortComparisonFields[field]}
    />
  );
};

const meta = {
  component: FacetCardWrapped,
  title: 'features/CohortComparison/FacetCard',
  /* --
  argTypes: {
    field: {
      options: ['vital_status', 'ethnicity', 'age_at_diagnosis', 'gender', 'race'],
      control: { type: 'select' },
    }
  },
  -- */
  parameters: {
    deepControls: { enabled: true },
    field: 'vital_status',
  },
  decorators: [
    (Story) => {
      const [entityMetadata, setEntityMetadata] = useState<entityMetadataType>({
        entity_type: null,
        entity_id: 'unset',
      });

      return (
        <SummaryModalContext.Provider
          value={{
            entityMetadata,
            setEntityMetadata,
          }}
        >
          <Story />
        </SummaryModalContext.Provider>
      );
    },
  ],
} satisfies Meta<typeof FacetCardWrapped>;

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
      })
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    field: 'vital_status',
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
  },
  parameters: {
    msw: handlers.success,
  },
};
