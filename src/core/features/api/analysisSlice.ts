import { GEN3_API, gen3Api } from '@gen3/core';
import {
  CaseDefaults,
  SSMSDefaults,
  AnnotationDefaults,
  GenesDefaults,
  EndpointRequestProps,
  Gen3AnalysisApiData,
  Gen3AnalysisApiResponse,
} from './types';


export const endpointSlice = gen3Api.injectEndpoints({
  endpoints: (builder) => ({
    getGenes: builder.query<Gen3AnalysisApiData<GenesDefaults>, EndpointRequestProps>({
      query: ({ request, fetchAll = false }) => ({
          url: `${GEN3_API}/analysis/genes`,
          method: 'POST',
          body: request,
      }),
      transformResponse: (response: Gen3AnalysisApiResponse<GenesDefaults>) =>
        response.data,
    }),
    getCases: builder.query<Gen3AnalysisApiData<CaseDefaults>, EndpointRequestProps>({
      query: ({ request, fetchAll = false }) => ({
        url: `${GEN3_API}/analysis/cases`,
        method: 'POST',
        body: request,
      }),
      transformResponse: (response: Gen3AnalysisApiResponse<CaseDefaults>) =>
        response.data,
    }),
    getSsms: builder.query<Gen3AnalysisApiData<SSMSDefaults>, EndpointRequestProps>({
      query: ({ request, fetchAll = false }) => ({
        url: `${GEN3_API}/analysis/ssms`,
        method: 'POST',
        body: request,
      }),
      transformResponse: (response: Gen3AnalysisApiResponse<SSMSDefaults>) =>
        response.data,
    }),
    getCaseSsms: builder.query<Gen3AnalysisApiData<any>, EndpointRequestProps>({
      query: ({ request, fetchAll = false }) => ({
        url: `${GEN3_API}/analysis/case_ssms`,
        method: 'POST',
        body: request,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getAnnotations: builder.query<
      Gen3AnalysisApiData<AnnotationDefaults>,
      EndpointRequestProps
    >({
      query: ({ request, fetchAll = false }) => ({
        url: `${GEN3_API}/analysis/annotation`,
        method: 'POST',
        body: request,
      }),
      transformResponse: (response: Gen3AnalysisApiResponse<AnnotationDefaults>) =>
        response.data,
    }),
  }),
});

export const {
  useGetGenesQuery,
  useGetCasesQuery,
  useLazyGetCasesQuery,
  useGetSsmsQuery,
  useGetCaseSsmsQuery,
  useGetAnnotationsQuery,
} = endpointSlice;
