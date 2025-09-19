import {
  guppyApi,
  convertFilterToGqlFilter,
  UnionOrIntersection,
  filterSetToOperation,
  FilterSet, GQLIntersection,
} from '@gen3/core';
import { extractContents } from '@/core/utils';
import { extractFiltersWithPrefixFromFilterSet } from '@/features/cohort/utils';
import { convertFilterSetToNestedGqlFilter } from '../../core/utils/filters';


export interface GenomicCountsRequest {
  cohortFilters: FilterSet;
  genomicFilters: FilterSet;
}

export interface GenomicCountsResponse {
  genesTotal: number;
  ssmsTotal: number;
}

const genomicCountsQuery = `
query Gene_gene($geneFilter: JSON, $ssmsFilter: JSON) {
    genesTotal: Gene__aggregation {
        gene(filter: $geneFilter) {
            _totalCount
        }
    }
    ssmsTotal: Ssm__aggregation {
        ssm(filter: $ssmsFilter) {
            _totalCount
        }
    }
}
`


const genomicCountsSlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    getGenomicCounts: builder.query<GenomicCountsResponse, GenomicCountsRequest>({
      query: (request: GenomicCountsRequest) => {
        const {
          genomicFilters,
          cohortFilters,
        } = request;

        const caseFilters = convertFilterSetToNestedGqlFilter(cohortFilters);

        const baseFilters = filterSetToOperation(genomicFilters) as
          | UnionOrIntersection
          | undefined;

        const rawFilterContents =
          baseFilters && extractContents(convertFilterToGqlFilter(baseFilters));
        const filterContents = rawFilterContents
          ? Object(rawFilterContents)
          : [];

        /**
         * Only apply "genes." filters to the genes table's CNV gain and loss filters.
         */
        const onlyGenesFilters = extractContents(convertFilterSetToNestedGqlFilter(
          extractFiltersWithPrefixFromFilterSet(genomicFilters, 'genes.'),
        ));

        const onlySsmsFilters = extractContents(convertFilterSetToNestedGqlFilter(
          extractFiltersWithPrefixFromFilterSet(genomicFilters, 'ssms.'),
        ));

        const graphQlFilters = {
          caseFilters: caseFilters ? caseFilters : {},
          ssmsFilter: {
            and: [
              ...(onlySsmsFilters ?? []),
              {
                nested: {
                  path: 'occurrence',
                  nested: {
                    path: 'occurrence.case',

                    in: {
                      available_variation_data: ['ssm'],
                    },
                  },
                },
              },
            ],
          },
        };

        return {
          query: genomicCountsQuery,
          variables: graphQlFilters,
        };
      },
      transformResponse: (response: { data: any }) => ({
        genesTotal: 0,
          ssmsTotal: 0
        })
    }),
  }),
});
