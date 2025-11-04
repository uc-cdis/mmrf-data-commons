import casesQueryData from './data/casesQueryData.json';
import filesTableData from './data/filesTableData.json';

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

export const useGetFilesQuery = (request: any) => {
  return {
    data: filesTableData,
    isFetching: false,
    isLoading: false,
    isSuccess: true,
    isError: false,
    isUninitialized: false,
  };
};
