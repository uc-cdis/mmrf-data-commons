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
    headerTitle: 'HeaderTitle',
    isModal: false,
  },
};
