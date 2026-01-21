import React from "react";
import{ Repository, RepositoryConfiguration } from '@/features/Repository';
import configuration from './config/repository.json';
import { DemoUtil } from '@/features/apps/DemoUtil';
import { useIsDemoApp } from '@/hooks/useIsDemoApp';
import { FilterSet } from '@gen3/core';


const RepositoryApp = ({ cohortFilter} : { cohortFilter?: FilterSet }) => {
  const isDemoMode = useIsDemoApp();
  console.log(cohortFilter);
  return (
    <>
      {isDemoMode ? (
          <DemoUtil text="Demo mode is not available for this app" />
        ) : (
        <div className="flex flex-col">
          <Repository {...configuration as unknown as RepositoryConfiguration} cohortFilter={cohortFilter}/>
        </div>)}
    </>
  );
};

export default RepositoryApp;
