// Commenting out July 24, seems to be conflicts between versions of Survival type
//import { Survival } from "@/core/survival";

export type GeneToggledHandler = (symbol: Record<string, any>) => void;

export interface GeneRowInfo {
  readonly case_count: number;
  readonly biotype: string;
  readonly case_cnv_amplification: number;
  readonly case_cnv_gain: number;
  readonly case_cnv_loss: number;
  readonly case_cnv_homozygous_deletion: number;
  readonly cnv_case: number;
  readonly cytoband: Array<string>;
  readonly gene_id: string;
  readonly id: string;
  readonly is_cancer_gene_census: boolean;
  readonly name: string;
  readonly numCases: number;
  readonly ssm_cases_across_commons: number;
  readonly ssm_count?: number;
  readonly symbol: string;
}

export interface Gene {
  gene_id: string;
  name: string;
  type: string;
  cohort: {
    checked: boolean;
  };
  symbol: string;
  survival: Survival;
  '#_cnv_amplifications': {
    numerator: number;
    denominator: number;
  };
  '#_cnv_gains': {
    numerator: number;
    denominator: number;
  };
  '#_cnv_heterozygous_deletions': {
    numerator: number;
    denominator: number;
  };
  '#_cnv_homozygous_deletions': {
    numerator: number;
    denominator: number;
  };
  cytoband: string[];
  annotations: boolean;
  '#_mutations': string;
  '#_ssm_affected_cases_in_cohort': {
    numerator: number;
    denominator: number;
  };
  '#_ssm_affected_cases_across_the_mmrf': {
    numerator: number;
    denominator: number;
  };
}

export interface Survival {
  label: string;
  name: string;
  symbol: string;
  checked: boolean;
}
