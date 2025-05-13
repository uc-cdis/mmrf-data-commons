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

interface SurvivalApiResponse {
  readonly results: ReadonlyArray<SurvivalElement>;
  readonly overallStats: Record<string, number>;
  readonly warnings: Record<string, string>;
}

export interface Survival {
  readonly survivalData: ReadonlyArray<SurvivalElement>;
  readonly overallStats: Record<string, number>;
}
