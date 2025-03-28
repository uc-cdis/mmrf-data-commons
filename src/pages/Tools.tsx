import React from 'react';
import PageTitle from '@/components/PageTitle';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';
import { Center } from "@mantine/core";
import { AnalysisPageLayoutProps, ErrorCard, AnalysisCenterWithSections, AnalysisPageGetServerSideProps as getServerSideProps, } from "@gen3/frontend"

const Tools = ({
                 sections,
                 classNames,
               }: AnalysisPageLayoutProps) => {
  return (
    <>
      <PageTitle pageName="Analysis Center" />
      <MainNavigation />
      {!sections && (
        <Center className="mt-20">
          <ErrorCard message="No sections found in config file" />
        </Center>
      )}
      {sections && (
        <div className="m-4" >
        <AnalysisCenterWithSections
          sections={sections}
          classNames={classNames}
        />
        </div>
      )}
    </>
  );
};

export default Tools;

export { getServerSideProps };
