import casesQueryData from './data/casesQueryData.json';

export const useGetCasesQuery = (request: any) => {
  return {
    data: casesQueryData.data,
    isFetching: false,
    isLoading: false,
    isSuccess: true,
    isError: false,
    isUninitialized: false,
  };
};
