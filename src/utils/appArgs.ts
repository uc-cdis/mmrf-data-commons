import { NextRouter } from 'next/dist/client/router';
import { EmptyFilterSet, FilterSet, Operation } from '@gen3/core';

const UNKNOWN_APP_ID = 'UNKNOWN_APP_ID';

const toFirstString = (value: unknown): string | undefined => {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return undefined;
};

export const getAppName = (router: NextRouter): string => {
  const { appName } = router.query;
  const appNameFromQuery = toFirstString(appName);
  return appNameFromQuery ?? UNKNOWN_APP_ID;
};

export const getCohortFilter = (router: NextRouter): FilterSet => {
  const { filter: cohortFilterParam } = router.query;

  const defaultFilter = EmptyFilterSet;
  const jsonStr = toFirstString(cohortFilterParam);

  if (!jsonStr) return defaultFilter;
  console.log("jsonStr:", jsonStr)
  const parsedFilter = JSON.parse(jsonStr);
  console.log("parsedFilter:", parsedFilter)
  return {
    mode: 'and',
    root: { "filter": parsedFilter as Operation}
  };
};

export const getProjectId = (router: NextRouter): string | undefined => {
  const { project } = router.query;

  return toFirstString(project);
};
