import React from 'react';
import PageTitle from '@/components/PageTitle';
import { Container } from '@mantine/core';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';
import { SSMSSummary } from '@/features/mutationSummary/SSMSSummary';

const ssms = () => {
  return (
    <>
      <PageTitle pageName="Analysis Center" />
      <MainNavigation />

      <Container className="flex justify-center align-middle h-[300px] p-12">
        <SSMSSummary
          ssm_id={'53af5705-a17b-555a-92e9-880ce5c14ca0'}
          isModal={false}
        />
      </Container>
    </>
  );
};

export default ssms;
