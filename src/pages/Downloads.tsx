import React from 'react';
import {
  RepositoryPageGetServerSideProps as getServerSideProps,CohortManager, QueryExpression, CountsValue
} from '@gen3/frontend';

import PageTitle from '@/components/PageTitle';
import { Repository, RepositoryConfiguration } from '@/features/Repository';
import configuration from '@/features/apps/config/repository.json';


const DownloadsPage = () => {
  return (
    <>
      <PageTitle pageName="Gene Summary" />
      <div className="w-full flex-col flex gap-4 fixed z-10 bg-white">
        <CohortManager />
          <QueryExpression index="case"/>
      </div>
      <div className="flex">
        <div className="w-full mt-72 mr-4">
          <Repository {...configuration as unknown as RepositoryConfiguration} />
        </div>
      </div>
    </>
  );
};

export default DownloadsPage;

export { getServerSideProps };
