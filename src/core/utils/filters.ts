import { FilterSet, convertFilterToGqlFilter } from "@gen3/core";
import { GqlOperation, } from "@/core/types";


export const buildCohortGqlOperator = (
  fs: FilterSet | undefined,
): GqlOperation | undefined => {
  if (!fs || !fs.root) return undefined;

  const fsKeys = Object.keys(fs.root);
  // if no keys return undefined
  if (fsKeys.length === 0) return undefined;

  // TODO consider changing FilterSet: mode to support joinOrToAll as FilterSet mode
  // find key using keyword "joinOrToAll"
  const joinOrToAllKey = fsKeys.filter((x) => x.includes("joinOrToAll"));

  switch (fs.mode) {
    case "and":
      if (joinOrToAllKey.length === 1) {
        const firstJoinOrToAllKey = joinOrToAllKey[0];

        // Remove firstJoinOrToAllKey from Array
        fsKeys.splice(fsKeys.indexOf(firstJoinOrToAllKey), 1);

        const firstJoinOrToAllObj = fs.root[firstJoinOrToAllKey];
        // make sure type is or/ Union
        if (firstJoinOrToAllObj.operator === "or") {
          return {
            or: firstJoinOrToAllObj?.operands.map((orObj) => {
              // go through each or statement and add all other filters to it
              return {
                and: [
                  convertFilterToGqlFilter(orObj),
                  ...fsKeys.map((k): GqlOperation => {
                    return convertFilterToGqlFilter(fs.root[k]);
                  }),
                ],
              };
            }),
          };
        } else {
          console.error(
            `function buildCohortGqlOperator expecting "or" received "${firstJoinOrToAllObj.operator}" on key "${firstJoinOrToAllKey}"`,
          );
        }
      } else if (joinOrToAllKey.length > 1) {
        console.error(
          `function buildCohortGqlOperator expecting only one joinOrToAll received: ${joinOrToAllKey.length}`,
          fsKeys,
        );
      }
      return {
        // TODO: Replace fixed AND with cohort top level operation like Union or Intersection
        [fs.mode]: fsKeys.map((k): GqlOperation => {
          return convertFilterToGqlFilter(fs.root[k]);
        }),
      };
    case "or":
      return {
        [fs.mode]: fsKeys.map((k): GqlOperation => {
          return convertFilterToGqlFilter(fs.root[k]);
        }),
      };
  }
};
