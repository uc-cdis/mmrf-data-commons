export const mockData = {
  data: {
    ssm: [{ a: 'b' }],
    projects: [
      {
        key: 'CPTAC-3',
        count: 88,
      },
      {
        key: 'HCMI-CMDC',
        count: 79,
      },
      {
        key: 'TCGA-COAD',
        count: 73,
      },
      {
        key: 'TCGA-HNSC',
        count: 69,
      },
      {
        key: 'TCGA-OV',
        count: 59,
      },
    ],
    filteredOccurrences: { ssm: { _totalCounter: 1 } },
    ssmFiltered: {
      'MMRF-COMMPASS': 47,
    },
    ssmTotal: {
      'MMRF-COMMPASS': 959,
    },
    cnvAmplification: {},
    cnvGain: {},
    cnvLoss: {},
    cnvHomozygousDeletion: {},
    cnvTotal: 5,
    cases: {
      cnvTotal: 5,
      filteredCases: { _totalCounter: 1 },
      case_centric: { _totalCounter: 1 },
      ssmFiltered: {
        project: {
          project_id: {
            histogram: [
              {
                key: 'MMRF-COMMPASS',
                count: 47,
              },
            ],
          },
        },
      },
      total: {
        project: {
          project_id: {
            histogram: [
              {
                key: 'MMRF-COMMPASS',
                count: 959,
              },
            ],
          },
        },
      },
    },
    gene: [
      {
        biotype: 'protein_coding',
        description: 'Example description',
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
      ssm_occurrence: {
        _totalCount: 53,
      },
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
