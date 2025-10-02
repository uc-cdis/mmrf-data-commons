import React from "react";
import { DemoUtil } from '@/features/apps/DemoUtil';
import { useIsDemoApp } from '@/hooks/useIsDemoApp';
import GenesAndMutationFrequencyAnalysisTool from '@/features/genomic/GenesAndMutationFrequencyAnalysisTool';


const MutationFrequencyApp  = () => {
  const isDemoMode = useIsDemoApp();
  return (
    <>
      {isDemoMode ? (
          <DemoUtil text="Demo mode is not available for this app" />
        ) : (
        <div className="flex flex-col">
          <GenesAndMutationFrequencyAnalysisTool/>
        </div>)}
    </>
  );
};

export default MutationFrequencyApp;
