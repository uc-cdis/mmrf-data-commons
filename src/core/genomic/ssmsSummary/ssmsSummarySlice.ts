import { guppyApi,  } from '@gen3/core';
import { ClinicalAnnotation, SSMSSummaryData } from '@/core';
import { SSMSConsequence } from '@/core/genomic/ssmsTableSlice';

const SSMSummaryQuery = `
query SSMSummaryQuery($filter: JSON) {
    ssm: Ssm_ssm(filter: $filter, first: 1) {
        cosmic_id
        reference_allele
        mutation_subtype
        genomic_dna_change
        ncbi_build
        clinical_annotations {
           civic {
             gene_id
             variant_id
            }
        }
        consequence {
            transcript {
                aa_change
                aa_end
                aa_start
                consequence_type
                is_canonical
                transcript_id
                annotation {
                    ccds
                    dbsnp_rs
                    existing_variation
                    polyphen_impact
                    polyphen_score
                    pubmed
                    sift_impact
                    sift_score
                    vep_impact
                }
            }
        }
        ssm_id
    }
}`;


interface SummaryResponseData {
  ssm_id: string;
  genomic_dna_change: string;
  type: string;
  reference_genome_assembly: string;
  mutation_subtype: string;
  cosmic_id: Array<string>;
  ncbi_build: string;
  reference_allele: string;
  allele_in_the_reference_assembly: string;
  civic?: string;
  clinical_annotations: ClinicalAnnotation;
  consequence: ReadonlyArray<SSMSConsequence>;
  transcript: {
    is_canonical: boolean;
    transcript_id: string;
    annotation: {
      polyphen_impact: string;
      polyphen_score: number;
      sift_impact: string;
      sift_score: number;
      vep_impact: string;
      dbsnp_rs: string;
    };
  };
}


export const ssmsSummarySlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    ssmsSummary: builder.query<SSMSSummaryData, string>({
      query: (ssm_id) => ({
        query: SSMSummaryQuery,
        variables: {
          "filter": {
            "and": [
              {
                "=": {
                  "ssm_id": ssm_id
                }
              }
            ]
          }
        }
      }),
      transformResponse: (response: {  data: { ssm:  ReadonlyArray<SummaryResponseData> } }  ) => {
        return response.data.ssm.map((hit ) => ({
          uuid: hit.ssm_id,
          dna_change: hit.genomic_dna_change,
          type: hit.mutation_subtype,
          reference_genome_assembly: hit.ncbi_build,
          cosmic_id: hit.cosmic_id,
          allele_in_the_reference_assembly: hit.reference_allele,
          civic: hit?.clinical_annotations?.civic.gene_id,
          transcript:
            hit?.consequence
              .filter((con) => con.transcript.is_canonical)
              .map((item) => ({
                is_canonical: item.transcript.is_canonical,
                transcript_id: item.transcript.transcript_id,
                annotation: {
                  polyphen_impact: item.transcript.annotation.polyphen_impact,
                  polyphen_score: item.transcript.annotation.polyphen_score,
                  sift_impact: item.transcript.annotation.sift_impact,
                  sift_score: item.transcript.annotation.sift_score,
                  vep_impact: item.transcript.annotation.vep_impact,
                  dbsnp: item.transcript.annotation.dbsnp_rs,
                },
              }))[0] || {},
        }))[0];
      },
    }),
  }),
});

export const { useSsmsSummaryQuery } = ssmsSummarySlice;
