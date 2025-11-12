import App, { AppContext, AppInitialProps, AppProps } from "next/app";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { MantineProvider } from "@mantine/core";
import { mmrfModals } from "@/components/Modals/registerModals";
import mantinetheme from "../mantineTheme";

import {
  Gen3Provider,
  type ModalsConfig,
  registerCohortBuilderDefaultPreviewRenderers,
  RegisteredIcons,
  registerExplorerDefaultCellRenderers,
  registerMetadataSchemaApp,
  SessionConfiguration,
} from "@gen3/frontend";

import { registerCohortTableCustomCellRenderers } from "@/lib/CohortBuilder/CustomCellRenderers";
import { registerCustomExplorerDetailsPanels } from "@/lib/CohortBuilder/FileDetailsPanel";

import "../styles/globals.css";
import "../styles/survivalplot.css";
import "@fontsource/montserrat";
import "@fontsource/source-sans-pro";
import "@fontsource/poppins";

import { setDRSHostnames } from "@gen3/core";
import drsHostnames from "../../config/drsHostnames.json";
import { loadContent } from "@/lib/content/loadContent";
import Loading from "../components/Loading";
import { registerCohortComparisonApp } from "@/features/cohortComparison/registerApp";
import { registerGenesAndMutationFrequencyAnalysisTool } from "@/features/genomic/registerApp";
import Gen3GDCCompatabilityProvider from "@/utils/providers";
import { registerMMRFTableCellRenderers } from "@/components/ExplorerCellRenderers";
import MainNavigation from "@/components/Navigation/MainNavigation/MainNavigation";

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ReactDOM = require("react-dom");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const axe = require("@axe-core/react");
  axe(React, ReactDOM, 1000);
}

interface Gen3AppProps {
  icons: Array<RegisteredIcons>;
  modalsConfig: ModalsConfig;
  sessionConfig: SessionConfiguration;
}

const Gen3App = ({
  Component,
  pageProps,
  icons,
  sessionConfig,
  modalsConfig,
}: AppProps & Gen3AppProps) => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      setDRSHostnames(drsHostnames);
      registerMetadataSchemaApp();
      registerExplorerDefaultCellRenderers();
      registerCohortBuilderDefaultPreviewRenderers();
      registerCohortTableCustomCellRenderers();
      registerMMRFTableCellRenderers();
      registerCustomExplorerDetailsPanels();
      registerCohortComparisonApp();
      registerGenesAndMutationFrequencyAnalysisTool();

      isFirstRender.current = false;
    }
  }, []);

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Only on the client-side
  }, []);

  return (
    <React.Fragment>
      {isClient ? (
        <Suspense fallback={<Loading />}>
          <MantineProvider theme={mantinetheme}>
            <Gen3Provider
              icons={icons}
              sessionConfig={sessionConfig}
              modalsConfig={modalsConfig}
              contextModals={mmrfModals}
            >
              <Gen3GDCCompatabilityProvider>
                <div
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 375,
                    background: "white",
                  }}
                >
                  <MainNavigation />
                </div>
                <Component {...pageProps} />
              </Gen3GDCCompatabilityProvider>
            </Gen3Provider>
          </MantineProvider>
        </Suspense>
      ) : (
        // Show some fallback UI while waiting for the client to load
        <Loading />
      )}
    </React.Fragment>
  );
};

// TODO: replace with page router
Gen3App.getInitialProps = async (
  context: AppContext,
): Promise<Gen3AppProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context);

  try {
    const res = await loadContent();
    return {
      ...ctx,
      ...res,
    };
  } catch (error: any) {
    console.error("Provider Wrapper error loading config", error.toString());
  }
  // return default
  return {
    ...ctx,
    icons: [
      {
        prefix: "gen3",
        lastModified: 0,
        icons: {},
        width: 0,
        height: 0,
      },
    ],
    modalsConfig: {},
    sessionConfig: {},
  };
};
export default Gen3App;
