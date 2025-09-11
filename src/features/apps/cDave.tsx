import React from "react";
import { DemoUtil } from "./DemoUtil";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import ClinicalDataAnalysis from '@/features/cDave/ClinicalDataAnalysis';

const ClinicalDataAnalysisWorkspaceApp = () => {
  const isDemoMode = useIsDemoApp();
  return (
    <>
      {isDemoMode ? (
        <DemoUtil text="Demo mode is not available for this app" />
      ) : (
        <div className="flex flex-col">
          <ClinicalDataAnalysis />
        </div>
      )}
    </>
  );
};

export default ClinicalDataAnalysisWorkspaceApp;
