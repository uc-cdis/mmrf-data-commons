import { FilterSet } from '@gen3/core';
import FileInfoData_1 from './data/b5e705b58eb8.json';
import FileInfoData_2 from './data/b5e705b58eb8.json';
import FileInfoData_3 from './data/b5e705b58eb8.json';

const fileInfoData = [FileInfoData_1, FileInfoData_2, FileInfoData_3];

interface GetFilesQueryParameters {
  filters: FilterSet;
  fields: string[];
  index: number;
}

export const useGetFilesQuery = ({filters, fields, index} : GetFilesQueryParameters ) => {
  return {
    data: fileInfoData[index],
    isFetching: false,
    isLoading: false,
    isSuccess: true,
    isError: false,
    isUninitialized: false,
  }
}
