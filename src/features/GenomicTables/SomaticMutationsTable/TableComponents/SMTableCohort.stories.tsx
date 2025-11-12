import type { Meta, StoryObj } from '@storybook/nextjs';

import SmTableCohort from './SMTableCohort';

const meta = {
  component: SmTableCohort,
} satisfies Meta<typeof SmTableCohort>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isToggledSsm : true,
    mutationID: "testis",
    isDemoMode: false,
    cohort: {
      checked: true
    },
    handleSsmToggled : () => null,
    DNAChange: "",
  }

};
