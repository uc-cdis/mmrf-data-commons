import React from "react";
import { DemoUtil } from "./DemoUtil";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import CohortComparisonApp from '@/features/cohortComparison/CohortComparisonApp';

const CohortComparisonWorkspaceApp = () => {
  const isDemoMode = useIsDemoApp();
  return (
    <>
      {isDemoMode ? (
        <DemoUtil text="Demo mode is not available for this app" />
      ) : (
        <div className="flex flex-col">
          <CohortComparisonApp />
        </div>
      )}
    </>
  );
};

export default CohortComparisonWorkspaceApp;
