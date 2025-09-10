import {
  GEN3_GUPPY_API,
  FilterSet,
  GQLFilter,
  guppyDownloadApi,

  Accessibility,
} from '@gen3/core';
import { flatten} from 'flat';
import { convertFilterSetToNestedGqlFilter } from '@/core/utils';
import { MMRFFile } from '@/core/features/files/filesSlice';



export interface DownloadApiRequestParameters<T> {
  cohortFilter: T
  filter: T; // cohort filters
  type: string;
  accessibility?: Accessibility;
  fields: string[];
  sort?: string[];
}


interface FilesResponse {
  files: ReadonlyArray<any>;
}

const allFilesSlide = guppyDownloadApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllFiles: builder.query<MMRFFile[], DownloadApiRequestParameters<GQLFilter>>({
      query: ({
                type,
                cohortFilter,
                fields,
                filter,
                sort,
                accessibility
              }:  DownloadApiRequestParameters<GQLFilter>) => {


        const queryBody: DownloadApiRequestParameters<GQLFilter> = {
          filter: filter,
          cohortFilter: cohortFilter,
          fields,
          sort,
          type,
          accessibility
        };

        return {
          url: `${GEN3_GUPPY_API}/download`,
          method: 'POST',
          body: queryBody,
          cache: 'no-cache',
        };
      },
      transformResponse: (response: any) => {
        try {
        const files = response?.map((x: any) => flatten(x)) || [];
        return files;
        } catch (e) {
          return [];
        }
      },
    }),
  }),
});

export const { useGetAllFilesQuery, useLazyGetAllFilesQuery } = allFilesSlide;
