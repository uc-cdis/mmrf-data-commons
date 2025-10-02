import React, { Suspense, lazy, useEffect, useState, ReactNode } from 'react';
import { Loader } from "@mantine/core";
import { selectGen3AppByName, useCoreSelector } from '@gen3/core';

const importApplication = async (app : any) =>
  lazy(() =>
    import(`@/features/apps/${app}`).catch(
      () => import(`@/features/apps/NullApp`),
    ),
  );

export interface AnalysisToolInfo {
  readonly appId: string;
}

const ActiveAnalysisTool: React.FC<AnalysisToolInfo> = ({
  appId,
}: AnalysisToolInfo) => {
  const [analysisApp, setAnalysisApp] = useState<ReactNode | null>(null);

  const Gen3App = useCoreSelector(
    () => selectGen3AppByName(appId), // TODO update ById to ByName
  ) as React.ElementType;
  useEffect(() => {
    async function loadApp() {
      const AnalysisApp = Gen3App ?? await importApplication(appId);
      return <AnalysisApp />;
    }

    loadApp().then((app) => setAnalysisApp(app));
  }, [appId]);

  console.log('appId', appId);

  return (
    <Suspense
      fallback={
        <div className="flex flex-row items-center justify-center w-100 h-96">
          <Loader size={100} />
        </div>
      }
    >
      <div>{analysisApp}</div>
    </Suspense>
  );
};

export default ActiveAnalysisTool;
