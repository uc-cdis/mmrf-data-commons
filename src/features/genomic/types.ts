export interface GenomicTableProps {
  readonly selectedSurvivalPlot?: Record<string, string>;
  readonly handleSurvivalPlotToggled?: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
}

export interface ComparativeSurvival {
  symbol: string;
  name: string;
  field: string;
  setManually?: boolean;
}

// Persist which tab is active
export type AppModeState = "genes" | "ssms";

// pass to Survival Plot when survivalPlotData data is undefined/not ready
export const emptySurvivalPlot = {
  overallStats: { pValue: undefined },
  survivalData: [],
};
