import type { Meta, StoryObj } from '@storybook/react';

import { TopBar }  from '@gen3/frontend';

const meta = {
  component: TopBar,
  title: 'Features/Navigation/TopBar',
  parameters: {
    deepControls: { enabled: true },
  },
} satisfies Meta<typeof TopBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {

    items: [
      {
        rightIcon: 'mmrf:video',
        href: '/',
        name: 'Video Guides',
      },
      {
        rightIcon: 'mmrf:feedback',
        href: '/',
        name: 'Send Feedback',
      },
      {
        rightIcon: 'mmrf:documentation',
        href: '/',
        name: 'Documentation',
      },
      {
        rightIcon: 'mmrf:library',
        href: '/',
        name: 'My Data Library',
      },
    ],
    loginButtonVisibility: 'visible' as any,
    classNames: {
      divider: 'border-base-min border-1',
      login: 'hover:border-base-max'
    },
    itemClassnames :{
        button: 'hover:border-base-max'
    }
  },
};
