import { CoreState, FacetDefinition } from '@gen3/core';

export const selectFacetDefinitionByName = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  state: CoreState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  field: string,
): FacetDefinition => {
  return ({
    field: "unset",
      type: 'enum',
    index : "cases"
   });
};
