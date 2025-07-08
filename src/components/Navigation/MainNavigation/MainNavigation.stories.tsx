import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import MainNavigation from './MainNavigation';

const meta = {
  component: MainNavigation,
  title: 'Components/Navigation/MainNavigation',
  parameters: {
    deepControls: { enabled: true },
  },
} satisfies Meta<typeof MainNavigation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testIds = [
      'mmrf-mainNavigation',
      'mmrf-mainNavigation-logo',
      'mmrf-mainNavigation-links',
      'mmrf-mainNavigation-search',
    ];
    await new Promise(resolve => setTimeout(resolve, 1000));
    testIds.forEach((id) => {
      const currEle = canvas.getByTestId(id);
      expect(currEle).toBeInTheDocument();
    });
  },
};
