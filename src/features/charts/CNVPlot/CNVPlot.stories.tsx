import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';
import CNVPlot from '.';

const meta = {
  component: CNVPlot,
  title: 'features/charts/CNVPlot',
  parameters: {
    deepControls: { enabled: true },
  },
} satisfies Meta<typeof CNVPlot>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gene: 'gene-id',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testIds = ['graph-cancer-distribution-cnv', 'chart-text-version'];
    await new Promise((resolve) => setTimeout(resolve, 1000));
    testIds.forEach((id) => {
      const currEle = canvas.getByTestId(id);
      expect(currEle).toBeInTheDocument();
    });
  },
};
