import React from 'react';
import type { Preview } from '@storybook/nextjs';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { http, HttpResponse } from 'msw';
import { MantineProvider } from '@mantine/core';
import { Gen3Provider } from '@gen3/frontend';
import '../src/styles/globals.css';
import '../src/styles/survivalplot.css';

import theme from '../src/mantineTheme';
import icons from './loadIcons';
import '@fontsource/montserrat';
import '@fontsource/source-sans-pro';
import '@fontsource/poppins';
import { GeneSummaryMockData } from './mockData/GeneSummaryMockData';
import { CancerDistributionMockData } from './mockData/CancerDistributionMockData';
import { SsmsTableMockData } from './mockData/SsmsTableMockData';
import { CancerDistributionCNVMockData } from './mockData/CancerDistributionCNVMockData';
import { CancerDistributionTableMockData } from './mockData/ CancerDistributionTableMockData';
import { SSMSummaryQueryMockData } from './mockData/SSMSummaryQueryMockData';
import { ConsequencesTableMockData } from './mockData/ConsequencesTableMockData';

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize({
  onUnhandledRequest: ({ url, method }) => {
    const pathname = new URL(url).pathname;
    console.log('onUnhandledRequest pathname', pathname);
    console.log('onUnhandledRequest method', method);
    if (pathname.startsWith('/my-specific-api-path')) {
      console.error(`Unhandled ${method} request to ${url}.

        This exception has been only logged in the console, however, it's strongly recommended to resolve this error as you don't want unmocked data in Storybook stories.

        If you wish to mock an error response, please refer to this guide: https://mswjs.io/docs/recipes/mocking-error-responses
      `);
    }
  },
});

const modalsConfig = {
  systemUseModal: {
    enabled: false,
    content: {
      text: [],
    },
  },
};

const sessionConfig = {
  updateSessionTime: 5,
  inactiveTimeLimit: 20,
  logoutInactiveUsers: false,
  monitorWorkspace: false,
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    msw: {
      handlers: {
        global: [
          http.get('/_status', () => {
            return HttpResponse.json({
              message: 'Feelin good!',
              csrf: '4d84419a38ee14170382bdb93b70d6cc7710.0002025-06-29T22:26:01+00:00',
            });
          }),
          http.get('/user/user', () => {
            return HttpResponse.json(null, { status: 401 });
          }),
          http.get('/user/mapping', () => {
            return HttpResponse.json({});
          }),
          // Add the Gene Summary handler here
          http.post(
            'https://dev-virtuallab.themmrf.org/guppy/graphql',
            async ({ request }) => {
              console.log('running conditional for graphql with request:', request);
              const body = await request.json(); // Parse the JSON body
              const { query } = body as any;
              // Check if the query contains the string "GeneSummary"
              if (query.includes('GeneSummary(')) {
                console.log('GeneSummary query detected');
                return HttpResponse.json(GeneSummaryMockData);
              } else if (query.includes('CancerDistribution(')) {
                console.log('CancerDistribution query detected');
                return HttpResponse.json(CancerDistributionMockData);
              } else if (query.includes('CancerDistributionCNV(')) {
                console.log('CancerDistributionCNV( query detected');
                return HttpResponse.json(CancerDistributionCNVMockData);
              } else if (query.includes(' CancerDistributionTable(')) {
                console.log(' CancerDistributionTable( query detected');
                return HttpResponse.json(CancerDistributionTableMockData);
              } else if (query.includes('SsmsTable(')) {
                console.log('SsmsTable query detected');
                return HttpResponse.json(SsmsTableMockData);
              } else if (query.includes('SSMSummaryQuery(')) {
                console.log('SSMSummaryQuery( query detected');
                return HttpResponse.json(SSMSummaryQueryMockData);
              } else if (query.includes('ConsequencesTable')) {
                console.log('ConsequencesTable( query detected');
                return HttpResponse.json(ConsequencesTableMockData);
              }
            },
          ),
        ],
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MantineProvider theme={theme}>
        <Gen3Provider
          icons={icons}
          sessionConfig={sessionConfig}
          modalsConfig={modalsConfig}
        >
          <Story />
        </Gen3Provider>
      </MantineProvider>
    ),
  ],
  loaders: [mswLoader], // 👈 Adds the MSW loader to all stories
};

export default preview;
