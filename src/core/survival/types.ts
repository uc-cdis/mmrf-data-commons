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

export interface OverallStats {
  chiSquared: number;
  degreesFreedom: number;
  pValue: number;
}

export interface SurvivalPlotData {
  readonly survivalData: ReadonlyArray<SurvivalElement>;
  readonly overallStats: Record<string, number | undefined>;
}

export interface SurvivalApiResponse extends SurvivalPlotData {
  readonly warnings: Record<string, string>;
}


export enum SurvivalPlotTypes {
  gene = "gene",
  mutation = "mutation",
  categorical = "categorical",
  continuous = "continuous",
  overall = "overall",
  cohortComparison = "cohortComparison",
}

export const EmptySurvivalPlot : SurvivalPlotData = {
  survivalData: [],
  overallStats: {}
}
