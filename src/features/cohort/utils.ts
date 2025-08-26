import { FilterSet, Intersection, Operation, Union } from '@gen3/core';

/**
 * Type guard for Union or Intersection
 * @param o - operator to check
 * @category Filters
 */
export const isIntersectionOrUnion = (
  o: Operation,
): o is Intersection | Union =>
  (o as Intersection).operator === 'and' || (o as Union).operator === 'or';

/**
 * This function takes a FilterSet object and a prefix string as input.
 * It filters the root property of the FilterSet object and returns a
 * new FilterSet object that only contains filters with field names
 * that start with the specified prefix.
 *
 *  @param fs - The FilterSet object to filter
 *  @param prefix - The prefix to filter by
 *  @returns - A new FilterSet object that only contains filters with field names that start with the specified prefix
 *  @category Filters
 */
export const extractFiltersWithPrefixFromFilterSet = (
  fs: FilterSet | undefined,
  prefix: string,
): FilterSet => {
  if (fs === undefined || fs.root === undefined) {
    return { mode: 'and', root: {} } as FilterSet;
  }
  return Object.values(fs.root).reduce(
    (acc, filter: Operation | any) => {
      if (isIntersectionOrUnion(filter)) return acc;

      if (filter.field.startsWith(prefix)) {
        acc.root[filter.field] = filter;
      }
      return acc;
    },
    { mode: 'and', root: {} } as FilterSet,
  );
};
