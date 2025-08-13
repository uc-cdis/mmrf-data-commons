import { GEN3_API} from '@gen3/core';

export const DAYS_IN_YEAR = 365.25;
export const DAYS_IN_DECADE = 3652.5;
export const CART_LIMIT = 10000;
export const SET_COUNT_LIMIT = 50000;
export const GEN3_ANALYSIS_API =  process.env.NEXT_PUBLIC_GEN3_ANALYSIS_API|| `${GEN3_API}/analysis/v0`;
