import { guppyApi } from "@gen3/core";

const graphQLQuery = `
  query File__aggregation($fileFilters: JSON) {
    cartSummary: File__aggregation {
       file(filter: $fileFilters) {
            cases {
                case_id {
                    _totalCount
                }
                project {
                    project_id {
                        histogram {
                            key
                        }
                    }
                }
            }
            file_id {
                _totalCount
            }
            file_size {
                histogram {
                    sum
                }
            }
        }
    }
}
`;

export interface CartAggregation {
  case_count: number;
  doc_count: number;
  file_size: number;
  key: string;
}

export interface CartSummaryData {
  total_case_count: number;
  total_doc_count: number;
  total_file_size: number;
  byProject: CartAggregation[];
}

const cartSummarySlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    cartSummary: builder.query<CartSummaryData, string[]>({
      query: (cart) => { // TODO: This will need to be refactored to support multiple projects
        const graphQLFilters = {
          fileFilters: {
            "and": [
              {
                "in": {
                  "file_id": cart
                }
              }
            ]
          },
        };
        return {
          query: graphQLQuery,
          variables: graphQLFilters,

        };
      },
      transformResponse: (response) => {
        // TODO: This is setup for just one project
        //  need to support multiple projects
        const { file: root }  = response.data.cartSummary;
        const byProject: CartAggregation[] = [{
          case_count : root?.cases?.case_id?._totalCount ?? 0,
          doc_count: root?.file_id?._totalCount ?? 0,
          file_size: root?.file_size?.histogram[0]?.sum ?? 0,
          key: root?.cases?.project?.project_id?.histogram[0]?.key ?? ""
        }];

        return {
          total_case_count: byProject
            .map((project) => project.case_count)
            .reduce((previous, current) => previous + current, 0),
          total_doc_count: byProject
            .map((project) => project.doc_count)
            .reduce((previous, current) => previous + current, 0),
          total_file_size: byProject
            .map((project) => project.file_size)
            .reduce((previous, current) => previous + current, 0),
          byProject,
        };
      },
    }),
  }),
});

export const { useCartSummaryQuery } = cartSummarySlice;
