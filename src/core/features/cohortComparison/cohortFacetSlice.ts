import { graphQLAPI, type GQLFilter } from '@gen3/core';
import { DAYS_IN_YEAR } from "../../constants";
import { GEN3_COHORT_COMPARISON_API } from '@/core/features/cohortComparison/constants';

const graphQLQuery = `
  query CohortComparison(
    $cohort1: FiltersArgument
    $cohort2: FiltersArgument
    $facets: [String]!
    $interval: Float
  ) {
    viewer {
      explore {
        cohort1: cases {
          hits(filters: $cohort1) {
            total
          }
          facets(filters: $cohort1, facets: $facets)
          aggregations(filters: $cohort1) {
            diagnoses__age_at_diagnosis {
              stats {
                min
                max
              }
              histogram(interval: $interval) {
                buckets {
                  doc_count
                  key
                }
              }
            }
          }
        }
        cohort2: cases {
          hits(filters: $cohort2) {
            total
          }
          facets(filters: $cohort2, facets: $facets)
          aggregations(filters: $cohort2) {
            diagnoses__age_at_diagnosis {
              stats {
                min
                max
              }
              histogram(interval: $interval) {
                buckets {
                  doc_count
                  key
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface CohortFacetsRequest {
  facetFields: string[];
  primaryCohort: GQLFilter;
  comparisonCohort: GQLFilter;
}

export const cohortFacetSlice = graphQLAPI.injectEndpoints({
  endpoints: (builder) => ({
    cohortFacets: builder.query< any, CohortFacetsRequest>({
      query: (
        {
        facetFields,
        primaryCohort,
        comparisonCohort,
      }) => ({
        url: `${GEN3_COHORT_COMPARISON_API}`,
        method: 'POST',
        body: {
          query: graphQLQuery,
          variables: {
            cohort1: primaryCohort,
            cohort2: comparisonCohort,
            facets: facetFields,
            interval: 10 * DAYS_IN_YEAR,
          },
        }
      }),
      transformResponse: (response : any) => {
        const facets1 = JSON.parse(response.data.viewer.explore.cohort1.facets);
        const facets2 = JSON.parse(response.data.viewer.explore.cohort2.facets);

        facets1["diagnoses.age_at_diagnosis"] =
          response.data.viewer.explore.cohort1.aggregations.diagnoses__age_at_diagnosis.histogram;
        facets2["diagnoses.age_at_diagnosis"] =
          response.data.viewer.explore.cohort2.aggregations.diagnoses__age_at_diagnosis.histogram;

        return {
          aggregations: [facets1, facets2],
          caseCounts: [
            response.data.viewer.explore.cohort1.hits.total,
            response.data.viewer.explore.cohort2.hits.total,
          ],
        };
      },
    }),
  }),
});

export const { useCohortFacetsQuery } = cohortFacetSlice;
