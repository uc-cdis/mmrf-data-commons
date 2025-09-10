import React from "react";
import{ Repository, RepositoryConfiguration } from '@/features/Repository';
import configuration from './config/repository.json';
import { DemoUtil } from '@/features/apps/DemoUtil';
import { useIsDemoApp } from '@/hooks/useIsDemoApp';


const RepositoryApp = () => {
  const isDemoMode = useIsDemoApp();
  return (
    <>
      {isDemoMode ? (
          <DemoUtil text="Demo mode is not available for this app" />
        ) : (
        <div className="flex flex-col">
          <Repository {...configuration as unknown as RepositoryConfiguration} />
        </div>)}
    </>
  );
};

export default RepositoryApp;
