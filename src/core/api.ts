import { FilterSet } from './types';

export const useGetProjectsQuery = () => {
  const data = [
    {
      projectData: [
        {
          id: 'HCMI-CMDC',
          summary: {
            file_count: 20289,
            data_categories: [
              {
                file_count: 8450,
                case_count: 278,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 3512,
                case_count: 278,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 278,
                case_count: 278,
                data_category: 'Clinical',
              },
              {
                file_count: 544,
                case_count: 259,
                data_category: 'Biospecimen',
              },
              {
                file_count: 1393,
                case_count: 268,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 1742,
                case_count: 262,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 1353,
                case_count: 267,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 1139,
                case_count: 268,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 1878,
                case_count: 262,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 8096,
                case_count: 276,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 4587,
                case_count: 277,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 4228,
                case_count: 262,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 1203,
                case_count: 250,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 1353,
                case_count: 267,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 314,
                case_count: 152,
                experimental_strategy: 'Tissue Slide',
              },
            ],
            case_count: 278,
            file_size: 128958859569621,
          },
          primary_site: [
            'Stomach',
            'Uterus, NOS',
            'Connective, subcutaneous and other soft tissues',
            'Skin',
            'Other and ill-defined sites',
            'Brain',
            'Bones, joints and articular cartilage of other and unspecified sites',
            'Ovary',
            'Other and unspecified parts of biliary tract',
            'Other and unspecified parts of tongue',
            'Corpus uteri',
            'Rectosigmoid junction',
            'Pancreas',
            'Small intestine',
            'Gallbladder',
            'Kidney',
            'Nasal cavity and middle ear',
            'Esophagus',
            'Liver and intrahepatic bile ducts',
            'Other and unspecified parts of mouth',
            'Rectum',
            'Colon',
            'Bronchus and lung',
            'Breast',
          ],
          dbgap_accession_number: null,
          project_id: 'HCMI-CMDC',
          disease_type: [
            'Soft Tissue Tumors and Sarcomas, NOS',
            'Complex Mixed and Stromal Neoplasms',
            'Acinar Cell Neoplasms',
            'Squamous Cell Neoplasms',
            'Osseous and Chondromatous Neoplasms',
            'Cystic, Mucinous and Serous Neoplasms',
            'Fibromatous Neoplasms',
            'Ductal and Lobular Neoplasms',
            'Gliomas',
            'Epithelial Neoplasms, NOS',
            'Blood Vessel Tumors',
            'Myomatous Neoplasms',
            'Complex Epithelial Neoplasms',
            'Adenomas and Adenocarcinomas',
            'Nevi and Melanomas',
            'Miscellaneous Bone Tumors',
          ],
          name: 'NCI Cancer Model Development for the Human Cancer Model Initiative',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs001486',
            program_id: 'a5448c11-d46a-56aa-a5e1-5c1aa06404df',
            name: 'HCMI',
          },
          released: true,
        },
        {
          id: 'TCGA-BRCA',
          summary: {
            file_count: 68962,
            data_categories: [
              {
                file_count: 19753,
                case_count: 1098,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 9282,
                case_count: 1098,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 5316,
                case_count: 1098,
                data_category: 'Biospecimen',
              },
              {
                file_count: 2288,
                case_count: 1098,
                data_category: 'Clinical',
              },
              {
                file_count: 14346,
                case_count: 1098,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 4876,
                case_count: 1097,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 3714,
                case_count: 1097,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 919,
                case_count: 881,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 2696,
                case_count: 784,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 5772,
                case_count: 1098,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 11079,
                case_count: 1095,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 17049,
                case_count: 1072,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 3621,
                case_count: 1079,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 10572,
                case_count: 952,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 75,
                case_count: 74,
                experimental_strategy: 'ATAC-Seq',
              },
              {
                file_count: 14329,
                case_count: 1098,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 3714,
                case_count: 1097,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 919,
                case_count: 881,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 1133,
                case_count: 1062,
                experimental_strategy: 'Diagnostic Slide',
              },
              {
                file_count: 1978,
                case_count: 1093,
                experimental_strategy: 'Tissue Slide',
              },
            ],
            case_count: 1098,
            file_size: 624991042858055,
          },
          primary_site: ['Breast'],
          dbgap_accession_number: null,
          project_id: 'TCGA-BRCA',
          disease_type: [
            'Epithelial Neoplasms, NOS',
            'Adnexal and Skin Appendage Neoplasms',
            'Squamous Cell Neoplasms',
            'Adenomas and Adenocarcinomas',
            'Complex Epithelial Neoplasms',
            'Fibroepithelial Neoplasms',
            'Cystic, Mucinous and Serous Neoplasms',
            'Basal Cell Neoplasms',
            'Ductal and Lobular Neoplasms',
          ],
          name: 'Breast Invasive Carcinoma',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
        {
          id: 'CPTAC-3',
          summary: {
            file_count: 79369,
            data_categories: [
              {
                file_count: 29172,
                case_count: 1321,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 16136,
                case_count: 1345,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 6009,
                case_count: 1305,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 5892,
                case_count: 1297,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 9076,
                case_count: 1342,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 3410,
                case_count: 1290,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 9674,
                case_count: 1342,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 26469,
                case_count: 1325,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 423,
                case_count: 72,
                experimental_strategy: 'Targeted Sequencing',
              },
              {
                file_count: 21537,
                case_count: 1342,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 18549,
                case_count: 1308,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 6162,
                case_count: 1316,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 220,
                case_count: 30,
                experimental_strategy: 'scRNA-Seq',
              },
              {
                file_count: 6009,
                case_count: 1305,
                experimental_strategy: 'Methylation Array',
              },
            ],
            case_count: 1345,
            file_size: 519357551352164,
          },
          primary_site: [
            'Bronchus and lung',
            'Breast',
            'Uterus, NOS',
            'Other and ill-defined sites',
            'Unknown',
            'Kidney',
            'Colon',
            'Other and unspecified urinary organs',
            'Brain',
            'Pancreas',
          ],
          dbgap_accession_number: 'phs001287',
          project_id: 'CPTAC-3',
          disease_type: [
            'Squamous Cell Neoplasms',
            'Gliomas',
            'Adenomas and Adenocarcinomas',
            'Epithelial Neoplasms, NOS',
            'Ductal and Lobular Neoplasms',
            'Transitional Cell Papillomas and Carcinomas',
            'Complex Epithelial Neoplasms',
            'Not Applicable',
            'Nevi and Melanomas',
            'Lipomatous Neoplasms',
            'Complex Mixed and Stromal Neoplasms',
          ],
          name: 'CPTAC-Brain, Head and Neck, Kidney, Lung, Pancreas, Uterus',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: null,
            program_id: 'fe856b91-d4a1-51dd-ba58-ea71644ff5cd',
            name: 'CPTAC',
          },
          released: true,
        },
        {
          id: 'CPTAC-2',
          summary: {
            file_count: 9244,
            data_categories: [
              {
                file_count: 4586,
                case_count: 328,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 1998,
                case_count: 341,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 1300,
                case_count: 340,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 1360,
                case_count: 340,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 5254,
                case_count: 340,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 930,
                case_count: 310,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 3060,
                case_count: 340,
                experimental_strategy: 'RNA-Seq',
              },
            ],
            case_count: 342,
            file_size: 40135758407376,
          },
          primary_site: [
            'Colon',
            'Ovary',
            'Rectum',
            'Other and unspecified female genital organs',
            'Retroperitoneum and peritoneum',
            'Breast',
          ],
          dbgap_accession_number: 'phs000892',
          project_id: 'CPTAC-2',
          disease_type: [
            'Ductal and Lobular Neoplasms',
            'Cystic, Mucinous and Serous Neoplasms',
            'Squamous Cell Neoplasms',
            'Not Reported',
            'Adenomas and Adenocarcinomas',
          ],
          name: 'CPTAC-Breast, Colon, Ovary',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: null,
            program_id: 'fe856b91-d4a1-51dd-ba58-ea71644ff5cd',
            name: 'CPTAC',
          },
          released: true,
        },
        {
          id: 'EXCEPTIONAL_RESPONDERS-ER',
          summary: {
            file_count: 1826,
            data_categories: [
              {
                file_count: 490,
                case_count: 20,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 491,
                case_count: 84,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 151,
                case_count: 84,
                data_category: 'Clinical',
              },
              {
                file_count: 132,
                case_count: 84,
                data_category: 'Biospecimen',
              },
              {
                file_count: 188,
                case_count: 70,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 374,
                case_count: 70,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 427,
                case_count: 82,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 272,
                case_count: 69,
                experimental_strategy: 'Targeted Sequencing',
              },
              {
                file_count: 844,
                case_count: 70,
                experimental_strategy: 'RNA-Seq',
              },
            ],
            case_count: 84,
            file_size: 4717135371662,
          },
          primary_site: [
            'Colon',
            'Other and unspecified female genital organs',
            'Esophagus',
            'Other and ill-defined digestive organs',
            'Ovary',
            'Anus and anal canal',
            'Pancreas',
            'Brain',
            'Breast',
            'Kidney',
            'Skin',
            'Rectum',
            'Bladder',
            'Bronchus and lung',
            'Connective, subcutaneous and other soft tissues',
            'Unknown',
            'Uterus, NOS',
            'Stomach',
            'Other and unspecified parts of biliary tract',
            'Other and ill-defined sites',
          ],
          dbgap_accession_number: null,
          project_id: 'EXCEPTIONAL_RESPONDERS-ER',
          disease_type: [
            'Complex Mixed and Stromal Neoplasms',
            'Myomatous Neoplasms',
            'Ductal and Lobular Neoplasms',
            'Nevi and Melanomas',
            'Epithelial Neoplasms, NOS',
            'Neoplasms, NOS',
            'Squamous Cell Neoplasms',
            'Gliomas',
            'Adenomas and Adenocarcinomas',
          ],
          name: 'Exceptional Responders',
          releasable: false,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs001145',
            program_id: '49f872b8-e9b8-5233-80a9-1d045a44d4a7',
            name: 'EXCEPTIONAL_RESPONDERS',
          },
          released: true,
        },
        {
          id: 'CMI-MPC',
          summary: {
            file_count: 1305,
            data_categories: [
              {
                file_count: 840,
                case_count: 60,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 237,
                case_count: 63,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 76,
                case_count: 38,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 152,
                case_count: 38,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 963,
                case_count: 63,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 342,
                case_count: 38,
                experimental_strategy: 'RNA-Seq',
              },
            ],
            case_count: 63,
            file_size: 4426774305000,
          },
          primary_site: ['Prostate gland', 'Lymph nodes'],
          dbgap_accession_number: 'phs001939',
          project_id: 'CMI-MPC',
          disease_type: ['Adenomas and Adenocarcinomas'],
          name: 'Count Me In (CMI): The Metastatic Prostate Cancer (MPC) Project',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: null,
            program_id: '82bbf180-0679-5344-86f4-9f3d6b00b7ef',
            name: 'CMI',
          },
          released: true,
        },
        {
          id: 'TARGET-WT',
          summary: {
            file_count: 6415,
            data_categories: [
              {
                file_count: 3811,
                case_count: 631,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 1303,
                case_count: 650,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 82,
                case_count: 81,
                data_category: 'Combined Nucleotide Variation',
              },
              {
                file_count: 2,
                case_count: 652,
                data_category: 'Biospecimen',
              },
              {
                file_count: 4,
                case_count: 652,
                data_category: 'Clinical',
              },
              {
                file_count: 548,
                case_count: 128,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 393,
                case_count: 126,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 272,
                case_count: 125,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 414,
                case_count: 127,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 84,
                case_count: 81,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 952,
                case_count: 125,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 683,
                case_count: 45,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 3883,
                case_count: 650,
                experimental_strategy: 'Targeted Sequencing',
              },
              {
                file_count: 393,
                case_count: 126,
                experimental_strategy: 'Methylation Array',
              },
            ],
            case_count: 652,
            file_size: 10384529266452,
          },
          primary_site: ['Kidney'],
          dbgap_accession_number: 'phs000471',
          project_id: 'TARGET-WT',
          disease_type: ['Complex Mixed and Stromal Neoplasms'],
          name: 'High-Risk Wilms Tumor',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000218',
            program_id: 'f1c391e9-8488-55a8-b777-302e786ea11d',
            name: 'TARGET',
          },
          released: true,
        },
        {
          id: 'TARGET-OS',
          summary: {
            file_count: 4196,
            data_categories: [
              {
                file_count: 2353,
                case_count: 143,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 791,
                case_count: 263,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 43,
                case_count: 31,
                data_category: 'Combined Nucleotide Variation',
              },
              {
                file_count: 2,
                case_count: 383,
                data_category: 'Biospecimen',
              },
              {
                file_count: 4,
                case_count: 293,
                data_category: 'Clinical',
              },
              {
                file_count: 387,
                case_count: 90,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 176,
                case_count: 88,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 258,
                case_count: 86,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 6,
                case_count: 3,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 176,
                case_count: 88,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 1638,
                case_count: 113,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 203,
                case_count: 58,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 616,
                case_count: 88,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 1142,
                case_count: 165,
                experimental_strategy: 'Targeted Sequencing',
              },
              {
                file_count: 333,
                case_count: 88,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 258,
                case_count: 86,
                experimental_strategy: 'Methylation Array',
              },
            ],
            case_count: 383,
            file_size: 23726494095813,
          },
          primary_site: [
            'Not Reported',
            'Bones, joints and articular cartilage of other and unspecified sites',
            'Bones, joints and articular cartilage of limbs',
          ],
          dbgap_accession_number: 'phs000468',
          project_id: 'TARGET-OS',
          disease_type: ['Osseous and Chondromatous Neoplasms'],
          name: 'Osteosarcoma',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000218',
            program_id: 'f1c391e9-8488-55a8-b777-302e786ea11d',
            name: 'TARGET',
          },
          released: true,
        },
        {
          id: 'TARGET-ALL-P2',
          summary: {
            file_count: 17778,
            data_categories: [
              {
                file_count: 10302,
                case_count: 727,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 3504,
                case_count: 964,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 2,
                case_count: 1574,
                data_category: 'Biospecimen',
              },
              {
                file_count: 8,
                case_count: 1034,
                data_category: 'Clinical',
              },
              {
                file_count: 1364,
                case_count: 381,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 1526,
                case_count: 474,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 8,
                case_count: 4,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 1064,
                case_count: 469,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 11792,
                case_count: 784,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 3724,
                case_count: 469,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 347,
                case_count: 77,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 693,
                case_count: 191,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 1212,
                case_count: 330,
                experimental_strategy: 'Genotyping Array',
              },
            ],
            case_count: 1587,
            file_size: 70879882326498,
          },
          primary_site: ['Hematopoietic and reticuloendothelial systems'],
          dbgap_accession_number: 'phs000464',
          project_id: 'TARGET-ALL-P2',
          disease_type: ['Lymphoid Leukemias'],
          name: 'Acute Lymphoblastic Leukemia - Phase II',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000218',
            program_id: 'f1c391e9-8488-55a8-b777-302e786ea11d',
            name: 'TARGET',
          },
          released: true,
        },
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
        {
          id: 'MP2PRT-ALL',
          summary: {
            file_count: 52761,
            data_categories: [
              {
                file_count: 24164,
                case_count: 1508,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 10432,
                case_count: 1510,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 3,
                case_count: 1510,
                data_category: 'Clinical',
              },
              {
                file_count: 5992,
                case_count: 1503,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 2958,
                case_count: 1479,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 3261,
                case_count: 1493,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 5951,
                case_count: 1480,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 23471,
                case_count: 1494,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 13311,
                case_count: 1479,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 15976,
                case_count: 1507,
                experimental_strategy: 'WGS',
              },
            ],
            case_count: 1510,
            file_size: 595215345959904,
          },
          primary_site: ['Hematopoietic and reticuloendothelial systems'],
          dbgap_accession_number: 'phs002005',
          project_id: 'MP2PRT-ALL',
          disease_type: ['Acute Lymphoblastic Leukemia', 'Lymphoid Leukemias'],
          name: 'Molecular Profiling to Predict Response to Treatment for Acute Lymphoblastic Leukemia',
          releasable: false,
          state: 'open',
          program: {
            dbgap_accession_number: null,
            program_id: '710af5f1-9fd6-567e-9e10-226082994325',
            name: 'MP2PRT',
          },
          released: true,
        },
        {
          id: 'TCGA-READ',
          summary: {
            file_count: 9871,
            data_categories: [
              {
                file_count: 2975,
                case_count: 171,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 1264,
                case_count: 171,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 1055,
                case_count: 172,
                data_category: 'Biospecimen',
              },
              {
                file_count: 364,
                case_count: 172,
                data_category: 'Clinical',
              },
              {
                file_count: 2134,
                case_count: 171,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 684,
                case_count: 167,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 537,
                case_count: 165,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 132,
                case_count: 131,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 230,
                case_count: 63,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 496,
                case_count: 120,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 2621,
                case_count: 168,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 495,
                case_count: 161,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 1161,
                case_count: 167,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 1360,
                case_count: 143,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 2146,
                case_count: 167,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 537,
                case_count: 165,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 132,
                case_count: 131,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 364,
                case_count: 171,
                experimental_strategy: 'Tissue Slide',
              },
              {
                file_count: 166,
                case_count: 165,
                experimental_strategy: 'Diagnostic Slide',
              },
            ],
            case_count: 172,
            file_size: 92531487144606,
          },
          primary_site: [
            'Rectum',
            'Connective, subcutaneous and other soft tissues',
            'Unknown',
            'Rectosigmoid junction',
            'Colon',
          ],
          dbgap_accession_number: null,
          project_id: 'TCGA-READ',
          disease_type: [
            'Adenomas and Adenocarcinomas',
            'Cystic, Mucinous and Serous Neoplasms',
          ],
          name: 'Rectum Adenocarcinoma',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
        {
          id: 'TCGA-ESCA',
          summary: {
            file_count: 10904,
            data_categories: [
              {
                file_count: 3219,
                case_count: 185,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 1468,
                case_count: 185,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 962,
                case_count: 185,
                data_category: 'Biospecimen',
              },
              {
                file_count: 393,
                case_count: 185,
                data_category: 'Clinical',
              },
              {
                file_count: 2256,
                case_count: 185,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 796,
                case_count: 185,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 606,
                case_count: 185,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 126,
                case_count: 126,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 231,
                case_count: 63,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 847,
                case_count: 185,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 2965,
                case_count: 184,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 600,
                case_count: 184,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 1782,
                case_count: 184,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 1059,
                case_count: 118,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 18,
                case_count: 18,
                experimental_strategy: 'ATAC-Seq',
              },
              {
                file_count: 2393,
                case_count: 185,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 606,
                case_count: 185,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 126,
                case_count: 126,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 238,
                case_count: 172,
                experimental_strategy: 'Tissue Slide',
              },
              {
                file_count: 158,
                case_count: 156,
                experimental_strategy: 'Diagnostic Slide',
              },
            ],
            case_count: 185,
            file_size: 73413334176540,
          },
          primary_site: ['Esophagus', 'Stomach'],
          dbgap_accession_number: null,
          project_id: 'TCGA-ESCA',
          disease_type: [
            'Squamous Cell Neoplasms',
            'Adenomas and Adenocarcinomas',
            'Cystic, Mucinous and Serous Neoplasms',
          ],
          name: 'Esophageal Carcinoma',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
        {
          id: 'TCGA-KICH',
          summary: {
            file_count: 5727,
            data_categories: [
              {
                file_count: 1526,
                case_count: 86,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 766,
                case_count: 86,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 562,
                case_count: 113,
                data_category: 'Biospecimen',
              },
              {
                file_count: 248,
                case_count: 113,
                data_category: 'Clinical',
              },
              {
                file_count: 1130,
                case_count: 86,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 364,
                case_count: 66,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 198,
                case_count: 66,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 63,
                case_count: 63,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 413,
                case_count: 84,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 457,
                case_count: 77,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 819,
                case_count: 66,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 1652,
                case_count: 86,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 273,
                case_count: 66,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 1056,
                case_count: 66,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 856,
                case_count: 66,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 198,
                case_count: 66,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 63,
                case_count: 63,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 121,
                case_count: 109,
                experimental_strategy: 'Diagnostic Slide',
              },
              {
                file_count: 205,
                case_count: 90,
                experimental_strategy: 'Tissue Slide',
              },
            ],
            case_count: 113,
            file_size: 78006862297769,
          },
          primary_site: ['Kidney'],
          dbgap_accession_number: null,
          project_id: 'TCGA-KICH',
          disease_type: ['Adenomas and Adenocarcinomas'],
          name: 'Kidney Chromophobe',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
        {
          id: 'TCGA-PAAD',
          summary: {
            file_count: 12386,
            data_categories: [
              {
                file_count: 3678,
                case_count: 185,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 1537,
                case_count: 185,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 1032,
                case_count: 185,
                data_category: 'Biospecimen',
              },
              {
                file_count: 396,
                case_count: 185,
                data_category: 'Clinical',
              },
              {
                file_count: 2700,
                case_count: 185,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 732,
                case_count: 178,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 585,
                case_count: 184,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 120,
                case_count: 120,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 710,
                case_count: 164,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 896,
                case_count: 181,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 1647,
                case_count: 178,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 2950,
                case_count: 185,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 549,
                case_count: 178,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 2731,
                case_count: 173,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 2376,
                case_count: 185,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 585,
                case_count: 184,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 120,
                case_count: 120,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 257,
                case_count: 185,
                experimental_strategy: 'Tissue Slide',
              },
              {
                file_count: 209,
                case_count: 183,
                experimental_strategy: 'Diagnostic Slide',
              },
            ],
            case_count: 185,
            file_size: 132626442716052,
          },
          primary_site: ['Pancreas'],
          dbgap_accession_number: null,
          project_id: 'TCGA-PAAD',
          disease_type: [
            'Epithelial Neoplasms, NOS',
            'Adenomas and Adenocarcinomas',
            'Cystic, Mucinous and Serous Neoplasms',
            'Ductal and Lobular Neoplasms',
          ],
          name: 'Pancreatic Adenocarcinoma',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
        {
          id: 'TCGA-CESC',
          summary: {
            file_count: 18834,
            data_categories: [
              {
                file_count: 5550,
                case_count: 306,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 2512,
                case_count: 307,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 1536,
                case_count: 307,
                data_category: 'Biospecimen',
              },
              {
                file_count: 632,
                case_count: 307,
                data_category: 'Clinical',
              },
              {
                file_count: 3908,
                case_count: 304,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 1242,
                case_count: 307,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 936,
                case_count: 307,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 172,
                case_count: 172,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 847,
                case_count: 238,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 1499,
                case_count: 306,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 2781,
                case_count: 304,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 4877,
                case_count: 305,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 936,
                case_count: 307,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 3082,
                case_count: 271,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 4,
                case_count: 2,
                experimental_strategy: 'ATAC-Seq',
              },
              {
                file_count: 3878,
                case_count: 304,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 936,
                case_count: 307,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 172,
                case_count: 172,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 325,
                case_count: 306,
                experimental_strategy: 'Tissue Slide',
              },
              {
                file_count: 279,
                case_count: 269,
                experimental_strategy: 'Diagnostic Slide',
              },
            ],
            case_count: 307,
            file_size: 177563177933719,
          },
          primary_site: ['Ovary', 'Cervix uteri'],
          dbgap_accession_number: null,
          project_id: 'TCGA-CESC',
          disease_type: [
            'Complex Epithelial Neoplasms',
            'Adenomas and Adenocarcinomas',
            'Squamous Cell Neoplasms',
            'Cystic, Mucinous and Serous Neoplasms',
          ],
          name: 'Cervical Squamous Cell Carcinoma and Endocervical Adenocarcinoma',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
        {
          id: 'TCGA-COAD',
          summary: {
            file_count: 28133,
            data_categories: [
              {
                file_count: 8365,
                case_count: 461,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 3610,
                case_count: 460,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 2835,
                case_count: 461,
                data_category: 'Biospecimen',
              },
              {
                file_count: 995,
                case_count: 461,
                data_category: 'Clinical',
              },
              {
                file_count: 6040,
                case_count: 461,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 1978,
                case_count: 459,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 1665,
                case_count: 457,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 363,
                case_count: 360,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 726,
                case_count: 186,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 1556,
                case_count: 355,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 1395,
                case_count: 444,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 3564,
                case_count: 458,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 7458,
                case_count: 443,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 3482,
                case_count: 371,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 41,
                case_count: 38,
                experimental_strategy: 'ATAC-Seq',
              },
              {
                file_count: 6335,
                case_count: 460,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 1665,
                case_count: 457,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 363,
                case_count: 360,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 983,
                case_count: 460,
                experimental_strategy: 'Tissue Slide',
              },
              {
                file_count: 459,
                case_count: 451,
                experimental_strategy: 'Diagnostic Slide',
              },
            ],
            case_count: 461,
            file_size: 275277980360208,
          },
          primary_site: ['Rectosigmoid junction', 'Colon'],
          dbgap_accession_number: null,
          project_id: 'TCGA-COAD',
          disease_type: [
            'Complex Epithelial Neoplasms',
            'Epithelial Neoplasms, NOS',
            'Adenomas and Adenocarcinomas',
            'Cystic, Mucinous and Serous Neoplasms',
          ],
          name: 'Colon Adenocarcinoma',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
        {
          id: 'TCGA-BLCA',
          summary: {
            file_count: 29345,
            data_categories: [
              {
                file_count: 8649,
                case_count: 412,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 4294,
                case_count: 412,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 1760,
                case_count: 412,
                data_category: 'Biospecimen',
              },
              {
                file_count: 994,
                case_count: 412,
                data_category: 'Clinical',
              },
              {
                file_count: 6144,
                case_count: 412,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 1736,
                case_count: 412,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 1320,
                case_count: 412,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 343,
                case_count: 343,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 1790,
                case_count: 295,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 2315,
                case_count: 411,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 3878,
                case_count: 406,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 1311,
                case_count: 409,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 7724,
                case_count: 411,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 6708,
                case_count: 412,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 10,
                case_count: 10,
                experimental_strategy: 'ATAC-Seq',
              },
              {
                file_count: 5297,
                case_count: 412,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 1320,
                case_count: 412,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 343,
                case_count: 343,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 469,
                case_count: 412,
                experimental_strategy: 'Tissue Slide',
              },
              {
                file_count: 457,
                case_count: 386,
                experimental_strategy: 'Diagnostic Slide',
              },
            ],
            case_count: 412,
            file_size: 411313943990580,
          },
          primary_site: ['Bladder'],
          dbgap_accession_number: null,
          project_id: 'TCGA-BLCA',
          disease_type: [
            'Epithelial Neoplasms, NOS',
            'Adenomas and Adenocarcinomas',
            'Transitional Cell Papillomas and Carcinomas',
            'Squamous Cell Neoplasms',
          ],
          name: 'Bladder Urothelial Carcinoma',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
        {
          id: 'TCGA-UCEC',
          summary: {
            file_count: 31933,
            data_categories: [
              {
                file_count: 10079,
                case_count: 559,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 3949,
                case_count: 559,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 3050,
                case_count: 560,
                data_category: 'Biospecimen',
              },
              {
                file_count: 1166,
                case_count: 560,
                data_category: 'Clinical',
              },
              {
                file_count: 7174,
                case_count: 559,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 2336,
                case_count: 559,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 1809,
                case_count: 559,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 440,
                case_count: 440,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 837,
                case_count: 229,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 1093,
                case_count: 343,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 8775,
                case_count: 554,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 3021,
                case_count: 557,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 1737,
                case_count: 550,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 4783,
                case_count: 482,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 13,
                case_count: 13,
                experimental_strategy: 'ATAC-Seq',
              },
              {
                file_count: 7139,
                case_count: 559,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 1809,
                case_count: 559,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 440,
                case_count: 440,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 566,
                case_count: 505,
                experimental_strategy: 'Diagnostic Slide',
              },
              {
                file_count: 805,
                case_count: 560,
                experimental_strategy: 'Tissue Slide',
              },
            ],
            case_count: 560,
            file_size: 302754673153113,
          },
          primary_site: ['Corpus uteri', 'Uterus, NOS'],
          dbgap_accession_number: null,
          project_id: 'TCGA-UCEC',
          disease_type: [
            'Epithelial Neoplasms, NOS',
            'Adenomas and Adenocarcinomas',
            'Cystic, Mucinous and Serous Neoplasms',
            'Not Reported',
          ],
          name: 'Uterine Corpus Endometrial Carcinoma',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
        {
          id: 'TCGA-PRAD',
          summary: {
            file_count: 30681,
            data_categories: [
              {
                file_count: 9160,
                case_count: 500,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 4344,
                case_count: 498,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 2182,
                case_count: 500,
                data_category: 'Biospecimen',
              },
              {
                file_count: 1038,
                case_count: 500,
                data_category: 'Clinical',
              },
              {
                file_count: 6592,
                case_count: 499,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 2210,
                case_count: 498,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 1659,
                case_count: 498,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 352,
                case_count: 352,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 719,
                case_count: 194,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 2425,
                case_count: 497,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 4100,
                case_count: 414,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 1653,
                case_count: 494,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 4986,
                case_count: 497,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 8087,
                case_count: 498,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 26,
                case_count: 26,
                experimental_strategy: 'ATAC-Seq',
              },
              {
                file_count: 6598,
                case_count: 498,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 1659,
                case_count: 498,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 352,
                case_count: 352,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 449,
                case_count: 403,
                experimental_strategy: 'Diagnostic Slide',
              },
              {
                file_count: 723,
                case_count: 490,
                experimental_strategy: 'Tissue Slide',
              },
            ],
            case_count: 500,
            file_size: 244484477825156,
          },
          primary_site: ['Prostate gland'],
          dbgap_accession_number: null,
          project_id: 'TCGA-PRAD',
          disease_type: [
            'Adenomas and Adenocarcinomas',
            'Cystic, Mucinous and Serous Neoplasms',
            'Acinar Cell Neoplasms',
            'Ductal and Lobular Neoplasms',
          ],
          name: 'Prostate Adenocarcinoma',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
        {
          id: 'TCGA-STAD',
          summary: {
            file_count: 29472,
            data_categories: [
              {
                file_count: 8588,
                case_count: 443,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 4228,
                case_count: 443,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 2537,
                case_count: 443,
                data_category: 'Biospecimen',
              },
              {
                file_count: 906,
                case_count: 443,
                data_category: 'Clinical',
              },
              {
                file_count: 6368,
                case_count: 443,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 1878,
                case_count: 439,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 1410,
                case_count: 443,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 357,
                case_count: 357,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 1079,
                case_count: 231,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 2121,
                case_count: 429,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 7086,
                case_count: 443,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 4032,
                case_count: 415,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 1473,
                case_count: 436,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 5804,
                case_count: 436,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 21,
                case_count: 21,
                experimental_strategy: 'ATAC-Seq',
              },
              {
                file_count: 5846,
                case_count: 443,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 1410,
                case_count: 443,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 357,
                case_count: 357,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 442,
                case_count: 416,
                experimental_strategy: 'Diagnostic Slide',
              },
              {
                file_count: 755,
                case_count: 432,
                experimental_strategy: 'Tissue Slide',
              },
            ],
            case_count: 443,
            file_size: 356148433872578,
          },
          primary_site: ['Stomach'],
          dbgap_accession_number: null,
          project_id: 'TCGA-STAD',
          disease_type: [
            'Adenomas and Adenocarcinomas',
            'Cystic, Mucinous and Serous Neoplasms',
          ],
          name: 'Stomach Adenocarcinoma',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
        {
          id: 'TCGA-LGG',
          summary: {
            file_count: 32168,
            data_categories: [
              {
                file_count: 9704,
                case_count: 516,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 4295,
                case_count: 516,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 2614,
                case_count: 516,
                data_category: 'Biospecimen',
              },
              {
                file_count: 1064,
                case_count: 516,
                data_category: 'Clinical',
              },
              {
                file_count: 6802,
                case_count: 515,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 2128,
                case_count: 516,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 1602,
                case_count: 516,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 435,
                case_count: 430,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 1033,
                case_count: 315,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 2491,
                case_count: 516,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 4806,
                case_count: 516,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 8505,
                case_count: 516,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 1590,
                case_count: 512,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 4833,
                case_count: 461,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 13,
                case_count: 13,
                experimental_strategy: 'ATAC-Seq',
              },
              {
                file_count: 6706,
                case_count: 515,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 1602,
                case_count: 516,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 435,
                case_count: 430,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 728,
                case_count: 515,
                experimental_strategy: 'Tissue Slide',
              },
              {
                file_count: 844,
                case_count: 491,
                experimental_strategy: 'Diagnostic Slide',
              },
            ],
            case_count: 516,
            file_size: 295756565429214,
          },
          primary_site: ['Brain'],
          dbgap_accession_number: null,
          project_id: 'TCGA-LGG',
          disease_type: ['Gliomas'],
          name: 'Brain Lower Grade Glioma',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
        {
          id: 'TCGA-HNSC',
          summary: {
            file_count: 33623,
            data_categories: [
              {
                file_count: 9802,
                case_count: 528,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 4599,
                case_count: 528,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 2858,
                case_count: 528,
                data_category: 'Biospecimen',
              },
              {
                file_count: 1103,
                case_count: 528,
                data_category: 'Clinical',
              },
              {
                file_count: 7049,
                case_count: 528,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 2270,
                case_count: 528,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 1740,
                case_count: 528,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 354,
                case_count: 354,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 1203,
                case_count: 304,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 2645,
                case_count: 525,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 1707,
                case_count: 524,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 8264,
                case_count: 527,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 5094,
                case_count: 521,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 5505,
                case_count: 482,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 9,
                case_count: 9,
                experimental_strategy: 'ATAC-Seq',
              },
              {
                file_count: 6989,
                case_count: 526,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 1740,
                case_count: 528,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 354,
                case_count: 354,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 791,
                case_count: 520,
                experimental_strategy: 'Tissue Slide',
              },
              {
                file_count: 472,
                case_count: 450,
                experimental_strategy: 'Diagnostic Slide',
              },
            ],
            case_count: 528,
            file_size: 303053827053171,
          },
          primary_site: [
            'Tonsil',
            'Gum',
            'Lip',
            'Larynx',
            'Floor of mouth',
            'Other and unspecified parts of mouth',
            'Other and unspecified parts of tongue',
            'Bones, joints and articular cartilage of other and unspecified sites',
            'Hypopharynx',
            'Oropharynx',
            'Palate',
            'Other and ill-defined sites in lip, oral cavity and pharynx',
            'Base of tongue',
          ],
          dbgap_accession_number: null,
          project_id: 'TCGA-HNSC',
          disease_type: ['Squamous Cell Neoplasms'],
          name: 'Head and Neck Squamous Cell Carcinoma',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
        {
          id: 'TCGA-LUAD',
          summary: {
            file_count: 35035,
            data_categories: [
              {
                file_count: 10865,
                case_count: 572,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 5050,
                case_count: 584,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 2731,
                case_count: 585,
                data_category: 'Biospecimen',
              },
              {
                file_count: 1146,
                case_count: 585,
                data_category: 'Clinical',
              },
              {
                file_count: 6924,
                case_count: 519,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 2334,
                case_count: 519,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 2130,
                case_count: 579,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 365,
                case_count: 365,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 798,
                case_count: 176,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 2692,
                case_count: 518,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 5400,
                case_count: 517,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 1701,
                case_count: 513,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 4207,
                case_count: 471,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 10096,
                case_count: 582,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 22,
                case_count: 22,
                experimental_strategy: 'ATAC-Seq',
              },
              {
                file_count: 7237,
                case_count: 518,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 2130,
                case_count: 579,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 365,
                case_count: 365,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 1067,
                case_count: 514,
                experimental_strategy: 'Tissue Slide',
              },
              {
                file_count: 541,
                case_count: 478,
                experimental_strategy: 'Diagnostic Slide',
              },
            ],
            case_count: 585,
            file_size: 349899663576673,
          },
          primary_site: ['Bronchus and lung'],
          dbgap_accession_number: null,
          project_id: 'TCGA-LUAD',
          disease_type: [
            'Adenomas and Adenocarcinomas',
            'Cystic, Mucinous and Serous Neoplasms',
            'Acinar Cell Neoplasms',
            'Ductal and Lobular Neoplasms',
          ],
          name: 'Lung Adenocarcinoma',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
        {
          id: 'TCGA-GBM',
          summary: {
            file_count: 29583,
            data_categories: [
              {
                file_count: 9007,
                case_count: 601,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 3251,
                case_count: 428,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 2920,
                case_count: 617,
                data_category: 'Biospecimen',
              },
              {
                file_count: 1219,
                case_count: 617,
                data_category: 'Clinical',
              },
              {
                file_count: 6981,
                case_count: 600,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 1898,
                case_count: 572,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 1350,
                case_count: 423,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 243,
                case_count: 237,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 867,
                case_count: 245,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 1847,
                case_count: 375,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 7897,
                case_count: 401,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 3519,
                case_count: 293,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 3684,
                case_count: 347,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 834,
                case_count: 273,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 9,
                case_count: 9,
                experimental_strategy: 'ATAC-Seq',
              },
              {
                file_count: 7348,
                case_count: 599,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 1350,
                case_count: 423,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 243,
                case_count: 237,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 860,
                case_count: 389,
                experimental_strategy: 'Diagnostic Slide',
              },
              {
                file_count: 1193,
                case_count: 606,
                experimental_strategy: 'Tissue Slide',
              },
              {
                file_count: 560,
                case_count: 540,
                experimental_strategy: 'Expression Array',
              },
            ],
            case_count: 617,
            file_size: 263101947389075,
          },
          primary_site: ['Brain'],
          dbgap_accession_number: null,
          project_id: 'TCGA-GBM',
          disease_type: ['Gliomas', 'Not Reported'],
          name: 'Glioblastoma Multiforme',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
        {
          id: 'TCGA-LUSC',
          summary: {
            file_count: 31471,
            data_categories: [
              {
                file_count: 9672,
                case_count: 504,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 4107,
                case_count: 504,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 2630,
                case_count: 504,
                data_category: 'Biospecimen',
              },
              {
                file_count: 1081,
                case_count: 504,
                data_category: 'Clinical',
              },
              {
                file_count: 6459,
                case_count: 504,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 2325,
                case_count: 504,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 1719,
                case_count: 503,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 328,
                case_count: 328,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 692,
                case_count: 205,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 2458,
                case_count: 501,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 5058,
                case_count: 501,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 1599,
                case_count: 488,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 8949,
                case_count: 502,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 3158,
                case_count: 337,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 16,
                case_count: 16,
                experimental_strategy: 'ATAC-Seq',
              },
              {
                file_count: 6798,
                case_count: 504,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 1719,
                case_count: 503,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 328,
                case_count: 328,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 1100,
                case_count: 495,
                experimental_strategy: 'Tissue Slide',
              },
              {
                file_count: 512,
                case_count: 478,
                experimental_strategy: 'Diagnostic Slide',
              },
              {
                file_count: 135,
                case_count: 134,
                experimental_strategy: 'Expression Array',
              },
            ],
            case_count: 504,
            file_size: 234057465484113,
          },
          primary_site: ['Bronchus and lung'],
          dbgap_accession_number: null,
          project_id: 'TCGA-LUSC',
          disease_type: [
            'Adenomas and Adenocarcinomas',
            'Squamous Cell Neoplasms',
          ],
          name: 'Lung Squamous Cell Carcinoma',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
        {
          id: 'TCGA-OV',
          summary: {
            file_count: 31915,
            data_categories: [
              {
                file_count: 9122,
                case_count: 603,
                data_category: 'Simple Nucleotide Variation',
              },
              {
                file_count: 3702,
                case_count: 584,
                data_category: 'Sequencing Reads',
              },
              {
                file_count: 2601,
                case_count: 608,
                data_category: 'Biospecimen',
              },
              {
                file_count: 1204,
                case_count: 608,
                data_category: 'Clinical',
              },
              {
                file_count: 7379,
                case_count: 601,
                data_category: 'Copy Number Variation',
              },
              {
                file_count: 2556,
                case_count: 559,
                data_category: 'Transcriptome Profiling',
              },
              {
                file_count: 1869,
                case_count: 602,
                data_category: 'DNA Methylation',
              },
              {
                file_count: 432,
                case_count: 422,
                data_category: 'Proteome Profiling',
              },
              {
                file_count: 1029,
                case_count: 279,
                data_category: 'Somatic Structural Variation',
              },
              {
                file_count: 2021,
                case_count: 489,
                data_category: 'Structural Variation',
              },
            ],
            experimental_strategies: [
              {
                file_count: 7977,
                case_count: 457,
                experimental_strategy: 'WXS',
              },
              {
                file_count: 1725,
                case_count: 522,
                experimental_strategy: 'miRNA-Seq',
              },
              {
                file_count: 3861,
                case_count: 422,
                experimental_strategy: 'RNA-Seq',
              },
              {
                file_count: 4019,
                case_count: 363,
                experimental_strategy: 'WGS',
              },
              {
                file_count: 7679,
                case_count: 597,
                experimental_strategy: 'Genotyping Array',
              },
              {
                file_count: 1869,
                case_count: 602,
                experimental_strategy: 'Methylation Array',
              },
              {
                file_count: 432,
                case_count: 422,
                experimental_strategy: 'Reverse Phase Protein Array',
              },
              {
                file_count: 107,
                case_count: 106,
                experimental_strategy: 'Diagnostic Slide',
              },
              {
                file_count: 1374,
                case_count: 589,
                experimental_strategy: 'Tissue Slide',
              },
              {
                file_count: 548,
                case_count: 530,
                experimental_strategy: 'Expression Array',
              },
            ],
            case_count: 608,
            file_size: 242177172865761,
          },
          primary_site: ['Ovary', 'Retroperitoneum and peritoneum'],
          dbgap_accession_number: null,
          project_id: 'TCGA-OV',
          disease_type: [
            'Cystic, Mucinous and Serous Neoplasms',
            'Not Reported',
          ],
          name: 'Ovarian Serous Cystadenocarcinoma',
          releasable: true,
          state: 'open',
          program: {
            dbgap_accession_number: 'phs000178',
            program_id: 'b80aa962-9650-5110-b3eb-bd087da808db',
            name: 'TCGA',
          },
          released: true,
        },
      ],
      pagination: {
        count: 27,
        total: 27,
        size: 27,
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
export const useGetSSMSCancerDistributionTableQuery = () => {
  const data = [
    {
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
