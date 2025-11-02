import { FilterSet, GQLFilter, Includes, isIncludes } from '@gen3/core';
import { ActiveGeneAndSSMFilters } from './types';

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

/**
 * Merges gene and SSM (Simple Somatic Mutation) filters by adding the corresponding filters
 * from one index (gene/ssm) to the other. The merged filters maintain the logical inclusion (`in`) operations.
 *
 * @param {ActiveGeneAndSSMFilters} filters - An object containing the active filters for both gene and SSM.
 *                                             This includes separate root filter structures for both categories.
 * @returns {ActiveGeneAndSSMFilters} A new object with merged gene and SSM filters.
 *                                    Filters from the SSM category are added to the gene filters and vice versa.
 */
export const mergeGeneAndSSMFilters = (
  filters: ActiveGeneAndSSMFilters,
): ActiveGeneAndSSMFilters => {
  const results: ActiveGeneAndSSMFilters = {
    gene: { mode: 'and', root: { ...filters.gene.root } } as FilterSet,
    ssm: { mode: 'and', root: { ...filters.ssm.root } } as FilterSet,
  };
  // add ssm filters to gene filters
  for (const [key, value] of Object.entries(filters.ssm.root)) {
    if (isIncludes(value)) {
      results.gene.root[`case.ssm.${key}`] = {
        field: `case.ssm.${key}`,
        operator: 'in',
        operands: [...value.operands],
      } satisfies Includes;
    }
  }

  // add gene filters to ssm filters
  for (const [key, value] of Object.entries(filters.gene.root)) {
    if (isIncludes(value)) {
      results.ssm.root[`consequence.transcript.gene.${key}`] = {
        field: `consequence.transcript.gene.${key}`,
        operator: 'in',
        operands: [...value.operands],
      } satisfies Includes;
    }
  }

  console.log('mergeGeneAndSSMFilters', results);
  return results;
};
