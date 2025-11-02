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
  QueryExpression,CountsValue, ProtectedContent
} from '@gen3/frontend';
import {
  useLazyGetCountsQuery,
  Accessibility,
  CoreState,
  useCoreSelector,
  selectCurrentCohortId,
  selectIndexFilters
} from '@gen3/core';
import AnalysisWorkspace from '@/components/analysis/AnalysisWorkspace';
import AdditionalCohortSelection from '@/features/cohortComparison/AdditionalCohortSelection';


import { useDeepCompareEffect } from 'use-deep-compare';

interface CountsPanelProps {
  index: string;
  accessibility?: Accessibility;
  indexPrefix?: string;
}

const CountsPanel: React.FC<CountsPanelProps> = ({
                                                   index,
                                                   accessibility = Accessibility.ALL,
                                                   indexPrefix = "Case_"
                                                 }: CountsPanelProps) => {
  const [getCounts, { data: counts, isFetching, isError, isSuccess }] =
    useLazyGetCountsQuery();
  const currentCohortId = useCoreSelector((state: CoreState) =>
    selectCurrentCohortId(state),
  );
  const cohortFilters = useCoreSelector((state: CoreState) =>
    selectIndexFilters(state, index),
  );

  useDeepCompareEffect(() => {
    getCounts({
      type: index,
      filters: cohortFilters,
      accessibility: accessibility,
      queryId: currentCohortId,
      indexPrefix: indexPrefix,
    });
  }, [cohortFilters, currentCohortId, accessibility]);

  return (
      <CountsValue
        label="Case"
        counts={counts}
        isFetching={isFetching}
        isError={isError}
      />
  );
};


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
      { /*
      <ProtectedContent>
      */ }
      <div className="flex flex-col ml-2">
        <CohortManager rightPanel={<CountsPanel index="case_centric"  indexPrefix="CaseCentric_" />}/>
        <QueryExpression index="case_centric"/>


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
      { /*
      </ProtectedContent>
      */ }
    </>);

};

export default Tools;

export { getServerSideProps };
