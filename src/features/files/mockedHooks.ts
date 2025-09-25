import { FilterSet } from '@gen3/core';
import FileInfoData_1 from './data/b5e705b58eb8.json';
import FileInfoData_2 from './data/5a7d97351f4c.json';
import FileInfoData_3 from './data/712839fb11a3.json';

const fileInfoData = [FileInfoData_1, FileInfoData_2, FileInfoData_3];

interface GetFilesQueryParameters {
  filters: FilterSet;
  fields: string[];
  index: number;
}

export const useGetFilesQuery = ({
  filters,
  fields,
  index,
}: GetFilesQueryParameters) => {
  return {
    data: fileInfoData[index],
    isFetching: false,
    isLoading: false,
    isSuccess: true,
    isError: false,
    isUninitialized: false,
  };
};

export const useGetHistoryQuery = (file_id: any) => ({
  data: [
    {
      uuid: file_id,
      version: '0.123',
      file_change: '12/13/21',
      release_date: '11/13/12',
      data_release: '01/21/21',
    },
    {
      uuid: file_id + 1,
      version: '0.321',
      file_change: '11/12/21',
      release_date: '1/1/12',
      data_release: '2/31/21',
    },
  ],
  isFetching: false,
  isSuccess: true,
  isError: false,
});
