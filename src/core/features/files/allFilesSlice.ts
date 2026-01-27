import {
  GEN3_GUPPY_API,
  GQLFilter,
  guppyDownloadApi,
  Accessibility,
  gen3Api,
} from '@gen3/core';
import { flatten} from 'flat';
import { MMRFFile } from '@/core/features/files/filesSlice';
import { GEN3_ANALYSIS_API } from '@/core';

export interface DownloadApiRequestParameters<T> {
  cohortFilter: T
  filter: T; // cohort filters
  type: string;
  accessibility?: Accessibility;
  fields: string[];
  sort?: string[];
}

const allFilesSlice = gen3Api.injectEndpoints({
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


        const queryBody = {
          filter: filter,
          cohort_filters: cohortFilter,
          fields,
          sort,
          type,
          accessibility
        };

        return {
          url: `${GEN3_ANALYSIS_API}/download`,
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

export const { useGetAllFilesQuery, useLazyGetAllFilesQuery } = allFilesSlice;
