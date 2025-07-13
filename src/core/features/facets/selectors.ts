import { CoreState } from '@gen3/core';
import { FacetDefinition } from '@gen3/frontend';

export const selectFacetDefinitionByName = (
  state: CoreState,
  field: string,
): FacetDefinition => {
  return ({
    field: "unset",
      type: 'enum',
    index : "cases"
   });
};
