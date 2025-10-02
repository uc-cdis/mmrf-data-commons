import type { Meta, StoryObj } from '@storybook/nextjs';

import { TopBar }  from '@gen3/frontend';

const meta = {
  component: TopBar,
  title: 'Components/Navigation/TopBar',
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
    },
    itemClassnames :{
        button: 'hover:border-accent'
    }
  },
};
