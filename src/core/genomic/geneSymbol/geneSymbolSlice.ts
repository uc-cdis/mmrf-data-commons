import { guppyApi } from '@gen3/core';

const GeneSymbolQuery = `
          query GeneSymbol(
            $filters: JSON
          ) {
            viewer {
              explore {
                genes {
                  hits(filters: $filters, first: 1000) {
                    edges {
                      node {
                        symbol
                        gene_id
                      }
                    }
                  }
                }
              }
            }
          }
`;

const geneSymbolSlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    geneSymbol: builder.query<string | undefined, string>({
      query: (gene_id: string) => {
        const graphQLFilters = { filters: { in: { gene_id: [gene_id] } } };

        return {
          query: GeneSymbolQuery,
          variables: graphQLFilters,
        };
      },
      transformResponse: (response: any) =>
        response.data?.gene?.symbol ?? 'unknown',
    }),
  }),
});

export const { useGeneSymbolQuery, useLazyGeneSymbolQuery } = geneSymbolSlice;
