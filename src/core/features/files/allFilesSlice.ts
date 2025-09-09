import { GQLIntersection, downloadRequestApi } from '@gen3/core';
import { SortBy } from '@/core';

interface AllFilesRequest {
  cohortFilter?: GQLIntersection;
  filter: GQLIntersection;
  fields: Array<string>;
  sortBy: SortBy[];
}

interface FilesResponse {
  files: ReadonlyArray<any>;
}

const allFilesSlide = downloadRequestApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFiles: builder.query<FilesResponse, AllFilesRequest>({
      query: ({
                cohortFilter,
                fields,
                filter: tableFilters,
                sortBy,
              }: AllFilesRequest) => {


        const queryBody: GuppyDownloadDataQueryParams = {
          filter: filter,
          ...{ type, accessibility, fields, sort },
        };
        return {
            url: `${GEN3_GUPPY_API}/download`,
            method: 'POST',
            body: queryBody,
            cache: 'no-cache',
        };
      },
      transformResponse: (response: DownloadRequestStatus) => {
        return response;
      },
    }),
  }),
});

export const { useGetAllFilesQuery, useLazyGetAllFilesQuery } = allFilesSlide;
