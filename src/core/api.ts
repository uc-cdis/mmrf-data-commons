import { FilterSet, SSMSTableData } from './types';
import geneSummaryData from './data/gene/ENSG00000133703.json';
import CNVPlotData from './data/gene/CVNPlot.json';
import CancerDistributionTableData from './data/gene/CancerDistributionTable.json';
import SSMSTableDataLarge from './data/gene/SSMSTableLarge.json';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useGetProjectsQuery = (project: { [key: string]: any }) => {
  const data = [
    {
      projectData: [
        {
          id: 'MMRF-COMMPASS',
          summary: {
            file_count: 29802,
            data_categories: [
              {
                file_count: 15843,
                case_count: 960,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 6577,
                case_count: 995,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 2020,
                case_count: 908,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 1718,
                case_count: 787,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 186,
                case_count: 76,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 3458,
                case_count: 791,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 17350,
                case_count: 975,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 7731,
                case_count: 787,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 4721,
                case_count: 923,
                experimental_strategy: 'WGS',
              },
            ],
            case_count: 995,
            file_size: 206570723594753,
          },
          primary_site: ['Hematopoietic and reticuloendothelial systems'],
          dbgap_accession_number: 'phs000748',
          project_id: 'MMRF-COMMPASS',
          disease_type: ['Plasma Cell Tumors'],
          name: 'Multiple Myeloma CoMMpass Study',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: null,
            program_id: '47886a48-87b8-5437-800e-af74f41e6c84',
            name: 'MMRF',
          },
          released: true,
        },
      ],
      pagination: {
        count: 1,
        total: 1,
        size: 1,
        from: 0,
        sort: '',
        page: 1,
        pages: 1,
      },
    },
  ];
  return {
    data,
    isFetching: false,
    isLoading: false,
    isError: false,
    isSuccess: true,
  };
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useGetSSMSCancerDistributionTableQuery = (ssms: {
  ssms: object | string;
}) => {
  const data = {
    projects: [
      {
        doc_count: 1,
        key: 'CPTAC-3',
      },
      {
        doc_count: 1,
        key: 'TCGA-COAD',
      },
      {
        doc_count: 1,
        key: 'TCGA-HNSC',
      },
      {
        doc_count: 1,
        key: 'TCGA-READ',
      },
      {
        doc_count: 1,
        key: 'TCGA-STAD',
      },
      {
        doc_count: 1,
        key: 'HCMI-CMDC',
      },
      {
        doc_count: 1,
        key: 'TCGA-LGG',
      },
      {
        doc_count: 1,
        key: 'TCGA-UCEC',
      },
      {
        doc_count: 1,
        key: 'TCGA-GBM',
      },
      {
        doc_count: 1,
        key: 'TCGA-BRCA',
      },
      {
        doc_count: 1,
        key: 'TCGA-ESCA',
      },
      {
        doc_count: 1,
        key: 'TCGA-LUSC',
      },
      {
        doc_count: 1,
        key: 'TARGET-ALL-P2',
      },
      {
        doc_count: 1,
        key: 'TARGET-OS',
      },
      {
        doc_count: 1,
        key: 'TCGA-OV',
      },
      {
        doc_count: 1,
        key: 'TCGA-PAAD',
      },
      {
        doc_count: 1,
        key: 'CPTAC-2',
      },
      {
        doc_count: 1,
        key: 'MP2PRT-ALL',
      },
      {
        doc_count: 1,
        key: 'TCGA-BLCA',
      },
      {
        doc_count: 1,
        key: 'TCGA-LUAD',
      },
      {
        doc_count: 1,
        key: 'CMI-MPC',
      },
      {
        doc_count: 1,
        key: 'EXCEPTIONAL_RESPONDERS-ER',
      },
      {
        doc_count: 1,
        key: 'MMRF-COMMPASS',
      },
      {
        doc_count: 1,
        key: 'TARGET-WT',
      },
      {
        doc_count: 1,
        key: 'TCGA-CESC',
      },
      {
        doc_count: 1,
        key: 'TCGA-KICH',
      },
      {
        doc_count: 1,
        key: 'TCGA-PRAD',
      },
    ],
    ssmFiltered: {
      'CPTAC-3': 14,
      'TCGA-COAD': 12,
      'TCGA-HNSC': 8,
      'TCGA-READ': 8,
      'TCGA-STAD': 7,
      'HCMI-CMDC': 6,
      'TCGA-LGG': 6,
      'TCGA-UCEC': 6,
      'TCGA-GBM': 5,
      'TCGA-BRCA': 4,
      'TCGA-ESCA': 4,
      'TCGA-LUSC': 4,
      'TARGET-ALL-P2': 3,
      'TARGET-OS': 3,
      'TCGA-OV': 3,
      'TCGA-PAAD': 3,
      'CPTAC-2': 2,
      'MP2PRT-ALL': 2,
      'TCGA-BLCA': 2,
      'TCGA-LUAD': 2,
      'CMI-MPC': 1,
      'EXCEPTIONAL_RESPONDERS-ER': 1,
      'MMRF-COMMPASS': 1,
      'TARGET-WT': 1,
      'TCGA-CESC': 1,
      'TCGA-KICH': 1,
      'TCGA-PRAD': 1,
    },
    ssmTotal: {
      'MP2PRT-ALL': 1487,
      'CPTAC-3': 1317,
      'TCGA-BRCA': 969,
      'MMRF-COMMPASS': 959,
      'TARGET-ALL-P2': 717,
      'TCGA-LUAD': 559,
      'TCGA-LGG': 513,
      'TCGA-UCEC': 512,
      'TCGA-HNSC': 509,
      'TCGA-PRAD': 496,
      'TCGA-LUSC': 490,
      'TCGA-THCA': 490,
      'TCGA-SKCM': 470,
      'TCGA-STAD': 434,
      'TCGA-COAD': 428,
      'TCGA-OV': 419,
      'TCGA-BLCA': 408,
      'TCGA-GBM': 374,
      'TCGA-KIRC': 374,
      'TCGA-LIHC': 369,
      'BEATAML1.0-COHORT': 342,
      'CPTAC-2': 328,
      'TCGA-CESC': 287,
      'TCGA-KIRP': 278,
      'HCMI-CMDC': 274,
      'TCGA-SARC': 235,
      'TARGET-NBL': 220,
      'TCGA-ESCA': 184,
      'TCGA-PAAD': 179,
      'TCGA-PCPG': 179,
      'CMI-MBC': 174,
      'TCGA-READ': 155,
      'TCGA-LAML': 144,
      'TCGA-TGCT': 141,
      'TCGA-THYM': 123,
      'TARGET-OS': 97,
      'TCGA-ACC': 90,
      'CGCI-HTMCP-CC': 85,
      'TCGA-MESO': 80,
      'TCGA-UVM': 80,
      'TCGA-KICH': 66,
      'CMI-MPC': 60,
      'TCGA-UCS': 57,
      'TARGET-ALL-P3': 56,
      'TCGA-CHOL': 51,
      'CDDP_EAGLE-1': 50,
      'TCGA-DLBC': 47,
      'TARGET-WT': 38,
      'CGCI-BLGSP': 37,
      'CMI-ASC': 36,
      'TARGET-AML': 22,
      'EXCEPTIONAL_RESPONDERS-ER': 19,
    },
  };
  return {
    data,
    isFetching: false,
    isLoading: false,
    isError: false,
    isSuccess: true,
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useSsmsSummaryQuery = (summary: { [key: string]: any }) => {
  const data = {
    uuid: '53af5705-a17b-555a-92e9-880ce5c14ca0',
    civic: null,
    dna_change: 'chr17:g.7673776G>A',
    type: 'Single base substitution',
    reference_genome_assembly: 'GRCh38',
    cosmic_id: ['COSM10704', 'COSM1636702', 'COSM3378339', 'COSM99925'],
    allele_in_the_reference_assembly: 'G',
    transcript: {
      is_canonical: true,
      transcript_id: 'ENST00000269305',
      annotation: {
        polyphen_impact: 'probably_damaging',
        polyphen_score: 1,
        sift_impact: 'deleterious',
        sift_score: 0,
        vep_impact: 'MODERATE',
        dbsnp: 'rs28934574',
      },
    },
  };
  return {
    data,
    isFetching: false,
    isLoading: false,
    isError: false,
    isSuccess: true,
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useSsmsConsequenceTableQuery = (consequenceQuery: {
  [key: string]: any;
}) => {
  const data = {
    id: '12',
    consequenceTotal: 26,
    consequence: [
      {
        id: '123',
        transcript: {
          aa_change: 'R243W',
          annotation: {
            hgvsc: 'c.727C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 1,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000619485',
        },
      },
      {
        id: '1234',
        transcript: {
          aa_change: null,
          annotation: {
            hgvsc: '',
            polyphen_impact: '',
            polyphen_score: null,
            sift_impact: '',
            sift_score: null,
            vep_impact: 'MODIFIER',
          },
          consequence_type: 'upstream_gene_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000576024',
        },
      },
      {
        id: 'U1Ng==',
        transcript: {
          aa_change: null,
          annotation: {
            hgvsc: 'c.782+405C>T',
            polyphen_impact: '',
            polyphen_score: null,
            sift_impact: '',
            sift_score: null,
            vep_impact: 'MODIFIER',
          },
          consequence_type: 'intron_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000413465',
        },
      },
      {
        id: '12345',
        transcript: {
          aa_change: null,
          annotation: {
            hgvsc: '',
            polyphen_impact: '',
            polyphen_score: null,
            sift_impact: '',
            sift_score: null,
            vep_impact: 'MODIFIER',
          },
          consequence_type: 'downstream_gene_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000508793',
        },
      },
      {
        id: 'U1NN5Mg==',
        transcript: {
          aa_change: 'R243W',
          annotation: {
            hgvsc: 'c.727C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 1,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000635293',
        },
      },
      {
        id: '123456',
        transcript: {
          aa_change: 'R150W',
          annotation: {
            hgvsc: 'c.448C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 0.998,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000504290',
        },
      },
      {
        id: 'U3Zg==',
        transcript: {
          aa_change: 'R150W',
          annotation: {
            hgvsc: 'c.448C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 1,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000509690',
        },
      },
      {
        id: 'U1NNQ==',
        transcript: {
          aa_change: null,
          annotation: {
            hgvsc: '',
            polyphen_impact: '',
            polyphen_score: null,
            sift_impact: '',
            sift_score: null,
            vep_impact: 'MODIFIER',
          },
          consequence_type: 'downstream_gene_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000514944',
        },
      },
      {
        id: 'U1NNQ',
        transcript: {
          aa_change: 'R123W',
          annotation: {
            hgvsc: 'c.367C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 1,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000619186',
        },
      },
      {
        id: 'U1NNQ29uc2VxdW==',
        transcript: {
          aa_change: 'R243W',
          annotation: {
            hgvsc: 'c.727C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 0.999,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000622645',
        },
      },
      {
        id: 'U1NmJjMzgyYg==',
        transcript: {
          aa_change: 'R243W',
          annotation: {
            hgvsc: 'c.727C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 0.998,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000610538',
        },
      },
      {
        id: 'U10OQ==',
        transcript: {
          aa_change: 'R282W',
          annotation: {
            hgvsc: 'c.844C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 0.999,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000359597',
        },
      },
      {
        id: 'U1NjNg==',
        transcript: {
          aa_change: 'R150W',
          annotation: {
            hgvsc: 'c.448C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 1,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000504937',
        },
      },
      {
        id: 'U1NA==',
        transcript: {
          aa_change: 'R282W',
          annotation: {
            hgvsc: 'c.844C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 1,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: true,
          transcript_id: 'ENST00000269305',
        },
      },
      {
        id: 'U1NZhZA==',
        transcript: {
          aa_change: 'R282W',
          annotation: {
            hgvsc: 'c.844C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 0.999,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000420246',
        },
      },
      {
        id: 'U1NNzY2M3Yg==',
        transcript: {
          aa_change: 'R123W',
          annotation: {
            hgvsc: 'c.367C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 0.999,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000618944',
        },
      },
      {
        id: 'U1NRkZQ==',
        transcript: {
          aa_change: 'R123W',
          annotation: {
            hgvsc: 'c.367C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 0.998,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000610623',
        },
      },
      {
        id: 'U1NNQOTFkZQ==',
        transcript: {
          aa_change: 'R282W',
          annotation: {
            hgvsc: 'c.844C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 1,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000445888',
        },
      },
      {
        id: 'U1NNQ29uc2==',
        transcript: {
          aa_change: 'R243W',
          annotation: {
            hgvsc: 'c.727C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 1,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000610292',
        },
      },
      {
        id: 'U1NMzM2OA==',
        transcript: {
          aa_change: null,
          annotation: {
            hgvsc: '',
            polyphen_impact: '',
            polyphen_score: null,
            sift_impact: '',
            sift_score: null,
            vep_impact: 'MODIFIER',
          },
          consequence_type: 'downstream_gene_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000574684',
        },
      },
      {
        id: 'U1NNjU0Nw==',
        transcript: {
          aa_change: 'R243W',
          annotation: {
            hgvsc: 'c.727C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 1,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000620739',
        },
      },
      {
        id: 'U1NNjcwMg==',
        transcript: {
          aa_change: 'R150W',
          annotation: {
            hgvsc: 'c.448C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 0.999,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000510385',
        },
      },
      {
        id: 'U1ZjOA==',
        transcript: {
          aa_change: 'R282W',
          annotation: {
            hgvsc: 'c.844C>T',
            polyphen_impact: 'probably_damaging',
            polyphen_score: 0.998,
            sift_impact: 'deleterious',
            sift_score: 0,
            vep_impact: 'MODERATE',
          },
          consequence_type: 'missense_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000455263',
        },
      },
      {
        id: 'U1NA==',
        transcript: {
          aa_change: null,
          annotation: {
            hgvsc: '',
            polyphen_impact: '',
            polyphen_score: null,
            sift_impact: '',
            sift_score: null,
            vep_impact: 'MODIFIER',
          },
          consequence_type: 'downstream_gene_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000604348',
        },
      },
      {
        id: 'U1NNzIzY2E3ODAxNQ==',
        transcript: {
          aa_change: null,
          annotation: {
            hgvsc: '',
            polyphen_impact: '',
            polyphen_score: null,
            sift_impact: '',
            sift_score: null,
            vep_impact: 'MODIFIER',
          },
          consequence_type: 'downstream_gene_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000505014',
        },
      },
      {
        id: 'U1Nw==',
        transcript: {
          aa_change: null,
          annotation: {
            hgvsc: '',
            polyphen_impact: '',
            polyphen_score: null,
            sift_impact: '',
            sift_score: null,
            vep_impact: 'MODIFIER',
          },
          consequence_type: 'downstream_gene_variant',
          gene: {
            gene_id: 'ENSG00000141510',
            gene_strand: -1,
            symbol: 'TP53',
          },
          is_canonical: false,
          transcript_id: 'ENST00000503591',
        },
      },
    ],
  };

  return {
    data,
    isFetching: false,
    isLoading: false,
    isError: false,
    isSuccess: true,
  };
};

interface SsmPlotRequest {
  gene?: string;
  ssms?: string;
  cohortFilters?: FilterSet;
  genomicFilters?: FilterSet;
}

interface DataResponse {
  data: Record<string, any>;
  error: string | Record<string, any>;
  isUninitialized: boolean;
  isError: boolean;
  isFetching: boolean;
  isSuccess: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// export const useSsmPlotQuery = (_: SsmPlotRequest): DataResponse => {
//   const data = {
//     cases: [
//       {
//         ssmCount: 283,
//         project: 'TCGA-THCA',
//         totalCount: 490,
//       },
//       {
//         ssmCount: 200,
//         project: 'TCGA-SKCM',
//         totalCount: 470,
//       },
//       {
//         ssmCount: 50,
//         project: 'TCGA-COAD',
//         totalCount: 428,
//       },
//       {
//         ssmCount: 31,
//         project: 'MMRF-COMMPASS',
//         totalCount: 959,
//       },
//       {
//         ssmCount: 17,
//         project: 'HCMI-CMDC',
//         totalCount: 274,
//       },
//       {
//         ssmCount: 13,
//         project: 'CPTAC-2',
//         totalCount: 328,
//       },
//       {
//         ssmCount: 8,
//         project: 'TCGA-LUAD',
//         totalCount: 559,
//       },
//       {
//         ssmCount: 7,
//         project: 'CPTAC-3',
//         totalCount: 1317,
//       },
//       {
//         ssmCount: 4,
//         project: 'TCGA-GBM',
//         totalCount: 374,
//       },
//       {
//         ssmCount: 2,
//         project: 'TCGA-KIRP',
//         totalCount: 278,
//       },
//       {
//         ssmCount: 1,
//         project: 'CDDP_EAGLE-1',
//         totalCount: 50,
//       },
//       {
//         ssmCount: 1,
//         project: 'EXCEPTIONAL_RESPONDERS-ER',
//         totalCount: 19,
//       },
//       {
//         ssmCount: 1,
//         project: 'TCGA-BLCA',
//         totalCount: 408,
//       },
//       {
//         ssmCount: 1,
//         project: 'TCGA-CHOL',
//         totalCount: 51,
//       },
//       {
//         ssmCount: 1,
//         project: 'TCGA-HNSC',
//         totalCount: 509,
//       },
//       {
//         ssmCount: 1,
//         project: 'TCGA-LGG',
//         totalCount: 513,
//       },
//       {
//         ssmCount: 1,
//         project: 'TCGA-READ',
//         totalCount: 155,
//       },
//     ],
//     ssmCount: 2940240,
//   };
//
//   return {
//     data,
//     error: 'none',
//     isUninitialized: false,
//     isError: false,
//     isFetching: false,
//     isSuccess: true,
//   };
// };

interface GeneSummaryQueryParams {
  gene_id: string;
}

interface CNVPlotRequest {
  gene: string;
  cohortFilters?: FilterSet;
  genomicFilters?: FilterSet;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useCnvPlotQuery = ({
  gene,
  cohortFilters,
  genomicFilters,
}: CNVPlotRequest) => {
  return {
    data: CNVPlotData,
    error: 'none',
    isUninitialized: false,
    isError: false,
    isFetching: false,
    isSuccess: true,
  };
};

export interface SortOption {
  field: string;
  order: string;
}

export interface TablePageOffsetProps {
  readonly pageSize?: number;
  readonly offset?: number;
  readonly sorts?: Array<SortOption>;
  readonly searchTerm?: string;
}

export interface SsmsTableRequestParameters extends TablePageOffsetProps {
  readonly geneSymbol?: string;
  readonly genomicFilters: FilterSet;
  readonly cohortFilters: FilterSet;
  readonly tableFilters: FilterSet;
  readonly _cohortFiltersNoSet?: FilterSet;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useGetSssmTableDataQuery = ({
  geneSymbol,
  genomicFilters,
  cohortFilters,
  tableFilters,
  _cohortFiltersNoSet,
}: SsmsTableRequestParameters) => {
  return {
    data: SSMSTableDataLarge as SSMSTableData | undefined,
    error: 'none',
    isUninitialized: false,
    isError: false,
    isFetching: false,
    isSuccess: true,
  };
};

export const useGetSomaticMutationTableSubrowQuery = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  id,
}: {
  id: string;
}) => {
  return {
    data: [
      {
        project: 'TCGA-COAD',
        numerator: 26,
        denominator: 428,
      },
      {
        project: 'HCMI-CMDC',
        numerator: 23,
        denominator: 513,
      },
      {
        project: 'CPTAC-3',
        numerator: 19,
        denominator: 1317,
      },
      {
        project: 'TCGA-BRCA',
        numerator: 18,
        denominator: 969,
      },
      {
        project: 'TCGA-OV',
        numerator: 15,
        denominator: 419,
      },
      {
        project: 'TCGA-READ',
        numerator: 13,
        denominator: 155,
      },
      {
        project: 'TCGA-HNSC',
        numerator: 12,
        denominator: 509,
      },
      {
        project: 'TCGA-STAD',
        numerator: 12,
        denominator: 434,
      },
      {
        project: 'TCGA-ESCA',
        numerator: 9,
        denominator: 184,
      },
      {
        project: 'CPTAC-2',
        numerator: 8,
        denominator: 328,
      },
      {
        project: 'TCGA-LGG',
        numerator: 8,
        denominator: 513,
      },
      {
        project: 'TCGA-GBM',
        numerator: 7,
        denominator: 374,
      },
      {
        project: 'TCGA-UCEC',
        numerator: 5,
        denominator: 512,
      },
      {
        project: 'TCGA-LUSC',
        numerator: 4,
        denominator: 490,
      },
      {
        project: 'TCGA-PAAD',
        numerator: 4,
        denominator: 179,
      },
      {
        project: 'TCGA-SARC',
        numerator: 4,
        denominator: 235,
      },
      {
        project: 'BEATAML1.0-COHORT',
        numerator: 3,
        denominator: 342,
      },
      {
        project: 'TCGA-BLCA',
        numerator: 3,
        denominator: 408,
      },
      {
        project: 'CMI-MBC',
        numerator: 2,
        denominator: 174,
      },
      {
        project: 'TCGA-LUAD',
        numerator: 2,
        denominator: 559,
      },
      {
        project: 'TCGA-PRAD',
        numerator: 2,
        denominator: 496,
      },
      {
        project: 'TCGA-UCS',
        numerator: 2,
        denominator: 57,
      },
      {
        project: 'MMRF-COMMPASS',
        numerator: 1,
        denominator: 959,
      },
      {
        project: 'MP2PRT-ALL',
        numerator: 1,
        denominator: 1487,
      },
      {
        project: 'TARGET-ALL-P2',
        numerator: 1,
        denominator: 717,
      },
      {
        project: 'TARGET-WT',
        numerator: 1,
        denominator: 38,
      },
      {
        project: 'TCGA-SKCM',
        numerator: 1,
        denominator: 470,
      },
    ],
    isError: false,
    isFetching: false,
    isSuccess: true,
  };
};
