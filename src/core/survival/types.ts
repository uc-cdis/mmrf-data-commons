export interface SurvivalDonor {
  readonly time: number;
  readonly censored: boolean;
  readonly survivalEstimate: number;
  readonly id: string;
  readonly submitter_id: string;
  readonly project_id: string;
}

export interface SurvivalElement {
  readonly meta: Record<string, number>;
  readonly donors: ReadonlyArray<SurvivalDonor>;
}

export interface SurvivalApiResponse {
  readonly results: ReadonlyArray<SurvivalElement>;
  readonly overallStats: Record<string, number | undefined>;
  readonly warnings: Record<string, string>;
}

export interface Survival {
  readonly survivalData: ReadonlyArray<SurvivalElement>;
  readonly overallStats: Record<string, number | undefined>;
}

export const EmptySurvivalPlot  : Survival= {
  overallStats: { pValue: undefined },
  survivalData: [],
};

export enum SurvivalPlotTypes {
  gene = "gene",
  mutation = "mutation",
  categorical = "categorical",
  continuous = "continuous",
  overall = "overall",
  cohortComparison = "cohortComparison",
}

export const EmptySurivalPlot : Survival = {
  survivalData: [],
  overallStats: {}
}
