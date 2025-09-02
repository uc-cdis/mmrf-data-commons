import { Middleware, Reducer } from "@reduxjs/toolkit";
import { guppyApi } from "@gen3/core";
import { GraphQLApiResponse, ProjectDefaults } from '@/core/types';

export const projectsApiSlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<ProjectDefaults, string>({
      query: (request: string) => ({
        query: "",
        variables: {}
      }),
      transformResponse: (response: GraphQLApiResponse<ProjectDefaults>) => {
        if (response.data)
          return {
            projectData: [...response.data],
            pagination: {},
          };
        return {
          projectData: undefined,
        };
      },
    }),
  }),
});

export const { useGetProjectsQuery } = projectsApiSlice;

export const projectApiSliceMiddleware =
  projectsApiSlice.middleware as Middleware;
export const projectsApiSliceReducerPath: string = projectsApiSlice.reducerPath;
export const projectsApiReducer: Reducer = projectsApiSlice.reducer as Reducer;
