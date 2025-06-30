import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    {
      name: 'storybook-addon-manual-mocks',
      options: {
        mocksFolder: '__mocks__',
      },
    },
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    //  exclude SVGs from existing image rule and use SVGR instead
    const imageRule = config.module?.rules?.find((rule) => {
      const test = (rule as { test: RegExp }).test;
      return test && test.test('.svg');
    }) as { [key: string]: any };

    if (imageRule) {
      imageRule.exclude = /\.svg$/; // Exclude SVGs from the existing image rule
    }

    // Add a new rule for handling SVGs with SVGR
    config.module?.rules?.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default config;
