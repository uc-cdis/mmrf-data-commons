import {
  gen3Api,
  AggregationsData,
  FilterSet,
  Accessibility,
  buildGetAggregationQuery,
  processHistogramResponse,
  GQLFilter,
} from '@gen3/core';
import { CohortCentricQueryRequest, GraphQLApiResponse } from '@/core';
import {
  GEN3_ANALYSIS_API,
  CASE_CENTRIC_INDEX,
  CASE_ID_FIELD,
  MAX_CASES,
} from '@/core/constants';

interface CohortAggsRequest {
  type: string;
  cohortFilter: GQLFilter;
  fields: string[];
  filter: FilterSet;
  caseIdsFilterPath: string;
  filterSelf?: boolean;
  accessibility?: Accessibility;
  indexPrefix?: string;
  filterName?: string;
  caseIndex?: string;
  caseIdField?: string;

}

export const cohortCentricQuerySlice = gen3Api.injectEndpoints({
  endpoints: (builder) => ({
    getCohortCentric: builder.query<
      GraphQLApiResponse,
      CohortCentricQueryRequest
    >({
      query: ({
        cohortFilter,
        query,
        filter,
        caseIdsFilterPath,
        caseIndex = CASE_CENTRIC_INDEX,
        caseIdField = CASE_ID_FIELD,
        limit = MAX_CASES,
      }: CohortCentricQueryRequest) => {
        return {
          url: `${GEN3_ANALYSIS_API}/cohorts/query`,
          method: 'POST',
          body: {
            filter: filter,
            query: query,
            cohort_filter: cohortFilter,
            case_index: caseIndex,
            cohort_item_field: caseIdField,
            case_ids_filter_path:caseIdsFilterPath,
            limit,
          },
        };
      },
    }),
    getCohortCentricAggs: builder.query<AggregationsData, CohortAggsRequest>({
      query: ({
        type,
        cohortFilter,
        fields,
        filter,
                caseIdsFilterPath,
                indexPrefix = '',
        filterSelf = false,
        accessibility = Accessibility.ALL,
        caseIndex = CASE_CENTRIC_INDEX,
        caseIdField = CASE_ID_FIELD,
      }: CohortAggsRequest) => {
        const { query, variables } = buildGetAggregationQuery(
          type,
          fields,
          filter,
          accessibility,
          filterSelf,
          undefined,
          indexPrefix,
        );
        return {
          url: `${GEN3_ANALYSIS_API}/cohorts/query`,
          method: 'POST',
          body: {
            filter: variables?.['filter'],
            query: query,
            cohort_filter: cohortFilter,
            case_index: caseIndex,
            cohort_item_field: caseIdField,
            case_ids_filter_path:caseIdsFilterPath,
          },
        };
      },
      transformResponse: (response: Record<string, any>, _meta, args) => {
        const buckets = processHistogramResponse<AggregationsData>(
          response?.data?.[`${args?.indexPrefix ?? ''}_aggregation`][
            args.type
          ] ?? {},
        );

        // check for totals
        const count =
          response?.data?.[`${args?.indexPrefix ?? ''}_aggregation`][args.type]
            ?._totalCount ?? null;

        return {
          _totalCount: [{ key: args.type, count }], // add total count to allow cohorts to cache index item totals
          ...buckets,
        };
      },
    }),
  }),
});

export const { useGetCohortCentricQuery, useLazyGetCohortCentricQuery, useGetCohortCentricAggsQuery } =
  cohortCentricQuerySlice;
