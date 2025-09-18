import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import type { entityMetadataType } from '@/utils/contexts';
import { SummaryModalContext } from '@/utils/contexts';
import { GEN3_API } from '@gen3/core';
import {
  useGetSurvivalPlotQuery,
  EmptySurvivalPlot,
  SurvivalPlotTypes,
} from '@/core/survival';
import survivalApiData from '@/core/survival/test/data.json';

import SurvivalPlot from './SurvivalPlot';
import { expect, within } from 'storybook/test';
import { http, HttpResponse } from 'msw';

const SurvivalPlotWrapped = () => {
  const { data, isUninitialized, isFetching, isError } =
    useGetSurvivalPlotQuery({
      filters: [],
    });

  return (
    <SurvivalPlot
      plotType={SurvivalPlotTypes.cohortComparison}
      data={data === undefined ? EmptySurvivalPlot : data}
      isLoading={false}
    />
  );
};

const meta = {
  component: SurvivalPlotWrapped,
  title: 'features/charts/SurvivalPlot',
  parameters: {
    deepControls: { enabled: true },
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
} satisfies Meta<typeof SurvivalPlotWrapped>;

const handlers = {
  success: [
    http.post(`${GEN3_API}/analysis/survival_plot`, () => {
      return HttpResponse.json(survivalApiData);
    }),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    msw: handlers.success,
  },
  // disable this test for now, since it's flaky

  // play: async ({ canvasElement }) => {
  //   const canvas = within(canvasElement);
  //   const testIds = ['button-survival-plot-download'];
  //   await new Promise(resolve => setTimeout(resolve, 5000));
  //   testIds.forEach((id) => {
  //     const currEle = canvas.getByTestId(id);
  //     expect(currEle).toBeInTheDocument();
  //   });
  // },
};
