import {
  GQLIncludes as GqlIncludes,
  GQLFilter as GqlOperation,
  GQLNestedFilter,
} from '@gen3/core';

export const getSSMTestedCases = (geneSymbol?: string): GqlOperation => {
  return {
    and: [
      ...[
        {
          nested: {
            path: 'occurrence.case',
            in: {
              available_variation_data: ['ssm'],
            },
          },
        } as GQLNestedFilter,
        ...(geneSymbol
          ? [
              {
                nested: {
                  path: 'consequence.transcript.gene',
                  in: {
                    symbol: [geneSymbol],
                  },
                },
              },
            ]
          : []),
      ],
      // For case filter only use cohort filter and not genomic filter
      // ...gqlCohortIntersection,
    ],
  };
};
