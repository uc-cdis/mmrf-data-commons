import React from 'react';
import PageTitle from '@/components/PageTitle';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';
import { Button, Center } from '@mantine/core';
import {
  AnalysisPageLayoutProps,
  ErrorCard,
  AnalysisCenterWithSections,
  AnalysisPageGetServerSideProps as getServerSideProps,
  CohortManager, QueryExpression,
} from '@gen3/frontend';
import { openModal } from '@/components/modals/openers';



const Tools = ({ sections, classNames }: AnalysisPageLayoutProps) => {
  return (
    <>
      <PageTitle pageName="Analysis Center" />
      <MainNavigation />
      <Button onClick={
        () => openModal()

      }>NoLogin</Button>
      {!sections && (
        <Center className="mt-20">
          <ErrorCard message="No sections found in config file" />
        </Center>
      )}
      {sections && (
        <div className="flex flex-col ml-2">
          <CohortManager />
          <QueryExpression index="cases"/>
          <div className="ml-2 pr-[300px]">
            <AnalysisCenterWithSections
              sections={sections}
              classNames={classNames}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Tools;

export { getServerSideProps };
