import { GEN3_API} from '@gen3/core';

export const DAYS_IN_YEAR = 365.25;
export const DAYS_IN_DECADE = 3652.5;
export const CART_LIMIT = 10000;
export const SET_COUNT_LIMIT = 50000;
export const MAX_CASES = 10000;
export const GEN3_ANALYSIS_API =  process.env.NEXT_PUBLIC_GEN3_ANALYSIS_API|| `${GEN3_API}/analysis/v0`;
export const CASE_INDEX = 'Case_case';
export const CASE_CENTRIC_INDEX = 'CaseCentric_case_centric';
export const CASE_ID_FIELD = "case_id";
export const COHORT_FILTER_INDEX = "case_centric";
export const GENE_CENTRIC_INDEX = 'GeneCentric_gene_centric';
export const SSM_CENTRIC_INDEX = 'SSMCentric_ssm_centric';

export const PROTEINPAINT_API =  process.env.NEXT_PUBLIC_PROTEINPAINT_API || `${GEN3_API}/protein-paint`;
