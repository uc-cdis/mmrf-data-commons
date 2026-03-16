import { Accessibility, gen3Api, GQLFilter, } from '@gen3/core';
import { flatten } from 'flat';
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
          cohort_filter: cohortFilter,
          fields,
          sort,
          index: type,
          accessibility,
          case_ids_filter_path: "cases.case_id" // NOTE: this is hard coded,but if needed, can be passed
        };

        return {
          url: `${GEN3_ANALYSIS_API}/cohorts/download`,
          method: 'POST',
          body: queryBody,
          cache: 'no-cache',
        };
      },
      transformResponse: (response: any) => {
        try {
        return response?.map((x: any) => flatten(x)) || [];
        } catch (e: unknown) {
          if (e instanceof Error) {
            console.error("Error flattening response:", e.message);
          }
          return [];
        }
      },
    }),
  }),
});

export const { useGetAllFilesQuery, useLazyGetAllFilesQuery } = allFilesSlice;
