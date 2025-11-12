import {
  guppyApi,
} from '@gen3/core'

const geneSymbolQuery = `query GeneCentric_gene_centric ($filter: JSON){
    GeneCentric_gene_centric(filter: $filter) {
        symbol
        gene_id
    }
}`


export const geneSymbolSlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    getGeneSymbol: builder.mutation<Record<string, string>, Array<string>>({
      query: (geneIds: Array<string>) =>
      ({
        query: geneSymbolQuery,
        variables: { "in" : { "gene_ids" : geneIds} }
      }),
      transformResponse: (results: any)=>  results?.data?.GeneCentric_gene_centric ?? []
      })
    })
  });

export const { useGetGeneSymbolMutation } = geneSymbolSlice;
