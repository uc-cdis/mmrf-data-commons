import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { entityMetadataType } from '@/utils/contexts';
import { SummaryModalContext} from '@/utils/contexts';
import { GEN3_API} from '@gen3/core';
import { useGetSurvivalPlotQuery, emptySurvivalPlot, SurvivalPlotTypes} from '@/core/survival';
import survivalApiData from "@/core/survival/test/data.json";

import SurvivalPlot from './SurvivalPlot';
import { expect, within } from '@storybook/test';
import { http, HttpResponse } from 'msw';

const SurvivalPlotWrapped = () => {
  const { data, isUninitialized, isFetching, isError } =
    useGetSurvivalPlotQuery({
      case_filters: {},
      filters: { } ,
    });

  return (
    <SurvivalPlot
      plotType={SurvivalPlotTypes.cohortComparison}
      data={data === undefined ? emptySurvivalPlot : data}
    isLoading={isFetching}/>
  );
};

const meta = {
  component: SurvivalPlotWrapped,
  title: 'components/SurvivalPlot',
  parameters: {
    deepControls: { enabled: true },
  },
  decorators: [
    (Story) => {
      const [entityMetadata, setEntityMetadata] = useState<entityMetadataType>({
        entity_type: null,
        entity_id: "unset",
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
    )},
  ],
} satisfies Meta<typeof SurvivalPlotWrapped>;

const handlers = {
  success: [
    http.post(`${GEN3_API}/analysis/survival_plot`, () => {
      return HttpResponse.json(survivalApiData);
    })
  ]
};


export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
  },
  parameters: {
    msw: handlers.success
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testIds = ['button-survival-plot-download'];
    await new Promise(resolve => setTimeout(resolve, 2000));
    testIds.forEach((id) => {
      const currEle = canvas.getByTestId(id);
      expect(currEle).toBeInTheDocument();
    });
  },
};
