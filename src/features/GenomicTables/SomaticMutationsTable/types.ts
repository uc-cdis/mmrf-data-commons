import { ComparativeSurvival } from '@/features/genomic/types';

export interface Survival {
  label: string;
  name: string;
  symbol: string;
  checked: boolean;
}

export interface Impact {
  polyphenImpact: string;
  polyphenScore: number | string;
  siftImpact: string;
  siftScore: number | string;
  vepImpact: string;
}

export interface SomaticMutation {
  select: string;
  mutation_id: string;
  dna_change: string;
  type: string;
  consequences: string;
  protein_change: {
    symbol: string;
    aaChange: string;
    geneId: string;
  };
  '#_affected_cases_in_cohort': {
    numerator: number;
    denominator: number;
  };
  '#_affected_cases_across_the_mmrf': {
    numerator: number;
    denominator: number;
  };
  cohort: {
    checked: boolean;
  };
  survival: Survival;
  impact: Impact;
  ssmsTotal: number;
}

export type SsmToggledHandler = (symbol: Record<string, any>) => void;

export interface SMTableContainerProps {
  readonly selectedSurvivalPlot?: ComparativeSurvival;
  handleSurvivalPlotToggled?: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  genomicFilters?: FilterSet;
  cohortFilters?: FilterSet;
  handleSsmToggled?: SsmToggledHandler;
  toggledSsms?: Array<string>;
  geneSymbol?: string;
  tableTitle?: string;
  isDemoMode?: boolean;
  /*
   * filter about case id sent from case summary for SMT
   */
  caseFilter?: FilterSet;
  /*
   * project id for case summary SM Table
   */
  projectId?: string;
  /*
   * boolean used to determine if the links need to be opened in a summary modal or a Link
   */
  isModal?: boolean;
  /*
   * boolean used to determine if being called in a modal
   */
  inModal?: boolean;
  /*
   *  This is being sent from GenesAndMutationFrequencyAnalysisTool when mutation count is clicked in genes table
   */
  searchTermsForGene?: { geneId?: string; geneSymbol?: string };
  /**
   *  This is required for TSV download SMTable in Gene summary page
   */
  clearSearchTermsForGene?: () => void;
  gene_id?: string;
  /**
   *  This is required for TSV download SMTable in Case summary page
   */
  case_id?: string;
}
