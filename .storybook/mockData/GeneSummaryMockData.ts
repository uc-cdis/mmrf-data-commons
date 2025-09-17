export const GeneSummaryMockData = {
  data: {
    gene: [
      {
        biotype: 'protein_coding',
        description:
          'This gene encodes a tumor suppressor protein containing transcriptional activation, DNA binding, and oligomerization domains. The encoded protein responds to diverse cellular stresses to regulate expression of target genes, thereby inducing cell cycle arrest, apoptosis, senescence, DNA repair, or changes in metabolism. Mutations in this gene are associated with a variety of human cancers, including hereditary cancers such as Li-Fraumeni syndrome. Alternative splicing of this gene and the use of alternate promoters result in multiple transcript variants and isoforms. Additional isoforms have also been shown to result from the use of alternate translation initiation codons from identical transcript variants (PMIDs: 12032546, 20937277). [provided by RefSeq, Dec 2016]',
        external_db_ids: {
          entrez_gene: ['7157'],
          hgnc: ['HGNC:11998'],
          omim_gene: ['191170'],
          uniprotkb_swissprot: ['P04637'],
        },
        gene_chromosome: '17',
        gene_start: 7661779,
        gene_id: 'ENSG00000141510',
        gene_end: 7687538,
        name: 'tumor protein p53',
        symbol: 'TP53',
        synonyms: ['LFS1', 'p53'],
        is_cancer_gene_census: true,
      },
    ],
    ssms: {
      ssm: {
        clinical_annotations: {
          civic: {
            gene_id: {
              histogram: [
                {
                  key: '45',
                  count: 3,
                },
                {
                  key: 'no data',
                  count: 45,
                },
              ],
            },
          },
        },
      },
    },
  },
};
