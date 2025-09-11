import { GqlOperation } from "@/core/types";

interface IntersectionFilters {
  cohort1: GqlOperation;
  cohort2: GqlOperation;
}

const makeIntersectionFilters = (
   cohort1Filters?: GqlOperation,
  cohort2Filters?: GqlOperation,
): IntersectionFilters => {

  const cohort1Content:GqlOperation[] = [];
  const cohort2Content:GqlOperation[] = [];

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
  };
};

export default makeIntersectionFilters;
