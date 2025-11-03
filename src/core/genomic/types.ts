import { FilterSet, TablePageOffsetProps } from "@gen3/core";

export interface GenomicTableProps extends TablePageOffsetProps {
  genesTableFilters?: FilterSet;
  geneFilters: FilterSet;
  ssmFilters: FilterSet;
  cohortFilters: FilterSet;
}

export interface SsmsTableRequestParameters extends GenomicTableProps {
  readonly geneSymbol?: string;
  readonly tableFilters: FilterSet;
  readonly _cohortFiltersNoSet?: FilterSet;
}

interface CaseIdData {
  case: {
    case_id: string;
  };
}

export interface SSMSConsequence {
  readonly id: string;
  readonly transcript: {
    readonly aa_change: string;
    readonly annotation: {
      readonly polyphen_impact: string;
      readonly polyphen_score: number;
      readonly sift_impact: string;
      readonly sift_score: string;
      readonly vep_impact: string;
      readonly hgvsc?: string;
      readonly dbsnp_rs: string;
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
  readonly filteredOccurrences: number;
  readonly id: string;
  readonly score: number;
  readonly genomic_dna_change: string;
  readonly mutation_subtype: string;
  readonly consequence: ReadonlyArray<SSMSConsequence>;
  readonly occurrence: number;
}

export interface SSMSDataResponse
  extends Omit<SSMSData, 'occurrence' | 'filteredOccurrences'> {
  readonly occurrence: ReadonlyArray<CaseIdData>;
  readonly filteredOccurrences: { ssm: { _totalCount: number } };
}

export interface SSMSTableResponse {
  cases: {
    case_centric: {
      _totalCount: number;
    };
    filteredCases: {
      _totalCount: number;
    };
  };
  ssm: SSMSDataResponse[];
  filteredOccurrences: { ssm_centric: { _totalCount: number } };
  ssms: {
    ssm_centric: {
      _totalCount: number;
    };
  };
}
