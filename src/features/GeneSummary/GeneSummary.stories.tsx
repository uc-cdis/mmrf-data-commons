import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';
import { GeneSummary } from './GeneSummary';
import { entityMetadataType, SummaryModalContext } from '@/utils/contexts';

const meta = {
  component: GeneSummary,
  title: 'features/GeneSummary',
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    testIds.forEach((id) => {
      const currEle = canvas.getByTestId(id);
      expect(currEle).toBeInTheDocument();
    });
  },
};
