import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';
import SSMSCancerDistributionTable from './index';

const meta = {
  component: SSMSCancerDistributionTable,
  title: 'components/SSMSCancerDistributionTable',
  parameters: {
    deepControls: { enabled: true },
  },
} satisfies Meta<typeof SSMSCancerDistributionTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ssms: 'ssms',
    symbol: 'symbol',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testIds = ['SSMSCancerDistributionTable'];
    await new Promise(resolve => setTimeout(resolve, 1000));
    testIds.forEach((id) => {
      const currEle = canvas.getByTestId(id);
      expect(currEle).toBeInTheDocument();
    });
  },
};
