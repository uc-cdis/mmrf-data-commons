import { buildNestedGQLFilter, GQLFilter, isIncludes, Includes} from '@gen3/core';
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
        { "nested" : { "path" : "gene",
            '=': {
              'symbol': symbol
            },
          }},
        { in: {
              'available_variation_data': isGene
                ? ['ssm', 'cnv']
                : ['ssm'],
            }},
          ...(currentFilters ? ((currentFilters as any).and) : []),
      ],
    },
    {
      and: [
        { in: {
            'available_variation_data': isGene
              ? ['ssm', 'cnv']
              : ['ssm'],
          }},
        ...(currentFilters ? ((currentFilters as any).and) : [])
      ],
    },
  ];
};

export const mergeGeneAndSSMFilters = (filters: ActiveGeneAndSSMFilters) : ActiveGeneAndSSMFilters => {
  const { gene, ssm } = filters;

  const results = {...filters};

  console.log("filters", filters);

  // add ssm filters to gene filters
    for (const [key, value] of Object.entries(ssm.root)) {
    if (isIncludes(value)) {
        results.gene.root[`case.ssm.${key}`] = {
          field: `case.ssm.${key}`,
          operator: 'in',
          operands: [...value.operands],
        } satisfies Includes;
    }
  }

    // add gene filters to ssm filters
  for (const [key, value] of Object.entries(gene.root)) {
    if (isIncludes(value)) {
      results.ssm.root[`consequence.transcript.gene.${key}`] = {
        field: `consequence.transcript.gene.${key}`,
        operator: 'in',
        operands: [...value.operands],
      } satisfies Includes;
    }
  }

  return results;
}
