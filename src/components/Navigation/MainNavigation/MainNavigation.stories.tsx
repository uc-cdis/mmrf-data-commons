import type { Meta, StoryObj } from '@storybook/nextjs';
import { expect, within } from 'storybook/test';
import MainNavigation from './MainNavigation';
import { Gen3Provider } from '@gen3/frontend';
import Gen3GDCCompatabilityProvider from '@/utils/providers';
import React from 'react';

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

          <MainNavigation {...args} />

        </Gen3GDCCompatabilityProvider>
      </Gen3Provider>
    </div>
  ),
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
