const accessTypes = ['open', 'controlled'] as const;

export type AccessType = (typeof accessTypes)[number];

const isAccessType = (x: unknown): x is AccessType => {
  return accessTypes.some((t) => t === x);
};

const asAccessType = (x: unknown): AccessType => {
  if (isAccessType(x)) {
    return x;
  } else {
    throw new Error(`${x} is not a valid access type`);
  }
};

export interface HistogramDataAsStringKey {
  key: string;
  count: number;
}

// type alias for compatibility with GDC
export type Bucket = HistogramDataAsStringKey;

export interface caseFileType {
  readonly access: 'open' | 'controlled';
  readonly acl: Array<string>;
  readonly data_type: string;
  readonly file_id: string;
  readonly file_name: string;
  readonly file_size: number;
  readonly state: string;
  readonly project_id: string;
  readonly data_format: string;
  readonly created_datetime: string;
  readonly submitter_id: string;
  readonly updated_datetime: string;
  readonly data_category: string;
  readonly md5sum: string;
  readonly type: string;
}

export type FileAnnotationsType = {
  readonly annotation_id: string;
  readonly case_id?: string;
  readonly case_submitter_id?: string;
  readonly category: string;
  readonly classification: string;
  readonly created_datetime: string;
  readonly entity_id: string;
  readonly entity_submitter_id: string;
  readonly entity_type: string;
  readonly notes: string;
  readonly state: string;
  readonly status: string;
  readonly updated_datetime: string;
};

export type FileCaseType = ReadonlyArray<{
  readonly case_id: string;
  readonly submitter_id: string;
  readonly annotations?: ReadonlyArray<string>;
  readonly project?: {
    readonly dbgap_accession_number?: string;
    readonly disease_type: string;
    readonly name: string;
    readonly primary_site: string;
    readonly project_id: string;
    readonly releasable: boolean;
    readonly released: boolean;
    readonly state: string;
  };
  readonly samples?: ReadonlyArray<{
    readonly sample_id: string;
    readonly submitter_id: string;
    readonly tissue_type: string;
    readonly tumor_descriptor: string;
    readonly portions?: ReadonlyArray<{
      readonly submitter_id: string;
      readonly analytes?: ReadonlyArray<{
        readonly analyte_id: string;
        readonly analyte_type: string;
        readonly submitter_id: string;
        readonly aliquots?: ReadonlyArray<{
          readonly aliquot_id: string;
          readonly submitter_id: string;
        }>;
      }>;
      readonly slides?: ReadonlyArray<{
        readonly created_datetime: string | null;
        readonly number_proliferating_cells: number | null;
        readonly percent_eosinophil_infiltration: number | null;
        readonly percent_granulocyte_infiltration: number | null;
        readonly percent_inflam_infiltration: number | null;
        readonly percent_lymphocyte_infiltration: number | null;
        readonly percent_monocyte_infiltration: number | null;
        readonly percent_neutrophil_infiltration: number | null;
        readonly percent_necrosis: number | null;
        readonly percent_normal_cells: number | null;
        readonly percent_stromal_cells: number | null;
        readonly percent_tumor_cells: number | null;
        readonly percent_tumor_nuclei: number | null;
        readonly section_location: string | null;
        readonly slide_id: string | null;
        readonly state: string | null;
        readonly submitter_id: string | null;
        readonly updated_datetime: string | null;
      }>;
    }>;
  }>;
}>;

export interface GdcCartFile {
  readonly file_name: string;
  readonly data_category: string;
  readonly data_type: string;
  readonly data_format: string;
  readonly state: string;
  readonly file_size: number;
  readonly file_id: string;
  readonly access: AccessType;
  readonly acl: ReadonlyArray<string>;
  readonly project_id?: string;
  readonly createdDatetime: string;
  readonly updatedDatetime: string;
  readonly submitterId: string;
  readonly md5sum: string;
}

export interface GdcFile {
  readonly id?: string;
  readonly submitterId: string;
  readonly access: AccessType;
  readonly acl: ReadonlyArray<string>;
  readonly createdDatetime: string;
  readonly updatedDatetime: string;
  readonly data_category: string;
  readonly data_format: string;
  readonly dataRelease?: string;
  readonly data_type: string;
  readonly file_id: string;
  readonly file_name: string;
  readonly file_size: number;
  readonly md5sum: string;
  readonly platform?: string;
  readonly state: string;
  readonly fileType?: string;
  readonly version?: string;
  readonly experimental_strategy?: string;
  readonly project_id?: string;
  readonly annotations?: ReadonlyArray<FileAnnotationsType>;
  readonly cases?: FileCaseType;
  readonly total_reads?: string;
  readonly average_base_quality?: number;
  readonly average_insert_size?: number;
  readonly average_read_length?: number;
  readonly mean_coverage?: number;
  readonly pairs_on_diff_chr?: string;
  readonly contamination?: number;
  readonly contamination_error?: number;
  readonly proportion_reads_mapped?: number;
  readonly proportion_reads_duplicated?: number;
  readonly proportion_base_mismatch?: number;
  readonly proportion_targets_no_coverage?: number;
  readonly proportion_coverage_10x?: number;
  readonly proportion_coverage_30x?: number;
  readonly msi_score?: number;
  readonly msi_status?: number;
  readonly associated_entities?: ReadonlyArray<{
    readonly entity_submitter_id: string;
    readonly entity_type: string;
    readonly case_id: string;
    readonly entity_id: string;
  }>;
  readonly analysis?: {
    readonly workflow_type: string;
    readonly input_files?: GdcCartFile[];
    readonly metadata?: {
      readonly read_groups: Array<{
        readonly read_group_id: string;
        readonly is_paired_end: boolean;
        readonly read_length: number;
        readonly library_name: string;
        readonly sequencing_center: string;
        readonly sequencing_date: string;
      }>;
    };
  };
  readonly downstream_analyses?: ReadonlyArray<{
    readonly workflow_type: string;
    readonly output_files?: GdcCartFile[];
  }>;
  readonly index_files?: ReadonlyArray<{
    readonly submitterId: string;
    readonly createdDatetime: string;
    readonly updatedDatetime: string;
    readonly data_category: string;
    readonly data_format: string;
    readonly data_type: string;
    readonly file_id: string;
    readonly file_name: string;
    readonly file_size: number;
    readonly md5sum: string;
    readonly state: string;
  }>;
}

/**
 * The status of asynchronous data fetching is a state machine.
 * - Before data is fetched, the status is "uninitialized".
 * - Once a data request is started, the status transitions from
 * "uninitialized" to "pending".
 * - If the data request successfully completes, then the status
 * transitions from "pending" to "fulfilled".
 * - If the data request fails for any reason, then the status
 * transitions from "pending" to "rejected".
 */
export type DataStatus = 'uninitialized' | 'pending' | 'fulfilled' | 'rejected';

export type CartFile = Pick<
  GdcFile,
  | 'access'
  | 'acl'
  | 'file_id'
  | 'file_size'
  | 'state'
  | 'project_id'
  | 'file_name'
>;

export interface ProjectPercent {
  project: string;
  percent: string;
}

export type FilterSet = Record<string, any>;

interface SSMSConsequence {
  readonly id: string;
  readonly transcript: {
    readonly aa_change: string;
    readonly annotation: {
      readonly polyphen_impact: string;
      readonly polyphen_score: number;
      readonly sift_impact: string;
      readonly sift_score: number;
      readonly vep_impact: string;
      readonly hgvsc?: string;
    };
    readonly consequence_type: string;
    readonly gene: {
      readonly gene_id: string;
      readonly symbol: string;
      readonly gene_strand?: number;
    };
    readonly is_canonical: boolean;
    readonly transcript_id?: string;
  };
}

export interface SSMSData {
  readonly ssm_id: string;
  readonly occurrence: number;
  readonly filteredOccurrences: number;
  readonly id: string;
  readonly score: number;
  readonly genomic_dna_change: string;
  readonly mutation_subtype: string;
  readonly consequence: ReadonlyArray<SSMSConsequence>;
}

interface TableSubrowItem {
  project: string;
  numerator: number;
  denominator: number;
}
export type TableSubrowData = Partial<TableSubrowItem>;

export interface SSMSTableData {
  ssmsTotal: number;
  cases: number;
  filteredCases: number;
  ssms: SSMSData[];
}

export interface GraphqlApiSliceRequest {
  readonly graphQLQuery: string;
  readonly graphQLFilters: Record<string, unknown>;
}
