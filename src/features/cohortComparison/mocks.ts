import { FilterSet } from '@gen3/core';
import cohortFacetData from './data/cohortFacetData.json';
import survivalPlotData from './data/survivalPlotData.json';
import pValueResult from './data/pValueResult.json';


const test = 0;

type CreateCaseIdsTriggerFunction = () => string[];
type UseMutationResult<T> = {
  data: T;
  isUninitialized: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
};

export const createCaseIdsFromQuery: CreateCaseIdsTriggerFunction = () => {
  return [] as string[];
};

export const useCreateCaseSetFromFiltersMutation = (): [
  CreateCaseIdsTriggerFunction,
  UseMutationResult<string[]>,
] => {
  return [
    createCaseIdsFromQuery,
    {
      data: [],
      isUninitialized: false,
      isLoading: false,
      isFetching: false,
      isError: false,
      isSuccess: true,
    },
  ];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useCohortFacetsQuery = (
  arg0: any,
  arg1: any,
): UseMutationResult<any> => {
  return {
    data: cohortFacetData,
    isUninitialized: false,
    isLoading: false,
    isFetching: false,
    isError: false,
    isSuccess: true,
  };
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useVennDiagramQuery = (arg0: any): UseMutationResult<any> => {
  return {
    data: survivalPlotData,
    isUninitialized: false,
    isLoading: false,
    isFetching: false,
    isError: false,
    isSuccess: true,
  };
};

export const usePValueQuery = (arg0: any): UseMutationResult<any> => {
  return {
    data: pValueResult,
    isUninitialized: false,
    isLoading: false,
    isFetching: false,
    isError: false,
    isSuccess: true,
  };
};
