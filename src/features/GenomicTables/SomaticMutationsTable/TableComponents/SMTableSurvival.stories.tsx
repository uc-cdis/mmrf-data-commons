import type { Meta, StoryObj } from '@storybook/nextjs';

import SmTableSurvival from './SMTableSurvival';

const meta = {
  component: SmTableSurvival,
} satisfies Meta<typeof SmTableSurvival>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
 args: {
   affectedCasesInCohort: {
     numerator: 10,
     denominator: 100
   },
   survival: {
     label: "test",
     name: "name",
     symbol: "KRAS",
     checked: true
   },
   proteinChange: {
     symbol: "test",
     aaChange: "xxxxxxxx",
     geneId: "ES000000339944"

   },
   handleSurvivalPlotToggled: (symbol: string, name: string, field: string) => null
 }
};
