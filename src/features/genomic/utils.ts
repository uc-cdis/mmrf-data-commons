import { GQLFilter } from '@gen3/core';

export const buildGeneHaveAndHaveNotFilters = (
  currentFilters: GQLFilter,
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
          //TODO: refactor cohortFilters to be Union | Intersection
          excludeifany: { [field]: [symbol] },
        },
        {
          in: {
            'cases.available_variation_data': isGene ? ['ssm', 'cnv'] : ['ssm'],
          },
        },
        ...(currentFilters ? (Object(currentFilters).values[0] as never) : []),
      ],
    },
    {
      and: [
        {
          '=': {
            [field]: symbol,
          },
        },
        ...(currentFilters ? (Object(currentFilters).values[0] as never) : []),
      ],
    },
  ];
};
