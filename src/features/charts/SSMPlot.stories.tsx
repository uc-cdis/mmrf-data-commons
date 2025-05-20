import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import SSMPlot from './SSMPlot';

const meta = {
  component: SSMPlot,
  title: 'components/SSMPlot',
  parameters: {
    deepControls: { enabled: true },
  },
} satisfies Meta<typeof SSMPlot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    page: 'gene',
    gene: 'gene-id',
    ssms: 'ssms-id',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testIds = [
      'graph-cancer-distribution-mutations',
      'chart-text-version',
    ];
    testIds.forEach((id) => {
      const currEle = canvas.getByTestId(id);
      expect(currEle).toBeInTheDocument();
    });
  },
};
