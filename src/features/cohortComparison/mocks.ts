import { FilterSet } from '@gen3/core';

type CreateCaseIdsTriggerFunction = ({ filters } : { filters: FilterSet }) => string[];
type CreateCaseIdsResults = { data: string[], isUninitialized: boolean, isLoading: boolean, isFetching: boolean, isError: boolean, isSuccess: boolean };

export const createCaseIdsFromQuery : CreateCaseIdsTriggerFunction = ()  => {

  return [] as string[];
}

export const useCreateCaseSetFromFiltersMutation = ()  : [CreateCaseIdsTriggerFunction, CreateCaseIdsResults]=> {

  return [createCaseIdsFromQuery, { data : [], isUninitialized: false, isLoading: false, isFetching: false, isError: false, isSuccess: true } ];
}
