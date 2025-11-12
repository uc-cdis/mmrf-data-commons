import React from 'react';
import PageTitle from '@/components/PageTitle';
import { SSMSSummary } from '@/features/mutationSummary/SSMSSummary';

const ssms = () => {
  return (
    <>
      <PageTitle pageName="Analysis Center" />
      <h1 className="sr-only">Mutation Summary</h1>
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
