import React, { useEffect, useState, useReducer } from "react";
import AnalysisBreadcrumbs from "./AnalysisBreadcrumbs";
import AnalysisGrid from "./AnalysisGrid";
import {
  chartDownloadReducer,
  DashboardDownloadContext,
  SelectionScreenContext,
} from "./context";
import { AppRegistrationEntry } from "./types";
import { AnalysisToolConfiguration } from '@gen3/frontend';

interface AnalysisWorkspaceProps {
  readonly appInfo: AnalysisToolConfiguration;
  readonly handleAppSelected: (app: string | undefined, demoMode?: boolean) => void;
  readonly isDemoMode: boolean;
  readonly skipSelectionScreen: boolean;
  readonly ActiveAnalysisTool: React.ComponentType<{ appId: string }>;
}

/**
 * Component to handle the navigation and selecting of apps from the Analysis Tools grid. Routing
 * should be handled by the application.
 * @param registeredApps - list of available apps
 * @param recommendedApps - apps to display more prominently in the Core Tools section
 * @param CountHookRegistry - collection of hooks used for fetching count data
 * @param handleAppSelected - callback to handle routing when an app is selected from the tools grid
 * @param isDemoMode - whether the app is in demo mode
 * @param skipSelectionScreen - whether the selection screen component should be displayed on selecting the app
 * @param ActiveAnalysisTool - component wrapper to handle displaying the active analysis tool
 */

const ApplicationWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  appInfo,
                                                               handleAppSelected,
  isDemoMode,
  skipSelectionScreen,
  ActiveAnalysisTool,
}: AnalysisWorkspaceProps) => {
  const { appId: app} = appInfo;
  const [cohortSelectionOpen, setCohortSelectionOpen] = useState(false);

  useEffect(() => {
    setCohortSelectionOpen(
      !skipSelectionScreen && appInfo?.selectionScreen !== undefined,
    );
  }, [app, appInfo, skipSelectionScreen]);

  const [chartDownloadState, dispatch] = useReducer(chartDownloadReducer, []);

  if (app !== undefined && appInfo === undefined) {
    return undefined;
  }

  if (app ) {
    return (
      <div>
          <SelectionScreenContext.Provider
            value={{
              selectionScreenOpen: cohortSelectionOpen,
              setSelectionScreenOpen: setCohortSelectionOpen,
              app,
              setActiveApp: handleAppSelected,
            }}
          >
            <DashboardDownloadContext.Provider
              value={{ state: chartDownloadState, dispatch }}
            >
              <AnalysisBreadcrumbs
                onDemoApp={isDemoMode}
                skipSelectionScreen={skipSelectionScreen}
                rightComponent={
                  appInfo?.rightComponent && <appInfo.rightComponent />
                }
                appInfo={appInfo}
              />
              <ActiveAnalysisTool appId={app} />
            </DashboardDownloadContext.Provider>
          </SelectionScreenContext.Provider>
      </div>
    );
  } else {
    return null;
  }
};

export default ApplicationWorkspace;
