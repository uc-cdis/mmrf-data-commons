import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import type { entityMetadataType } from '@/utils/contexts';
import { SummaryModalContext } from '@/utils/contexts';
import { expect, within } from 'storybook/test';
import { CaseView } from './CaseView';
import casesViewData from './data/caseViewData.json';

const CaseViewWrapped = () => {
  const case_id = '123';
  const bio_id = 'abc';
  const isModal = false,
    shouldScrollToBio = false;

  const annotationCountData = { pagination: { total: 10 } };
  const { data } = casesViewData;
  return (
    <CaseView
      case_id={case_id}
      bio_id={bio_id as string}
      data={data?.hits?.[0]}
      annotationCountData={annotationCountData?.pagination.total}
      isModal={isModal}
      shouldScrollToBio={shouldScrollToBio}
    />
  );
};

const meta = {
  component: CaseViewWrapped,
  title: 'features/caseView',
  parameters: {
    deepControls: { enabled: true },
  },
  decorators: [
    (Story) => {
      const [entityMetadata, setEntityMetadata] = useState<entityMetadataType>({
        entity_type: null,
        entity_id: 'unset',
      });

      return <Story />;
    },
  ],
} satisfies Meta<typeof CaseViewWrapped>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testIds = [
      'table-summary-case-summary',
      'table-clinical-case-summary',
      'table-biospecimen-case-summary',
      'text-file-count-case-summary',
    ];
    await new Promise((resolve) => setTimeout(resolve, 1000));
    testIds.forEach((id) => {
      const currEle = canvas.getByTestId(id);
      expect(currEle).toBeInTheDocument();
    });
  },
};
