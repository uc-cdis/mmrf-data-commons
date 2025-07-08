import { NumericFromTo } from "@gen3/frontend";

export interface CustomInterval {
  readonly interval: number;
  readonly min: number;
  readonly max: number;
}

export type NamedFromTo = NumericFromTo & {
  name: string;
};

export type ContinuousCustomBinnedData = CustomInterval | NamedFromTo[];

export type CategoricalBins = Record<string, number | Record<string, number>>;

export type ChartTypes = "histogram" | "survival" | "boxqq";

export type SelectedFacet = { value: string; numCases: number };

export type DataDimension = "Years" | "Days" | "Kilograms" | "Centimeters";

export type DisplayData = {
  displayName: string;
  key: string;
  count: number;
}[];

export type CustomBinData = CategoricalBins | any[] | CustomInterval;
