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
  ranges: Array<NumericFromTo>,
): Operation => {
  const root = ranges.map((range) => {
    const { from, to } = range;
    return {
      operator: 'and',
      operands: [
        { operator: '>=', field, operand: from },
        { operator: '<', field, operand: to },
      ],
    } satisfies Intersection;
  });

  return {
    operator: 'or',
    operands: root,
  } satisfies Union;
};

export const rawDataQueryStrForEachField = (field: string): string => {
  const splitFieldArray = field.split('.');
  const splitField = splitFieldArray.shift();
  let middleQuery: string = '';
  if (splitFieldArray.length === 0) {
    middleQuery = `${splitField} { _totalCount }`;
  } else {
    middleQuery = `${splitField} { ${rawDataQueryStrForEachField(splitFieldArray.join('.'))} _totalCount }`;
  }

  return middleQuery;
};

interface NamedFilterRawDataParams
  extends Omit<RawDataAndTotalCountsParams, 'fields'> {
  field: string;
  rangeName: string;
}

export const buildNestedCountsQuery = ({
  type,
  field,
  filters,
  rangeName,
  sort,
  offset = 0,
  size = 20,
  accessibility = Accessibility.ALL,
  format = undefined,
}: NamedFilterRawDataParams) => {
  const params = [
    ...(accessibility ? ['$accessibility: Accessibility'] : []),
    ...(sort ? ['$sort: JSON'] : []),
    ...(rangeName ? ['$filter: JSON'] : []),
  ].join(',');
  const gqlFilter = convertFilterSetToGqlFilter(filters);
  const queryLine = `query rangeQuery_${rangeName} (${params}) {`;
  const dataParams = [...(gqlFilter ? ['filter: $filter'] : [])].join(',');
  const dataTypeLine = `_aggregation { ${rangeName} : ${type} (accessibility: $accessibility ${dataParams}) {`;
  const processedFields = rawDataQueryStrForEachField(field);

  const query = `${queryLine} ${dataTypeLine} ${processedFields} } } }`;

  return query;
};
