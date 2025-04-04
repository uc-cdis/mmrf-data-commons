import { FilterSet } from './types';

export const useSsmsSummaryQuery = () => {
  const data = [
    {
      uuid: '53af5705-a17b-555a-92e9-880ce5c14ca0',
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

export const useSsmsConsequenceTableQuery = () => {
  const data = [
    {
      id: 'U1NNQ29uc2VxdWVuY2U6ODRhZWY0OGYtMzFlNi01MmU0LThlMDUtN2Q1YjlhYjE1MDg3OjNkYzU2MjAwLTM0YjgtNTAzYy05NDBhLWM2NDhmNzg4ZWQzYQ==', // pragma: allowlist secret
      transcript: {
        aa_change: 'V157E',
        annotation: {
          hgvsc: 'c.470T>A',
          polyphen_impact: 'probably_damaging',
          polyphen_score: 0.999,
          sift_impact: 'deleterious',
          sift_score: 0,
          vep_impact: 'MODERATE',
        },
        consequence_type: 'missense_variant',
        gene: {
          gene_id: 'ENSG00000157764',
          gene_strand: -1,
          symbol: 'BRAF',
        },
        is_canonical: false,
        transcript_id: 'ENST00000479537',
      },
    },
    {
      id: 'U1NNQ29uc2VxdWVuY2U6ODRhZWY0OGYtMzFlNi01MmU0LThlMDUtN2Q1YjlhYjE1MDg3OjBhY2JhMjIwLTM1MzQtNTY1ZC05OTU1LTgwZGQzZTA0OTllNg==', // pragma: allowlist secret
      transcript: {
        aa_change: null,
        annotation: {
          hgvsc: 'c.738-3918T>A',
          polyphen_impact: '',
          polyphen_score: null,
          sift_impact: '',
          sift_score: null,
          vep_impact: 'MODIFIER',
        },
        consequence_type: 'intron_variant',
        gene: {
          gene_id: 'ENSG00000157764',
          gene_strand: -1,
          symbol: 'BRAF',
        },
        is_canonical: false,
        transcript_id: 'ENST00000647434',
      },
    },
    {
      id: 'U1NNQ29uc2VxdWVuY2U6ODRhZWY0OGYtMzFlNi01MmU0LThlMDUtN2Q1YjlhYjE1MDg3OmY1NmQ1ZTdiLTYyNzMtNWZhMC1iYmQwLTZlNTgwYmYyMzVjNA==', // pragma: allowlist secret
      transcript: {
        aa_change: 'V640E',
        annotation: {
          hgvsc: 'c.1919T>A',
          polyphen_impact: 'probably_damaging',
          polyphen_score: 0.955,
          sift_impact: 'deleterious',
          sift_score: 0,
          vep_impact: 'MODERATE',
        },
        consequence_type: 'missense_variant',
        gene: {
          gene_id: 'ENSG00000157764',
          gene_strand: -1,
          symbol: 'BRAF',
        },
        is_canonical: false,
        transcript_id: 'ENST00000288602',
      },
    },
    {
      id: 'U1NNQ29uc2VxdWVuY2U6ODRhZWY0OGYtMzFlNi01MmU0LThlMDUtN2Q1YjlhYjE1MDg3OmE2Y2Q5MGJmLTg4NTMtNTQ2OC04NjBmLTdkNDQ4NjcwNjQxNw==', // pragma: allowlist secret
      transcript: {
        aa_change: null,
        annotation: {
          hgvsc: 'n.2189T>A',
          polyphen_impact: '',
          polyphen_score: null,
          sift_impact: '',
          sift_score: null,
          vep_impact: 'MODIFIER',
        },
        consequence_type: 'non_coding_transcript_exon_variant',
        gene: {
          gene_id: 'ENSG00000157764',
          gene_strand: -1,
          symbol: 'BRAF',
        },
        is_canonical: false,
        transcript_id: 'ENST00000644120',
      },
    },
    {
      id: 'U1NNQ29uc2VxdWVuY2U6ODRhZWY0OGYtMzFlNi01MmU0LThlMDUtN2Q1YjlhYjE1MDg3OmFkZDIzNTIxLTUzYTctNTk0ZC1iZWRjLWE2YzlhMTJkNzA5ZA==', // pragma: allowlist secret
      transcript: {
        aa_change: 'V299E',
        annotation: {
          hgvsc: 'c.896T>A',
          polyphen_impact: 'probably_damaging',
          polyphen_score: 0.924,
          sift_impact: 'deleterious',
          sift_score: 0,
          vep_impact: 'MODERATE',
        },
        consequence_type: 'missense_variant',
        gene: {
          gene_id: 'ENSG00000157764',
          gene_strand: -1,
          symbol: 'BRAF',
        },
        is_canonical: false,
        transcript_id: 'ENST00000644650',
      },
    },
    {
      id: 'U1NNQ29uc2VxdWVuY2U6ODRhZWY0OGYtMzFlNi01MmU0LThlMDUtN2Q1YjlhYjE1MDg3OjBmNjVlNmFjLThhOTgtNTU5NS05YTY3LTkxYzA0NGEwYjUxNg==', // pragma: allowlist secret
      transcript: {
        aa_change: null,
        annotation: {
          hgvsc: 'c.*375T>A',
          polyphen_impact: '',
          polyphen_score: null,
          sift_impact: '',
          sift_score: null,
          vep_impact: 'MODIFIER',
        },
        consequence_type: '3_prime_UTR_variant',
        gene: {
          gene_id: 'ENSG00000157764',
          gene_strand: -1,
          symbol: 'BRAF',
        },
        is_canonical: false,
        transcript_id: 'ENST00000646730',
      },
    },
    {
      id: 'U1NNQ29uc2VxdWVuY2U6ODRhZWY0OGYtMzFlNi01MmU0LThlMDUtN2Q1YjlhYjE1MDg3OmY5YWMwMjg1LWU1N2MtNWZkOC05YzNmLTc1NzE1NTE3OGNhYQ==', // pragma: allowlist secret
      transcript: {
        aa_change: 'V640E',
        annotation: {
          hgvsc: 'c.1919T>A',
          polyphen_impact: 'probably_damaging',
          polyphen_score: 0.955,
          sift_impact: 'deleterious',
          sift_score: 0,
          vep_impact: 'MODERATE',
        },
        consequence_type: 'missense_variant',
        gene: {
          gene_id: 'ENSG00000157764',
          gene_strand: -1,
          symbol: 'BRAF',
        },
        is_canonical: true,
        transcript_id: 'ENST00000644969',
      },
    },
    {
      id: 'U1NNQ29uc2VxdWVuY2U6ODRhZWY0OGYtMzFlNi01MmU0LThlMDUtN2Q1YjlhYjE1MDg3OmNlNzlmZDc0LWYwN2UtNTIxZC1iMGJhLTM4NTE4MmFlNjRmOA==', // pragma: allowlist secret
      transcript: {
        aa_change: 'V600E',
        annotation: {
          hgvsc: 'c.1799T>A',
          polyphen_impact: 'probably_damaging',
          polyphen_score: 0.963,
          sift_impact: 'deleterious',
          sift_score: 0,
          vep_impact: 'MODERATE',
        },
        consequence_type: 'missense_variant',
        gene: {
          gene_id: 'ENSG00000157764',
          gene_strand: -1,
          symbol: 'BRAF',
        },
        is_canonical: false,
        transcript_id: 'ENST00000646891',
      },
    },
    {
      id: 'U1NNQ29uc2VxdWVuY2U6ODRhZWY0OGYtMzFlNi01MmU0LThlMDUtN2Q1YjlhYjE1MDg3OmM5YjVlZGZhLWQ2YTYtNTMxMS05MWM1LWMyNTdhMjMzZmQzNw==', // pragma: allowlist secret
      transcript: {
        aa_change: null,
        annotation: {
          hgvsc: 'n.1259-3918T>A',
          polyphen_impact: '',
          polyphen_score: null,
          sift_impact: '',
          sift_score: null,
          vep_impact: 'MODIFIER',
        },
        consequence_type: 'intron_variant',
        gene: {
          gene_id: 'ENSG00000157764',
          gene_strand: -1,
          symbol: 'BRAF',
        },
        is_canonical: false,
        transcript_id: 'ENST00000642875',
      },
    },
    {
      id: 'U1NNQ29uc2VxdWVuY2U6ODRhZWY0OGYtMzFlNi01MmU0LThlMDUtN2Q1YjlhYjE1MDg3OmFiNTUzZjQxLWMxOTQtNTU3Mi1hMmI2LWZhMGFmZGQ1N2Q5Mw==', // pragma: allowlist secret
      transcript: {
        aa_change: 'V600E',
        annotation: {
          hgvsc: 'c.1799T>A',
          polyphen_impact: 'probably_damaging',
          polyphen_score: 0.927,
          sift_impact: 'deleterious',
          sift_score: 0,
          vep_impact: 'MODERATE',
        },
        consequence_type: 'missense_variant',
        gene: {
          gene_id: 'ENSG00000157764',
          gene_strand: -1,
          symbol: 'BRAF',
        },
        is_canonical: false,
        transcript_id: 'ENST00000496384',
      },
    },
    {
      id: 'U1NNQ29uc2VxdWVuY2U6ODRhZWY0OGYtMzFlNi01MmU0LThlMDUtN2Q1YjlhYjE1MDg3OmQzYjY0YjU4LTVhYmEtNTkwYS04ZjljLWE1M2YwNWQ5NjQyNQ==', // pragma: allowlist secret
      transcript: {
        aa_change: null,
        annotation: {
          hgvsc: 'c.*1249T>A',
          polyphen_impact: '',
          polyphen_score: null,
          sift_impact: '',
          sift_score: null,
          vep_impact: 'MODIFIER',
        },
        consequence_type: '3_prime_UTR_variant',
        gene: {
          gene_id: 'ENSG00000157764',
          gene_strand: -1,
          symbol: 'BRAF',
        },
        is_canonical: false,
        transcript_id: 'ENST00000497784',
      },
    },
    {
      id: 'U1NNQ29uc2VxdWVuY2U6ODRhZWY0OGYtMzFlNi01MmU0LThlMDUtN2Q1YjlhYjE1MDg3OmQ0YjE0ZmJkLWM0MGItNTNhZi1hZWZmLTdhNzBiMjc4ZjdmYQ==', // pragma: allowlist secret
      transcript: {
        aa_change: null,
        annotation: {
          hgvsc: 'c.*877T>A',
          polyphen_impact: '',
          polyphen_score: null,
          sift_impact: '',
          sift_score: null,
          vep_impact: 'MODIFIER',
        },
        consequence_type: '3_prime_UTR_variant',
        gene: {
          gene_id: 'ENSG00000157764',
          gene_strand: -1,
          symbol: 'BRAF',
        },
        is_canonical: false,
        transcript_id: 'ENST00000642228',
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

export const useSsmPlotQuery = (_: SsmPlotRequest): DataResponse => {
  const data = {
    cases: [
      {
        ssmCount: 283,
        project: 'TCGA-THCA',
        totalCount: 490,
      },
      {
        ssmCount: 200,
        project: 'TCGA-SKCM',
        totalCount: 470,
      },
      {
        ssmCount: 50,
        project: 'TCGA-COAD',
        totalCount: 428,
      },
      {
        ssmCount: 31,
        project: 'MMRF-COMMPASS',
        totalCount: 959,
      },
      {
        ssmCount: 17,
        project: 'HCMI-CMDC',
        totalCount: 274,
      },
      {
        ssmCount: 13,
        project: 'CPTAC-2',
        totalCount: 328,
      },
      {
        ssmCount: 8,
        project: 'TCGA-LUAD',
        totalCount: 559,
      },
      {
        ssmCount: 7,
        project: 'CPTAC-3',
        totalCount: 1317,
      },
      {
        ssmCount: 4,
        project: 'TCGA-GBM',
        totalCount: 374,
      },
      {
        ssmCount: 2,
        project: 'TCGA-KIRP',
        totalCount: 278,
      },
      {
        ssmCount: 1,
        project: 'CDDP_EAGLE-1',
        totalCount: 50,
      },
      {
        ssmCount: 1,
        project: 'EXCEPTIONAL_RESPONDERS-ER',
        totalCount: 19,
      },
      {
        ssmCount: 1,
        project: 'TCGA-BLCA',
        totalCount: 408,
      },
      {
        ssmCount: 1,
        project: 'TCGA-CHOL',
        totalCount: 51,
      },
      {
        ssmCount: 1,
        project: 'TCGA-HNSC',
        totalCount: 509,
      },
      {
        ssmCount: 1,
        project: 'TCGA-LGG',
        totalCount: 513,
      },
      {
        ssmCount: 1,
        project: 'TCGA-READ',
        totalCount: 155,
      },
    ],
    ssmCount: 2940240,
  };

  return {
    data,
    error: 'none',
    isUninitialized: false,
    isError: false,
    isFetching: false,
    isSuccess: true,
  };
};
