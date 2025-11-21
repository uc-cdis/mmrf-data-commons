import {
  Accessibility,
  AggregationsData,
  buildGetAggregationQuery,
  convertFilterSetToGqlFilter,
  FilterSet,
  gen3Api,
  GQLFilter,
  processHistogramResponse,
} from '@gen3/core';
import { CohortCentricQueryRequest, GraphQLApiResponse } from '@/core';
import { CASE_CENTRIC_INDEX, CASE_ID_FIELD, GEN3_ANALYSIS_API, MAX_CASES, } from '@/core/constants';
import { buildRawQuery, processRawQuery, } from '@/core/features/cohortQuery/utils';

interface CohortQueryRequest {
  type: string;
  cohortFilter: GQLFilter;

  caseIdsFilterPath: string;
  indexPrefix?: string;
  filterName?: string;
  caseIndex?: string;
  caseIdField?: string;
  fields: string[];
  accessibility?: Accessibility;
}

interface CohortAggsRequest extends CohortQueryRequest {
  filterSelf?: boolean;
  filter: FilterSet;
}

interface RawDataAndTotalCountsRequest extends CohortQueryRequest {
  sort?: ReadonlyArray<Record<string, 'asc' | 'desc'>>;
  offset?: number;
  size?: number;
  format?: string;
  fields: string[];
  filters: FilterSet;
}

interface GenomicFacetRequest {
  cohortFilter: GQLFilter;
  filter: GQLFilter;
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
            case_ids_filter_path: caseIdsFilterPath,
            limit,
          },
        };
      },
    }),
    rawDataAndTotalCount: builder.query<
      any, // TODO: type the response
      RawDataAndTotalCountsRequest
    >({
      query: ({
        cohortFilter,
        filters,
        fields,
        indexPrefix,
        type,
        caseIdsFilterPath = "cases.case_id",
        caseIndex = CASE_CENTRIC_INDEX,
        caseIdField = CASE_ID_FIELD,
        size = 20,
        offset = 0,
        sort = undefined,
        accessibility = Accessibility.ALL,
      }: RawDataAndTotalCountsRequest) => {
        const gqlFilter = convertFilterSetToGqlFilter(filters);
        const gqlQuery = buildRawQuery(
          type,
          indexPrefix ?? '',
          fields,
          offset,
          size,
          sort,
          accessibility,
        );
        return {
          url: `${GEN3_ANALYSIS_API}/cohorts/query`,
          method: 'POST',
          body: {
            filter: gqlFilter,
            query: gqlQuery,
            cohort_filter: cohortFilter,
            case_index: caseIndex,
            cohort_item_field: caseIdField,
            case_ids_filter_path: caseIdsFilterPath,
          },
        };
      },
      transformResponse: ( response: Record<string, any>, _meta, args) => {
        const containsDots = args?.fields?.filter((f) => f.includes('.'));
        return processRawQuery(
          response,
          containsDots,
          args.type,
          args?.indexPrefix,
        );
      }
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
            case_ids_filter_path: caseIdsFilterPath,
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
    getGeneFacets: builder.query<AggregationsData, GenomicFacetRequest>({
      query: ({ cohortFilter, filter }: GenomicFacetRequest) => {
        return {
          url: `${GEN3_ANALYSIS_API}/genomic/gene_facets`,
          method: 'POST',
          body: {
            cohort_filter: cohortFilter,
            genomic_filter: filter,
          },
        };
      },
      transformResponse: (response: Record<string, any>, _meta, args) => {
        const buckets = processHistogramResponse<AggregationsData>(
          response?.data,
        );

        // check for totals
        const count = response?.data?._totalCount ?? null;

        return {
          _totalCount: [{ key: 'gene', count }], // add total count to allow cohorts to cache index item totals
          ...buckets,
        };
      },
    }),
    getSsmFacets: builder.query<AggregationsData, GenomicFacetRequest>({
      query: ({ cohortFilter, filter }: GenomicFacetRequest) => {
        return {
          url: `${GEN3_ANALYSIS_API}/genomic/ssm_facets`,
          method: 'POST',
          body: {
            cohort_filter: cohortFilter,
            genomic_filter: filter,
          },
        };
      },
      transformResponse: (response: Record<string, any>, _meta, args) => {
        const buckets = processHistogramResponse<AggregationsData>(
          response?.data,
        );

        // check for totals
        const count = response?.data?._totalCount ?? null;

        return {
          _totalCount: [{ key: 'ssm', count }],
          ...buckets,
        };
      },
    }),
  }),
});

export const {
  useGetCohortCentricQuery,
  useLazyGetCohortCentricQuery,
  useGetCohortCentricAggsQuery,
  useGetGeneFacetsQuery,
  useGetSsmFacetsQuery,
  useRawDataAndTotalCountQuery,
} = cohortCentricQuerySlice;
