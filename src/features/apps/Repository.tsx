import React from "react";
import{ Repository, RepositoryConfiguration } from '@/features/Repository';
import configuration from './config/repository.json';


const RepositoryApp = () => {

  return (
    <>
        <div className="flex flex-col">
          <Repository {...configuration as unknown as RepositoryConfiguration} />
        </div>
    </>
  );
};

export default RepositoryApp;
