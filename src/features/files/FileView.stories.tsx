import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
// import { registerGenesAndMutationFrequencyAnalysisTool } from '@/features/genomic/registerApp';
import Gen3GDCCompatabilityProvider from '@/utils/providers';
import { Gen3Provider } from '@gen3/frontend';
// import { ComparativeSurvival } from './types';
import { FileView } from './FileView';

const meta = {
  component: FileView,
  title: 'features/FileView',
  parameters: {
    deepControls: { enabled: true },
  },
} satisfies Meta<typeof FileView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    file: {},
    isModal: false,
  },
  render: (args) => (
    <div style={{ padding: '20px' }}>
      <Gen3Provider
        icons={[]}
        sessionConfig={{
          updateSessionTime: 5,
          inactiveTimeLimit: 20,
          logoutInactiveUsers: false,
          monitorWorkspace: false,
        }}
        modalsConfig={{
          systemUseModal: {
            title: '',
            content: {
              text: [''],
            },
            expireDays: 0,
            showOnlyOnLogin: true,
          },
        }}
      >
        <Gen3GDCCompatabilityProvider>
          <FileView {...args} />
        </Gen3GDCCompatabilityProvider>
      </Gen3Provider>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testIds = ['genes-panel'];
    await new Promise((resolve) => setTimeout(resolve, 1000));
    testIds.forEach((id) => {
      const currEle = canvas.getByTestId(id);
      expect(currEle).toBeInTheDocument();
    });
  },
};
