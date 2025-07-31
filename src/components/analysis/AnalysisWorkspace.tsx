import React from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { ApplicationWorkspace } from '@/components/analysis/index';
import { AnalysisToolConfiguration } from '@gen3/frontend';

const ActiveAnalysisToolNoSSR = dynamic(
  () => import("./ActiveAnalysisTool"),
  {
    ssr: false,
  },
);

interface AnalysisWorkspaceProps {
  readonly appInfo: AnalysisToolConfiguration;
}

const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  appInfo
}: AnalysisWorkspaceProps) => {
  const router = useRouter();
  const isDemoMode = useIsDemoApp();

  const skipSelectionScreen =
    router?.query?.skipSelectionScreen === "true" || isDemoMode;

  const handleAppSelected = (app: string | undefined, demoMode?: boolean) => {
    router.push({ query: { app, ...(demoMode && { demoMode }) } });
  };

  return (
    <ApplicationWorkspace
      appInfo={appInfo}
      isDemoMode={isDemoMode}
      ActiveAnalysisTool={ActiveAnalysisToolNoSSR}
      skipSelectionScreen={skipSelectionScreen}
      handleAppSelected={handleAppSelected}
    />
  );
};

export default AnalysisWorkspace;
