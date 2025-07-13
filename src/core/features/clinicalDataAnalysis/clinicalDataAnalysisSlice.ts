import { Reducer } from "@reduxjs/toolkit";
import {
  Buckets,
  Stats,
  Gen3AnalysisApiRequest,
  ProjectDefaults,
} from '@/core/features/api';
import { GEN3_API, gen3Api } from '@gen3/core';

/**
 *  RTK Query endpoint to fetch clinical analysis data using case_filter with the cases endpoint
 */

export const clinicalAnalysisApiSlice = gen3Api.injectEndpoints({
  endpoints: (builder) => ({
    getClinicalAnalysis: builder.query< Record<string, Buckets | Stats>, Gen3AnalysisApiRequest>({
      query: (request: Gen3AnalysisApiRequest) => ({
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
