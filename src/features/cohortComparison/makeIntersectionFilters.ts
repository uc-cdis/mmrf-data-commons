import { GqlOperation } from "@/core/types";

interface IntersectionFilters {
  cohort1: GqlOperation;
  cohort2: GqlOperation;
  intersection: GqlOperation;
}

const makeIntersectionFilters = (
  caseSetIds: [string[], string[]],
  cohort1Filters?: GqlOperation,
  cohort2Filters?: GqlOperation,
): IntersectionFilters => {
  // Data should be in only one of the cohorts, not both so exclude cases ids from the other set

  const cohort1Content:GqlOperation[] = [];
  const cohort2Content:GqlOperation[] = [];
  const intersectionContent : GqlOperation[] = [];

  if (cohort1Filters) {
    cohort1Content.push(cohort1Filters);
  }

  if (cohort2Filters) {
    cohort2Content.push(cohort2Filters);
  }

  if (caseSetIds[0]) {
    cohort2Content.push({
      exclude:
        { "cases.case_id" : caseSetIds[0]  }
    });

    intersectionContent.push({
      in: { "cases.case_id": caseSetIds[0] }
    }) ;
  }

  if (caseSetIds[1]) {
    cohort1Content.push({
     exclude: { "cases.case_id" : caseSetIds[1] }
    });

    intersectionContent.push({
      in: { "cases.case_id": caseSetIds[1] }
    });
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
