import {
  NavPageLayoutProps,
  TabbedCohortBuilderConfiguration,
  TabbedCohortBuilder,
  TabbedCohortBuilderPageGetServerSideProps as getServerSideProps, CohortManager,
} from '@gen3/frontend';
import PageTitle from '@/components/PageTitle';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';
import React from 'react';

export interface TabbedCohortBuilderPageProps extends NavPageLayoutProps {
  configuration: TabbedCohortBuilderConfiguration;
}

const TabbedCohortBuilderPage = ({
  configuration,
}: TabbedCohortBuilderPageProps) => {
  return (
    <>
      <PageTitle pageName="Gene Summary" />
      <div className="w-full flex-col flex gap-4 fixed z-10 bg-white">
        <MainNavigation />
        <CohortManager index="cases"></CohortManager>
      </div>
      <div className="flex">
        <div className="w-full mt-72 mr-4">
          <TabbedCohortBuilder {...configuration} />
        </div>
      </div>
    </>
  );
};

export default TabbedCohortBuilderPage;

export { getServerSideProps };
