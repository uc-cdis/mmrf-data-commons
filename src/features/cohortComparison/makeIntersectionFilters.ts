import { GqlOperation } from "@/core/types";

interface IntersectionFilters {
  cohort1: GqlOperation;
  cohort2: GqlOperation;
  intersection: GqlOperation;
}

/**
 * This will be replaced by a Gen3 API endpoint
 */
const makeIntersectionFilters = (
   cohort1Filters?: GqlOperation,
  cohort2Filters?: GqlOperation,
): IntersectionFilters => {
  // Data should be in only one of the cohorts, not both so exclude cases ids from the other set


  // TODO: Add Gen3 analysis API
  const cohort1Content:GqlOperation[] = [];
  const cohort2Content:GqlOperation[] = [];
  const intersectionContent : GqlOperation[] = [];

  if (cohort1Filters) {
    cohort1Content.push(cohort1Filters);
  }

  if (cohort2Filters) {
    cohort2Content.push(cohort2Filters);
  }

  return {
    cohort1: {
      and: cohort1Content,
    },
    cohort2: {
      and: cohort2Content,
    },
    intersection: {
      and : intersectionContent,
    },
  };
};

export default makeIntersectionFilters;
