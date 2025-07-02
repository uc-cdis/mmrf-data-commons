import {
  FilterSet,
  Union,
  Intersection,
  Operation,
  convertFilterToGqlFilter,
  GQLFilter,
  GQLUnion,
  GQLIntersection,
} from "@gen3/core";
import { isEmpty } from "lodash";

////// These will be added to @gen3/core: remove when this is available  //////

export type UnionOrIntersection = Union | Intersection;

/**
 * Append a filter to an operation. If the operation is undefined, return the filter.
 * @param filter
 * @param addition
 */
export const appendFilterToOperation = (
  filter: Intersection | Union | undefined,
  addition: Intersection | Union | undefined,
): Intersection | Union => {
  if (filter === undefined && addition === undefined)
    return { operator: "and", operands: [] };
  if (addition === undefined && filter) return filter;
  if (filter === undefined && addition) return addition;
  return { ...filter, operands: [...(filter?.operands || []), addition] } as
    | Intersection
    | Union;
};

export const filterSetToOperation = (
  fs: FilterSet | undefined,
): Operation | undefined => {
  if (!fs) return undefined;
  switch (fs.mode) {
    case "and":
      return Object.keys(fs.root).length == 0
        ? undefined
        : {
          operator: fs.mode,
          operands: Object.keys(fs.root).map((k): Operation => {
            return fs.root[k];
          }),
        };
  }
  return undefined;
};

/**
 * Type guard to check if an object is a GQLIntersection
 * @param value - The value to check
 * @returns True if the value is a GQLIntersection
 */
export const isGQLIntersection = (value: unknown): value is GQLIntersection => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'and' in value &&
    Array.isArray((value as GQLIntersection).and)
  );
}



/**
 * Type guard to check if an object is a GQLIntersection
 * @param value - The value to check
 * @returns True if the value is a GQLIntersection
 */
export const isGQLUnion = (value: unknown): value is GQLUnion => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'or' in value &&
    Array.isArray((value as GQLUnion).or)
  );
}

export const buildGqlOperationToFilterSet = (
  fs: GQLIntersection | GQLUnion | Record<string, never>,
): FilterSet => {
  if (isEmpty(fs)) return { mode: "and", root: {} };

  return { mode: "and", root: {} };
  // TODO: implement the function below
  /*
  let content: ReadonlyArray<GQLFilter> = [];
  if (isGQLIntersection(fs)) {
    content = fs.and;
  } else if (isGQLUnion(fs)) {
    content = fs.or;
  }

  const obj = content.reduce((acc, item) => {
    let key;
    if (Array.isArray(item.content)) {
      // If item.content is an array, find the first object with a 'field' property
      const fieldObj = item.content.find(
        (content) =>
          content &&
          typeof content.content === "object" &&
          "field" in content.content,
      );
      key = fieldObj && fieldObj.content ? fieldObj.content.field : undefined;
    } else {
      key = (item.content as any).field;
    }

    if (key) {
      return {
        ...acc,
        [key]: convertGqlFilterToFilter(item),
      };
    }
    return acc;
  }, {});

  return {
    mode: (fs as GQLIntersection | GQLUnion).op,
    root: obj,
  };
  */

};


////////////////////////// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

export const appendSearchTermFilters = (
  filters: FilterSet,
  searchFilters: Union,
): FilterSet => {
  const baseFilters = filterSetToOperation(filters) as
    | UnionOrIntersection
    | undefined;

  return buildGqlOperationToFilterSet(
    convertFilterToGqlFilter(
      appendFilterToOperation(baseFilters, searchFilters),
    ) as GQLUnion | GQLIntersection | Record<string , never>,
  );
};
