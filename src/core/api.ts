import { FilterSet, SSMSTableData } from './types';
import CNVPlotData from './data/gene/CVNPlot.json';
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
