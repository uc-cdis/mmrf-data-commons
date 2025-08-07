import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import PageTitle from '@/components/PageTitle';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';
import {
  AnalysisCenterWithSections,
  AnalysisPageGetServerSideProps as getServerSideProps,
  AnalysisPageLayoutProps,
  AnalysisToolConfiguration,
  CohortManager,
  QueryExpression,
} from '@gen3/frontend';
import AnalysisWorkspace from '@/components/analysis/AnalysisWorkspace';
import AdditionalCohortSelection from '@/features/cohortComparison/AdditionalCohortSelection';

const Tools = ({ sections, classNames }: AnalysisPageLayoutProps) => {

  const router = useRouter();
  const {
    query: { app },
  } = router;

  const REGISTERED_APPS = useMemo(() => {

    if (sections) {
      return sections.reduce((acc: Array<AnalysisToolConfiguration>, section) => {
        return [...acc, ...section.tools];
      }, []);
    }
    return []
  }, []);
  let appInfo = app ? REGISTERED_APPS.find((a : AnalysisToolConfiguration) =>a?.appId === app) : undefined;

  if (appInfo && appInfo.appId === 'CohortComparison') {
    appInfo = { ...appInfo, selectionScreen: AdditionalCohortSelection as any} // TODO: remove this cast
  }


  return (
    <>
      <PageTitle pageName="Analysis Center" />
      <MainNavigation />
      <div className="flex flex-col ml-2">
        <CohortManager/>
        <QueryExpression index="case"/>


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
