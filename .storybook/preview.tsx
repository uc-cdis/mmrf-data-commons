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

/*
 * Initializes MSW
 * See https://github.com/mswjs/msw-storybook-addon#configuring-msw
 * to learn how to customize it
 */
initialize({
  onUnhandledRequest: ({ url, method }) => {
    const pathname = new URL(url).pathname;
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
            (req) => {
              const gene_id = 7;
              // Mock response data
              const mockData = {
                data: {
                  gene: [
                    {
                      biotype: 'protein_coding',
                      description:
                        'This gene encodes a tumor suppressor protein containing transcriptional activation, DNA binding, and oligomerization domains. The encoded protein responds to diverse cellular stresses to regulate expression of target genes, thereby inducing cell cycle arrest, apoptosis, senescence, DNA repair, or changes in metabolism. Mutations in this gene are associated with a variety of human cancers, including hereditary cancers such as Li-Fraumeni syndrome. Alternative splicing of this gene and the use of alternate promoters result in multiple transcript variants and isoforms. Additional isoforms have also been shown to result from the use of alternate translation initiation codons from identical transcript variants (PMIDs: 12032546, 20937277). [provided by RefSeq, Dec 2016]',
                      external_db_ids: {
                        entrez_gene: ['7157'],
                        hgnc: ['HGNC:11998'],
                        omim_gene: ['191170'],
                        uniprotkb_swissprot: ['P04637'],
                      },
                      gene_chromosome: '17',
                      gene_start: 7661779,
                      gene_id: 'ENSG00000141510',
                      gene_end: 7687538,
                      name: 'tumor protein p53',
                      symbol: 'TP53',
                      synonyms: ['LFS1', 'p53'],
                      is_cancer_gene_census: true,
                    },
                  ],
                  ssms: {
                    ssm: {
                      clinical_annotations: {
                        civic: {
                          gene_id: {
                            histogram: [
                              {
                                key: '45',
                                count: 3,
                              },
                              {
                                key: 'no data',
                                count: 45,
                              },
                            ],
                          },
                        },
                      },
                    },
                  },
                },
              };
              return HttpResponse.json(mockData);
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
