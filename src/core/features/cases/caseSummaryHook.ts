import { useGetRawDataAndTotalCountsQuery } from '@gen3/core';
import {  MMRFCase } from './types';
import { Pagination } from '@/core/features/api';
import { SortBy } from '@/core';

interface CasesResponse {
  cases: ReadonlyArray<MMRFCase>;
  pagination: Pagination;
}

interface CaseRequest {
  size: number;
  from: number;
  caseId: string;
  fields: Array<string>;
  sortBy: SortBy[];
}
export function useGetCaseSummary
