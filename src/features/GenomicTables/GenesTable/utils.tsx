import { ComparativeSurvival } from "@/features/genomic/types";
import { Gene, GeneRowInfo } from "./types";


export const getGene = (
  g: GeneRowInfo,
  selectedSurvivalPlot: ComparativeSurvival,
  mutationCounts: Record<string, string>,
  filteredCases: number,
  cases: number,
  cnvCases: number,
): Gene => {
  return {
    gene_id: g.gene_id,
    survival: {
      label: g.symbol,
      name: g.name,
      symbol: g.symbol,
      checked: g.symbol == selectedSurvivalPlot?.symbol,
    },
    cohort: {
      checked: true,
    },
    symbol: g.symbol,
    name: g.name,
    type: g.biotype,
    cytoband: g.cytoband,
    "#_ssm_affected_cases_in_cohort": {
      numerator: g.numCases,
      denominator: filteredCases,
    },
    "#_ssm_affected_cases_across_the_gdc": {
      numerator: g.ssm_case,
      denominator: cases,
    },
    "#_cnv_amplifications": {
      numerator: g.case_cnv_amplification,
      denominator: cnvCases,
    },
    "#_cnv_gains": {
      numerator: g.case_cnv_gain,
      denominator: cnvCases,
    },
    "#_cnv_heterozygous_deletions": {
      numerator: g.case_cnv_loss,
      denominator: cnvCases,
    },
    "#_cnv_homozygous_deletions": {
      numerator: g.case_cnv_homozygous_deletion,
      denominator: cnvCases,
    },
    "#_mutations": mutationCounts[g.gene_id],
    annotations: g.is_cancer_gene_census,
  };
};
