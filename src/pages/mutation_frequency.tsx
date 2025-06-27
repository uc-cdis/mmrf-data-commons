import React from 'react';
import PageTitle from '@/components/PageTitle';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';
import GenesAndMutationFrequencyAnalysisTool from '@/features/genomic/GenesAndMutationFrequencyAnalysisTool';

const mutation_frequency = () => {
  return (
    <>
      <PageTitle pageName="Analysis Center" />
      <div className="w-full flex-col flex gap-4 fixed z-10 bg-white">
        <MainNavigation />
      </div>
      <h1 className="sr-only">Mutation Frequency</h1>
      <div className="flex">
        <GenesAndMutationFrequencyAnalysisTool />
      </div>
    </>
  );
};

export default mutation_frequency;
