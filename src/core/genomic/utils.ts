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
          in: {
            'occurrence.case.available_variation_data': ['ssm'],
          },
        },
        ...(geneSymbol
          ? [
              {
                in: {
                  'consequence.transcript.gene.symbol': [geneSymbol],
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
