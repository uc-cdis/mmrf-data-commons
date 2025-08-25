import { GQLIncludes as GqlIncludes} from '@gen3/core';


export const getSSMTestedCases = (geneSymbol?: string): GqlOperation => {
  return {
    content: [
      ...[
        {
          in: {
            'available_variation_data': ['ssm'],
          },
        } as GqlIncludes,
        ...(geneSymbol
          ? [
              {
                content: {
                  field: 'genes.symbol',
                  value: [geneSymbol],
                },
                op: 'in',
              } as GqlIncludes,
            ]
          : []),
      ],
      // For case filter only use cohort filter and not genomic filter
      // ...gqlCohortIntersection,
    ],
    op: 'and',
  };
};
