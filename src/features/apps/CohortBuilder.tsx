import React from "react";
import { DemoUtil } from "./DemoUtil";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { TabbedCohortBuilder, TabbedCohortBuilderConfiguration } from '@gen3/frontend';
import config from './config/tabbedCohortBuilder.json';

const CohortBuilderApp = () => {
  const isDemoMode = useIsDemoApp();
  return (
    <>
      {isDemoMode ? (
        <DemoUtil text="Demo mode is not available for this app" />
      ) : (
        <div className="flex flex-col">
          <TabbedCohortBuilder {...config as unknown as TabbedCohortBuilderConfiguration} />
        </div>
      )}
    </>
  );
};

export default CohortBuilderApp;
