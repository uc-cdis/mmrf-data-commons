import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { entityMetadataType } from '@/utils/contexts';
import { SummaryModalContext } from '@/utils/contexts';
import { useCohortFacetsQuery } from '@/core/features/cohortComparison';
import { convertFilterSetToGqlFilter, FilterSet } from '@gen3/core';
import { CohortComparisonFields } from "../types";

import cohortComparisionQueryData from '@/core/features/cohortComparison/test/cohortComparisonQuery.json';
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

const comparision: FilterSet = {
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

  return (
    <FacetCard
      cohorts={cohorts}
      counts={[1, 1]}
      data={
        cohortFacetsData?.aggregations
          ? cohortFacetsData.aggregations.map(
            (d: any) => d[CohortComparisonFields[field]], // TODO: tighten typeing
          )
          : []
      }
      field={CohortComparisonFields[field]}
    />
  );
};

const meta = {
  component: FacetCardWrapped,
  title: 'components/SurvivalPlot',
  parameters: {
    deepControls: { enabled: true },
    field: 'demographic.vital_status',
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
    http.post(`${GEN3_COHORT_COMPARISON_API}`, () => {
      return HttpResponse.json(cohortComparisionQueryData);
    }),
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
        filter: comparision,
      },
    },
  },
  parameters: {
    msw: handlers.success,
  },
};
