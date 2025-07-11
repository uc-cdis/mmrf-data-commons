import { Reducer } from "@reduxjs/toolkit";
import { MMRFApiRequest, ProjectDefaults } from '@/core';
import { GEN3_API, gen3Api } from '@gen3/core';

/**
 *  RTK Query endpoint to fetch clinical analysis data using case_filter with the cases endpoint
 */

export const clinicalAnalysisApiSlice = gen3Api.injectEndpoints({
  endpoints: (builder) => ({
    getClinicalAnalysis: builder.query<ProjectDefaults, MMRFApiRequest>({
      query: (request: MMRFApiRequest) => ({
        url: `${GEN3_API}/analysis/survival_plot`,
        method: 'POST',
        body: request,
      }),
      transformResponse: (response: any) => {
        if (response.data.aggregations) return response.data.aggregations;
        return {};
      },
    }),
  }),
});

export const { useGetClinicalAnalysisQuery } = clinicalAnalysisApiSlice;

export const clinicalAnalysisApiReducer: Reducer =
  clinicalAnalysisApiSlice.reducer as Reducer;
