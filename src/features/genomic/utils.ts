import { convertFilterSetToGqlFilter, FilterSet, GQLFilter, Operation } from '@gen3/core';
import { GqlOperation } from '@/core';

export const buildGeneHaveAndHaveNotFilters = (
  cohortFilters: FilterSet,
  symbol: string,
  field: string,
  isGene: boolean,
): ReadonlyArray<GqlOperation> => {
  if (symbol === undefined) return [];

  return [
    convertFilterSetToGqlFilter({
      mode: cohortFilters.mode,
      root: {
        ...cohortFilters.root,
        [field]: {
          operator: '=',
          field,
          operand: symbol,
        } as Operation,
      },
    }),
    convertFilterSetToGqlFilter({
      mode: cohortFilters.mode,
      root: {
        ...cohortFilters.root,
        available_variation_data: {
          operator: 'includes',
          field: 'available_variation_data',
          operands: isGene ? ['ssm', 'cnv'] : ['ssm'],
        } as Operation,
      } as Record<string, Operation>,
    }),
  ];
};


// export const buildGeneHaveAndHaveNotFilters = (
//   currentFilters: GQLFilter | undefined,
//   symbol: string,
//   field: string,
//   isGene: boolean,
// ): ReadonlyArray<GQLFilter> => {
//   /**
//    * given the contents, add two filters, one with the gene and one without
//    */
//
//   if (symbol === undefined) return [];
//   return [
//     {
//       and: [
//         {
//           nested: {
//             path: 'gene.symbol',
//             '=': {
//               symbol: symbol,
//             },
//           },
//         },
//         {
//           in: {
//             available_variation_data: isGene ? ['ssm', 'cnv'] : ['ssm'],
//           },
//         },
//         ...(currentFilters ? (currentFilters as any).and : []),
//       ],
//     },
//     {
//       and: [
//         {
//           in: {
//             available_variation_data: isGene ? ['ssm', 'cnv'] : ['ssm'],
//           },
//         },
//         ...(currentFilters ? (currentFilters as any).and : []),
//       ],
//     },
//   ];
// };
