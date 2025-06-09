import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { GeneSummary } from './GeneSummary';

const meta = {
  component: GeneSummary,
  title: 'features/GeneSummary',
  parameters: {
    deepControls: { enabled: true },
  },
} satisfies Meta<typeof GeneSummary>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    gene_id: 'gene_id',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testIds = [
      'table-cancer-distribution-gene-summary',
      'table-most-frequent-somatic-mutations',
      'button-json-mutation-frequency',
      'button-tsv-mutation-frequency'
    ];
    testIds.forEach((id) => {
      const currEle = canvas.getByTestId(id);
      expect(currEle).toBeInTheDocument();
    });
  },
};
