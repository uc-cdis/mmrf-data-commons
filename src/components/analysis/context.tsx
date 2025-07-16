import React, { createContext, Dispatch } from "react";
import { MantineThemeOverride } from "@mantine/core";
import { ImageComponentType, LinkComponentType } from "@/core/types";
import { DownloadType } from "./types";

// Chart download context

interface ChartDownloadInfo {
  readonly chartRef: React.MutableRefObject<HTMLElement>;
  readonly filename: string;
}

export const chartDownloadReducer = (
  state: ChartDownloadInfo[],
  action: { type: "add" | "remove"; payload: ChartDownloadInfo[] },
): ChartDownloadInfo[] => {
  switch (action.type) {
    case "add":
      return [...state, ...action.payload];
    case "remove":
      return state.filter(
        (d) =>
          !action.payload.map((chart) => chart.filename).includes(d.filename),
      );
    default:
      return state;
  }
};

export const DownloadProgressContext = createContext<{
  downloadInProgress: boolean;
  setDownloadInProgress: ((inProgress: boolean) => void)
}>({
  downloadInProgress: false,
  setDownloadInProgress: () => {},
});


export const DashboardDownloadContext = createContext<{
  state: ChartDownloadInfo[];
  dispatch: Dispatch<{ type: "add" | "remove"; payload: ChartDownloadInfo[] }>;
}>({ state: [], dispatch: () => {} });

// Selection screen context

interface SelectionScreenContextProps {
  readonly selectionScreenOpen: boolean;
  readonly setSelectionScreenOpen?: (open: boolean) => void;
  readonly app?: string;
  readonly setActiveApp?: (app?: string, demoMode?: boolean) => void;
}

export const SelectionScreenContext =
  createContext<SelectionScreenContextProps>({
    selectionScreenOpen: false,
    setSelectionScreenOpen: undefined,
    app: undefined,
    setActiveApp: undefined,
  });

interface AppContextType {
  readonly path?: string;
  readonly theme?: MantineThemeOverride;
  readonly Image: ImageComponentType;
  readonly Link: LinkComponentType;
}

export const AppContext = createContext<AppContextType>({
  path: undefined,
  theme: undefined,
  // eslint-disable-next-line
  Image: (props) => <img {...props} />,
// eslint-disable-next-line
Link: (props) => <a {...props} />,
});
