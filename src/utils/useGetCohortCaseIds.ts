import { useEffect, useState } from 'react';
import { convertFilterSetToGqlFilter, EmptyFilterSet, FilterSet } from '@gen3/core';
import { useGetCohortCentricQuery } from '@/core';

interface GetCohortCaseIdsProps {
  cohortFilter: FilterSet;
  filter?: FilterSet;
}

interface CohortCase {
  case_id: string;
}

interface UseGetCohortCaseIdsResult {
  caseIds: string[];
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
}

const COHORT_CASES_QUERY = `query Case_case($filter: JSON) {
  CaseCentric_case_centric(filter: $filter) {
    case_id
  }
}`;

const useGetCohortCaseIds = ({
                               cohortFilter,
                               filter = EmptyFilterSet,
                             }: GetCohortCaseIdsProps): UseGetCohortCaseIdsResult => {
  const cohortFilterGql = convertFilterSetToGqlFilter(cohortFilter);
  const filterGql = convertFilterSetToGqlFilter(filter);

  const [caseIds, setCaseIds] = useState<string[]>([]);

  const { data, isFetching, isSuccess, isError } = useGetCohortCentricQuery({
    cohortFilter: cohortFilterGql,
    filter: filterGql,
    query: COHORT_CASES_QUERY,
    caseIdsFilterPath: 'case_id',
  });

  useEffect(() => {
    if (!isSuccess || !data?.data?.CaseCentric_case_centric) {
      return;
    }

    const cases: CohortCase[] = data.data.CaseCentric_case_centric as CohortCase[];
    setCaseIds(cases.map((item) => item.case_id));
  }, [data, isSuccess]);

  return { caseIds, isFetching, isSuccess, isError };
};

export default useGetCohortCaseIds;
