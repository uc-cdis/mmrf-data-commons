import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import type { entityMetadataType } from '@/utils/contexts';
import { SummaryModalContext } from '@/utils/contexts';
import { expect, within } from 'storybook/test';
import { GEN3_API } from '@gen3/core';
import { SurvivalPlotTypes } from '@/core/features/survival';
import survivalApiData from '@/core/features/survival/test/data.json';
import SurvivalPlot from './SurvivalPlot';
import { http, HttpResponse } from 'msw';
import { useGeneAndSSMPanelData } from '@/features/genomic/mockedHooks';

const SurvivalPlotWrapped = () => {
  const { survivalPlotData } = useGeneAndSSMPanelData({} as any, true);
  return (
    <SurvivalPlot
      plotType={SurvivalPlotTypes.cohortComparison}
      data={survivalPlotData as any}
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

  /* play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testIds = ['survival-plot'];
    await new Promise((resolve) => setTimeout(resolve, 1000));
    testIds.forEach((id) => {
      const currEle = canvas.getByTestId(id);
      expect(currEle).toBeInTheDocument();
    });
  }, */
};
