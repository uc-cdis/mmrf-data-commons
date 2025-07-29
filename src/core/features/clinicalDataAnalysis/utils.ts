import { FromToRange } from '@gen3/frontend';
import { NumericFromTo } from '@gen3/frontend';
import {
  Operation,
  Union,
  Intersection,
  Accessibility,
  RawDataAndTotalCountsParams,
  convertFilterSetToGqlFilter,
} from '@gen3/core';

/**
 * Given a range compute the key if possibly matches a predefined range
 * otherwise classify as "custom"
 * @param range - Range to classify
 * @param precision - number of values after .
 */
export const classifyRangeType = (
  range?: FromToRange<number>,
  precision = 1,
): string => {
  if (range === undefined) return 'custom';
  if (
    range.fromOp == '>=' &&
    range.toOp == '<' &&
    range.from !== undefined &&
    range.to !== undefined
  )
    // builds a range "key"
    return `${range.from.toFixed(precision)}-${range.to.toFixed(precision)}`;

  return 'custom';
};

/**
 *  TODO: Move this to gen3/core
 */

export interface Range<T> {
  field: string;
  content: ReadonlyArray<{ ranges: FromToRange<T>[] }>;
}

export const convertRangeToGql = <T = string>(range: Range<T>): string => {
  const { field, content } = range;
  const gql = content.map((content) => {
    const { ranges } = content;
    return ranges.map((range) => {
      const { from, to, fromOp, toOp } = range;
      return `${field}${fromOp}${from}${toOp}${to}`;
    });
  });
  return gql.join(' OR ');
};

export const convertNumericFromToArrayToGQLFilters = (
  field: string,
  range: NumericFromTo,
): Intersection => {
  const { from, to } = range;
  return {
    operator: 'and',
    operands: [
      { operator: '>=', field, operand: from },
      { operator: '<', field, operand: to },
    ],
  } satisfies Intersection;
};

export const rawDataQueryStrForEachField = (field: string): string => {
  const splitFieldArray = field.split('.');
  const splitField = splitFieldArray.shift();
  let middleQuery: string = '';
  if (splitFieldArray.length === 0) {
    middleQuery = `${splitField} { _totalCount }`;
  } else {
    middleQuery = `${splitField} { ${rawDataQueryStrForEachField(splitFieldArray.join('.'))} }`;
  }
  return middleQuery;
};

interface NamedFilterRawDataParams
  extends Omit<RawDataAndTotalCountsParams, 'fields'> {
  field: string;
  rangeName: string;
}

export const buildAliasedNestedCountsQuery = ({
  type,
  field,
  filters,
  rangeName,
  sort,
  accessibility = Accessibility.ALL,
}: NamedFilterRawDataParams) => {
  const params = [
    ...(accessibility ? ['$accessibility: Accessibility'] : []),
    ...(sort ? ['$sort: JSON'] : []),
    ...(rangeName ? ['$filter: JSON'] : []),
  ].join(',');
  const gqlFilter = convertFilterSetToGqlFilter(filters);
  const queryLine = `query rangeQuery_${rangeName} (${params}) {`;
  const dataParams = [...(gqlFilter ? [`filter: $${rangeName}`] : [])].join(',');
  const dataTypeLine = `_aggregation { ${rangeName} : ${type} (accessibility: $accessibility ${dataParams}) {`;
  const processedFields = rawDataQueryStrForEachField(field);

  const query = `${queryLine} ${dataTypeLine} ${processedFields} } } }`;

  return query;
};

export const buildRangeFilters = (
  field: string,
  rangeBaseName: string,
  ranges: Array<NumericFromTo>,
) => {
  const filters = Object.entries(ranges).reduce(
    (acc: Record<string, any>, [rangeKey, rangeValue], idx) => {
      acc[`${rangeBaseName}_${idx}`] = convertNumericFromToArrayToGQLFilters(
        field,
        rangeValue,
      );
      return acc;
    },
    {},
  );

  return filters;
};

export const buildRangeQuery = (
  field: string, rangeBaseName: string, ranges: Array<NumericFromTo>,
) => {
  const rangeFilters = buildRangeFilters(field, rangeBaseName, ranges);

  let query = '';
  Object.keys(rangeFilters).forEach((rangeKey) => {
    const rangeQuery = buildAliasedNestedCountsQuery({
      type: 'case',
      field,
      filters: {
        mode: 'and',
        root: rangeFilters,
      },
      rangeName: rangeKey,
      accessibility: Accessibility.ALL,
    });
    query += rangeQuery + ' \n';
  });

  return ({
    query: query,
    variables: rangeFilters
    });
}
