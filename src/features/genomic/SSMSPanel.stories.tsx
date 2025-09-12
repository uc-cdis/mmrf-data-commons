import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';
import { SSMSPanel } from './SSMSPanel';
import Gen3GDCCompatabilityProvider from '@/utils/providers';
import { Gen3Provider } from '@gen3/frontend';
import { ComparativeSurvival } from './types';

const meta = {
  component: SSMSPanel,
  title: 'features/SSMSPanel',
  parameters: {
    deepControls: { enabled: true },
  },
} satisfies Meta<typeof SSMSPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    topGeneSSMSSuccess: false,
    comparativeSurvival: {} as ComparativeSurvival,
    handleSurvivalPlotToggled: () => {},
    handleGeneAndSSmToggled: () => null,
    searchTermsForGene: {},
    clearSearchTermsForGene: () => null,
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
          <SSMSPanel {...args} />
        </Gen3GDCCompatabilityProvider>
      </Gen3Provider>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testIds = ['ssms-panel'];
    await new Promise((resolve) => setTimeout(resolve, 1000));
    testIds.forEach((id) => {
      const currEle = canvas.getByTestId(id);
      expect(currEle).toBeInTheDocument();
    });
  },
};
