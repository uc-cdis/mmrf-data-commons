import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import { SummaryHeader } from './SummaryHeader';

const meta = {
  component: SummaryHeader,
  title: 'components/SummaryHeader',
  parameters: {
    deepControls: { enabled: true },
  },
} satisfies Meta<typeof SummaryHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: '/icons/genes.svg',
    headerTitleLeft: 'Gene',
    headerTitle: 'HeaderTitle',
    isModal: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testIds = [
      'summary-header',
      'summary-header-title',
      'summary-header-icon',
    ];
    testIds.forEach((id) => {
      const currEle = canvas.getByTestId(id);
      expect(currEle).toBeInTheDocument();
    });
  },
};
