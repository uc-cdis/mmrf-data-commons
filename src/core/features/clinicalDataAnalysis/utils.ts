import { FromToRange } from '@gen3/frontend';
import {
  Accessibility,
  convertFilterSetToGqlFilter, GQLFilter,
  Intersection,
  NumericFromTo,
  Operation,
  RawDataAndTotalCountsParams,
} from '@gen3/core';


/**
 * Given a range compute the key if possibly matches a predefined range
 * otherwise classify as "custom"
 * @param range - Range to classify
 * @param precision - number of values after the decimal point
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

export const convertNumericFromToArrayToFilters = (
  field: string,
  range: NumericFromTo,
  case_filters: Operation,
): Intersection => {
  const { from, to } = range;
  return {
    operator: 'and',
    operands: [
      case_filters,
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

interface NamedFilterRawDataParams {
  type: string;
  field: string;
  rangeName: string;
}

export const buildAliasedNestedCountsQuery = ({
  type,
  field,
  rangeName,
}: NamedFilterRawDataParams) => {
  const dataParams = [`filter: $${rangeName}`];
  const dataTypeLine = `${rangeName} : ${type} (accessibility: $accessibility ${dataParams}) {`;
  const processedFields = rawDataQueryStrForEachField(field);
  return `${dataTypeLine} ${processedFields} }`;
};

export const buildRangeFilters = (
  field: string,
  case_filters: Operation,
  ranges: Array<NumericFromTo>,
  rangeBaseName: string,
) => {
  const filters = Object.entries(ranges).reduce(
    (acc: Record<string, any>, [rangeKey, rangeValue], idx) => {
      acc[`${rangeBaseName}_${idx}`] = convertNumericFromToArrayToFilters(
        field,
        rangeValue,
        case_filters
      );
      return acc;
    },
    {},
  );

  return filters;
};

export const buildRangeQuery = (
  field: string,  case_filters: Operation, ranges: Array<NumericFromTo>, rangeBaseName: string = "range"
) => {
  const rangeFilters = buildRangeFilters(field,case_filters, ranges,  rangeBaseName  );

  let query = `query rangeQuery ($accessibility: Accessibility, ${Object.keys(rangeFilters).map((rangeKey) => `$${rangeKey}: JSON`).join(',')} ) { _aggregation {`;
  Object.keys(rangeFilters).forEach((rangeKey) => {
    const rangeQuery = buildAliasedNestedCountsQuery({
      type: 'case',
      field,
      rangeName: rangeKey,
    });
    query += rangeQuery + ' \n';
  });

  query += `}}`;

  return ({
    query: query,
    variables: rangeFilters as Operation
    });
}
