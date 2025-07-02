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

  if (currentFilters === undefined) return [];
  if (symbol === undefined) return [];

  return [
    {
      and: [
        {
          //TODO: refactor cohortFilters to be Union | Intersection
          excludeifany: {
            [field]: [symbol],
          },
          in: {
            'cases.available_variation_data': isGene ? ['ssm', 'cnv'] : ['ssm'],
          },
        },
        ...(currentFilters ? (currentFilters as any) : []),
      ],
    },
    {
      and: [
        { '=': { [field]: [symbol] } },
        ...(currentFilters ? (currentFilters as any) : []),
      ],
    },
  ];
};
