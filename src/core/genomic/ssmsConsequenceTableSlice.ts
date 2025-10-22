import { guppyApi, TablePageOffsetProps } from '@gen3/core';
import { SSMSConsequence } from './ssmsTableSlice';

const SSMSConsequenceTableGraphQLQuery = `
query ConsequencesTable (
  $filters: JSON
  $table_offset:Int, $table_size: Int) {
    ssms: SsmCentric_ssm_centric(filter: $filters, first: $table_size, offset: $table_offset) {
        consequence {
            consequence_id
            transcript {
                transcript_id
                aa_change
                is_canonical
                consequence_type
                annotation {
                    hgvsc
                    polyphen_impact
                    polyphen_score
                    sift_impact
                    sift_score
                    vep_impact
                }
                gene {
                    gene_id
                    symbol
                    gene_strand
                }
            }
        }
    }
}
`;

export interface GDCSsmsConsequenceTable {
  readonly consequence: ReadonlyArray<SSMSConsequence>;
  readonly consequenceTotal: number;
}

export interface SsmsConsequenceTableRequestParameters
  extends TablePageOffsetProps {
  readonly mutationId?: string;
}

const ssmsConsequenceTable = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    ssmsConsequenceTable: builder.query<
      GDCSsmsConsequenceTable,
      SsmsConsequenceTableRequestParameters
    >({
      query: ({ pageSize, offset, mutationId }) => {
        const graphQLFilters = {
          table_size: pageSize,
          table_offset: offset,
          filters: {
            and: [
              {
                in: { 'ssm_id': [mutationId] },
              },
            ],
          },
        };

        return {
          query: SSMSConsequenceTableGraphQLQuery,
          variables: graphQLFilters,
        };
      },
      transformResponse: (response) => {
        const data = response.data.ssms[0];
        return {
          consequenceTotal: data.consequence.length,
          consequence: data.consequence.map(( node: any ) => {
              const transcript = node.transcript;
              return {
                id: node.id,
                transcript: {
                  aa_change: transcript.aa_change,
                  annotation: { ...transcript.annotation },
                  consequence_type: transcript.consequence_type,
                  gene: { ...transcript.gene },
                  is_canonical: transcript.is_canonical,
                  transcript_id: transcript.transcript_id,
                },
              };
            },
          ),
        };
      },
    }),
  }),
});

export const { useSsmsConsequenceTableQuery } = ssmsConsequenceTable;
