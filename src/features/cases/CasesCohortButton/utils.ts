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
