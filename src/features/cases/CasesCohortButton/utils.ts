export const getStringOperands = (
  operands: unknown,
): ReadonlyArray<string> | null => {
  if (
    !Array.isArray(operands) ||
    !operands.every((id) => typeof id === 'string')
  ) {
    return null;
  }

  return operands;
};

export const getCaseIdsFromFilter = (
  filter: any,
): ReadonlyArray<string> | null => {
  // Check if filter only contains cases.case_id
  const root = filter?.root || {};
  const rootKeys = Object.keys(root);
  const operands = root['cases.case_id']?.operands;
  const stringOperands = getStringOperands(operands);
  if (
    rootKeys.length === 1 &&
    rootKeys[0] === 'cases.case_id' &&
    stringOperands
  ) {
    return stringOperands;
  }
  return null;
};
