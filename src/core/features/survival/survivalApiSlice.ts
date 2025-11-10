import { DAYS_IN_YEAR, GEN3_ANALYSIS_API } from '../../constants';
import { gen3Api, isFetchBaseQueryError, GQLFilter } from '@gen3/core';
import {
  SurvivalPlotData,
  SurvivalApiResponse,
} from '@/core/features/survival/types';

const processSurvivalResponse = (response: SurvivalApiResponse) => {
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
};

interface SurvivalPlotRequest {
  caseFilters?: GQLFilter;
  filters: ReadonlyArray<GQLFilter>;
}

interface SurvivalPlotCompareRequest {
  filters: ReadonlyArray<GQLFilter>;
  index: string;
  field: string;
  mode?: string;
}

interface SurvivalPlotGenomicComparisonRequest {
  caseFilter: GQLFilter;
  genomicFilter: GQLFilter;
  symbol: string;
  type?: 'gene' | 'ssm';
}

export const survivalApiSlice = gen3Api.injectEndpoints({
  endpoints: (builder) => ({
    getSurvivalPlot: builder.query<SurvivalPlotData, SurvivalPlotRequest>({
      query: (request) => {
        return {
          url: `${GEN3_ANALYSIS_API}/survival/`,
          method: 'POST',
          body: JSON.stringify(request),
        };
      },
      transformResponse: (response: SurvivalApiResponse) => {
        return processSurvivalResponse(response);
      },
      transformErrorResponse: (response) => {
        if (isFetchBaseQueryError(response)) return { error: response.status };
        return { error: 'An unknown error occurred.' };
      },
    }),
    getComparisonSurvivalPlot: builder.query<
      SurvivalPlotData,
      SurvivalPlotCompareRequest
    >({
      query: (request) => {
        return {
          url: `${GEN3_ANALYSIS_API}/survival/compare`,
          method: 'POST',
          body: JSON.stringify({ ...request }),
        };
      },
      transformResponse: (response: SurvivalApiResponse) => {
        return processSurvivalResponse(response);
      },
      transformErrorResponse: (response) => {
        if (isFetchBaseQueryError(response)) return { error: response.status };
        return { error: 'An unknown error occurred.' };
      },
    }),
    getGenomicComparisonSurvivalPlot: builder.query<
      SurvivalPlotData,
      SurvivalPlotGenomicComparisonRequest
    >({
      query: (request) => {
        return {
          url: `${GEN3_ANALYSIS_API}/survival/compare_genomic`,
          method: 'POST',
          body: JSON.stringify({
            case_filter: request.caseFilter,
            filter: request.genomicFilter,
            symbol: request.symbol,
          }),
        };
      },
      transformResponse: (response: SurvivalApiResponse) => {
        return processSurvivalResponse(response);
      },
      transformErrorResponse: (response) => {
        if (isFetchBaseQueryError(response)) return { error: response.status };
        return { error: 'An unknown error occurred.' };
      },
    }),
  }),
});

export const { useGetSurvivalPlotQuery, useGetComparisonSurvivalPlotQuery, useGetGenomicComparisonSurvivalPlotQuery } =
  survivalApiSlice;
