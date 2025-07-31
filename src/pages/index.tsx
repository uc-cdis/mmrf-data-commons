import React, { useMemo} from 'react';
import { useRouter } from "next/router";
import PageTitle from '@/components/PageTitle';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';
import { Center } from '@mantine/core';
import {
  AnalysisPageLayoutProps,
  ErrorCard,
  AnalysisCenterWithSections,
  AnalysisPageGetServerSideProps as getServerSideProps,
  CohortManager, QueryExpression,
  AnalysisToolConfiguration
} from '@gen3/frontend';
import AnalysisWorkspace from '@/components/analysis/AnalysisWorkspace';

const Tools = ({ sections, classNames }: AnalysisPageLayoutProps) => {

  const router = useRouter();
  const {
    query: { app },
  } = router;

  const REGISTERED_APPS = useMemo(() => {

    if (sections) {
      const a = sections.reduce((acc: Array<AnalysisToolConfiguration>, section) => {
        return [...acc, ...section.tools];
      }, [])
      return a;
    }
    return []
  }, []);

  console.log(REGISTERED_APPS);
  console.log(app);

  const appInfo = app ? REGISTERED_APPS.find((a : AnalysisToolConfiguration) =>a?.appId === app) : undefined;

  console.log("appInfo",appInfo);
  return (
    <>
      <PageTitle pageName="Analysis Center" />
      <MainNavigation />
      <div className="flex flex-col ml-2">
        <CohortManager/>
        <QueryExpression index="cases"/>


      {appInfo ?
        <AnalysisWorkspace  appInfo={appInfo} />
      : sections ?  (

          <div className="ml-2 pr-[300px]">
            <AnalysisCenterWithSections
              sections={sections}
              classNames={classNames}
            />
          </div>
      ) : <div className="mt-20">No sections found in config file</div>}
        </div>
    </>);

};

export default Tools;

export { getServerSideProps };
