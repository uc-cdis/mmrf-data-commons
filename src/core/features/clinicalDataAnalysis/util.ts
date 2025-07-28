import { FromToRange} from '@gen3/core';

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
  if (range === undefined) return "custom";
  if (
    range.fromOp == ">=" &&
    range.toOp == "<" &&
    range.from !== undefined &&
    range.to !== undefined
  )
    // builds a range "key"
    return `${range.from.toFixed(precision)}-${range.to.toFixed(precision)}`;

  return "custom";
};
