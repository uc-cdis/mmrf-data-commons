
import React from 'react';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic'
import {
  NavPageLayoutProps, CohortManager,
  getNavPageLayoutPropsFromConfig,
} from '@gen3/frontend';

import PageTitle from '@/components/PageTitle';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';


const ClinicalDataAnalysis = dynamic(() => import('@/features/cDave/ClinicalDataAnalysis'), {
  ssr: false
})

export interface ClinicalDataAnalysisPageProps extends NavPageLayoutProps {
  title: "cDave"
}

const ClinicalDataAnalysisPage = ({
}: ClinicalDataAnalysisPageProps) => {
  return (
    <>
      <PageTitle pageName="Clinical Data Analysis" />
      <div className="w-full flex-col flex gap-4 fixed z-50 bg-white">
        <MainNavigation />
        <CohortManager index={"case"}></CohortManager>
      </div>
      <div className="flex">
        <div className="w-full mt-72 mr-4">
         <ClinicalDataAnalysis />
        </div>
      </div>
    </>
  );
};

export default ClinicalDataAnalysisPage;

// TODO: replace this with a custom getServerSideProps function
export const getServerSideProps: GetServerSideProps<
  NavPageLayoutProps
> = async () => {
  return {
    props: {
      ...(await getNavPageLayoutPropsFromConfig()),
    },
  };
};
