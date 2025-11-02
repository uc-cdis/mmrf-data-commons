import { GQLFilter } from '@gen3/core';

export const buildGeneHaveAndHaveNotFilters = (
  currentFilters: GQLFilter | undefined,
  symbol: string,
  field: string,
  isGene: boolean,
): ReadonlyArray<GQLFilter> => {
  /**
   * given the contents, add two filters, one with the gene and one without
   */

  if (symbol === undefined) return [];
  return [
    {
      and: [
        {
          nested: {
            path: 'gene',
            '=': {
              symbol: symbol,
            },
          },
        },
        {
          in: {
            available_variation_data: isGene ? ['ssm', 'cnv'] : ['ssm'],
          },
        },
        ...(currentFilters ? (currentFilters as any).and : []),
      ],
    },
    {
      and: [
        {
          in: {
            available_variation_data: isGene ? ['ssm', 'cnv'] : ['ssm'],
          },
        },
        ...(currentFilters ? (currentFilters as any).and : []),
      ],
    },
  ];
};
