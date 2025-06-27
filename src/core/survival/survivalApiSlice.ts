import type { Middleware, Reducer } from "@reduxjs/toolkit";
import { DAYS_IN_YEAR } from "../../core/constants";
import { gen3Api, GEN3_API } from '@gen3/core';
import { Survival, SurvivalApiResponse } from '@/core/survival/types';


export const survivalApiSlice = gen3Api.injectEndpoints({
  endpoints: (builder) => ({
    getSurvivalPlot: builder.query<Survival, any>({
      query: (request: any) => ({
        url: `${GEN3_API}/analysis/survival_plot`,
        method: 'POST',
        body: request,
      }),
      transformResponse: (response: SurvivalApiResponse) => {
        return {
          survivalData: (response?.results || []).map((r) => ({
            ...r,
            donors: r.donors.map((d) => ({
              ...d,
              time: d.time / DAYS_IN_YEAR, // convert days to years
            })),
          })),
          overallStats: response?.overallStats || {},
        };
      },
    }),
  }),
});

export const { useGetSurvivalPlotQuery  } = survivalApiSlice;
