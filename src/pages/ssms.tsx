import React from 'react';
import PageTitle from '@/components/PageTitle';
import { Container } from '@mantine/core';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';
import { SSMSSummary } from '@/features/mutationSummary/SSMSSummary';

const ssms = () => {
  return (
    <>
      <PageTitle pageName="Analysis Center" />
      <div className="w-full flex-col flex gap-4 fixed z-10 bg-white">
        <MainNavigation />
      </div>
      <div className="flex">
        <SSMSSummary
          ssm_id={'53af5705-a17b-555a-92e9-880ce5c14ca0'}
          isModal={false}
        />
      </div>
    </>
  );
};

export default ssms;
