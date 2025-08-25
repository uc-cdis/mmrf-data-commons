import { GEN3_GUPPY_API, gen3Api } from '@gen3/core';
import { GEN3_ANALYSIS_API, GraphQLApiResponse } from '@/core';

const geneSummary_query = `
query GeneSummary($geneFilter: JSON, $ssmFilter: JSON) {
    Gene_gene(filter: $geneFilter) {
        biotype
        description
        external_db_ids {
            entrez_gene
            hgnc
            omim_gene
            uniprotkb_swissprot
        }
        gene_chromosome
        gene_start
        gene_id
        gene_end
        name
        symbol
        synonyms
        is_cancer_gene_census
    }
    Ssm__aggregation {
        ssm(filter: $ssmFilter) {
            clinical_annotations {
                civic {
                    gene_id {
                        histogram {
                            key
                            count
                        }
                    }
                }
            }
        }
    }
}`;

interface GeneSummaryResponse {
  gene: Array<{
    description: string;
    gene_id: string;
    symbol: string;
    name: string;
    synonyms: Array<string>;
    biotype: string;
    gene_chromosome: string;
    gene_start: number;
    gene_end: number;
    gene_strand: number;
    is_cancer_gene_census: boolean;
    external_db_ids: {
      entrez_gene: Array<string>;
      uniprotkb_swissprot: Array<string>;
      hgnc: Array<string>;
      omim_gene: Array<string>;
    };
  }>;
  ssms: Array<{
    clinical_annotations: {
      civic: {
        gene_id: string;
      };
    };
  }>;
  _aggregation: {
    ssm: {
      _totalCount: number;
    };
  };
}

export interface GeneSummaryData {
  symbol: string;
  name: string;
  synonyms: Array<string>;
  biotype: string;
  gene_chromosome: string;
  gene_start: number;
  gene_end: number;
  gene_strand: number;
  description: string;
  is_cancer_gene_census: boolean;
  civic?: string;
  gene_id: string;
  external_db_ids: {
    entrez_gene: string[];
    uniprotkb_swissprot: string[];
    hgnc: string[];
    omim_gene: string[];
  };
}

const geneSummarySlice = gen3Api.injectEndpoints({
  endpoints: (builder) => ({
    geneSummary: builder.query<
      GeneSummaryData | undefined,
      { gene_id: string }
    >({
      query: ({ gene_id }) => {
        const filters = {
          geneFilter: {
            in: {
              gene_id: [gene_id],
            },
          },
          ssmFilter: {
            and: [
              {
                nested: {
                  path: 'consequence',
                  nested: {
                    path: 'consequence.transcript',
                    nested: {
                      path: 'consequence.transcript.gene',
                      eq: {
                        gene_id: gene_id,
                      },
                    },
                  },
                },
              },
            ],
          },
        };

        return {
          url: `${GEN3_GUPPY_API}`,
          method: 'POST',
          body: JSON.stringify({
            query: geneSummary_query,
            variables: filters,
          }),
        };
      },
      transformResponse: (
        response: GraphQLApiResponse<GeneSummaryResponse>,
      ) => {
        const genes = response.data.gene;
        if (genes.length === 0) return undefined;

        const summary = genes.map((gene) => ({
          symbol: gene.symbol,
          name: gene.name,
          synonyms: gene.synonyms,
          biotype: gene.biotype,
          gene_chromosome: gene.gene_chromosome,
          gene_start: gene.gene_start,
          gene_end: gene.gene_end,
          gene_strand: gene.gene_strand,
          description: gene.description,
          is_cancer_gene_census: gene.is_cancer_gene_census,
          gene_id: gene.gene_id,
          external_db_ids: {
            entrez_gene: gene.external_db_ids.entrez_gene,
            uniprotkb_swissprot: gene.external_db_ids.uniprotkb_swissprot,
            hgnc: gene.external_db_ids.hgnc,
            omim_gene: gene.external_db_ids.omim_gene,
          },
        }))[0];
        const civic =
          response.data.ssms?.[0]?.clinical_annotations?.civic?.gene_id[0] ??
          undefined;
        return { ...summary, civic };
      },
    }),
  }),
});

export const { useGeneSummaryQuery } = geneSummarySlice;
