import { FilterSet } from '@gen3/core';
import { getCohortFilter, getProjectId } from '@/utils/appArgs';
import { useRouter } from 'next/router';

export type useAppFiltersType = () => FilterSet | undefined;

/**
 * Returns filters from query params
 * @category Hooks
 */
export const useAppFilters: useAppFiltersType = (): FilterSet | undefined => {
  const router = useRouter();
  return getCohortFilter(router);
};


export type useProjectIdType = () => string | undefined;
/**
 * Returns filters from query params
 * @category Hooks
 */
export const useProjectId: useProjectIdType = (): string | undefined => {
  const router = useRouter();
  return getProjectId(router);
};
