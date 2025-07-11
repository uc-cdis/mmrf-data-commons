

export type SetTypes = "cases" | "genes" | "ssms";
export const selectSetsByType = (
  state: any,
  setType: SetTypes,
): Record<string, string> => state.sets[setType];
