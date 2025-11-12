import React, { useMemo } from "react";
import { useRouter } from "next/router";
import PageTitle from "@/components/PageTitle";
import {
  AnalysisCenterWithSections,
  AnalysisPageGetServerSideProps as getServerSideProps,
  AnalysisPageLayoutProps,
  AnalysisToolConfiguration,
  CohortManager,
  QueryExpression,
  CountsValue,
  ProtectedContent,
} from "@gen3/frontend";
import {
  useLazyGetCountsQuery,
  Accessibility,
  CoreState,
  useCoreSelector,
  selectCurrentCohortId,
  selectIndexFilters,
} from "@gen3/core";
import AnalysisWorkspace from "@/components/analysis/AnalysisWorkspace";
import AdditionalCohortSelection from "@/features/cohortComparison/AdditionalCohortSelection";
import { useDeepCompareEffect } from "use-deep-compare";
import { getCustomCohortButtons } from "@/features/cohort/getCustomCohortButtons";

interface CountsPanelProps {
  index: string;
  accessibility?: Accessibility;
  indexPrefix?: string;
}

const CountsPanel: React.FC<CountsPanelProps> = ({
  index,
  accessibility = Accessibility.ALL,
  indexPrefix = "Case_",
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
      return sections.reduce(
        (acc: Array<AnalysisToolConfiguration>, section) => {
          return [...acc, ...section.tools];
        },
        [],
      );
    }
    return [];
  }, []);
  let appInfo = app
    ? REGISTERED_APPS.find((a: AnalysisToolConfiguration) => a?.appId === app)
    : undefined;

  if (appInfo && appInfo.appId === "CohortComparison") {
    appInfo = { ...appInfo, selectionScreen: AdditionalCohortSelection as any }; // TODO: remove this cast
  }

  return (
    <>
      <PageTitle pageName="Analysis Center" />
      <ProtectedContent>
        <div className="flex flex-col">
          <CohortManager
            rightPanel={<CountsPanel index="case" indexPrefix="Case_" />}
            size="md"
            customActions={getCustomCohortButtons()}
          />
          <QueryExpression index="case" />
          {appInfo ? (
            <AnalysisWorkspace appInfo={appInfo} />
          ) : sections ? (
            <div className="mx-4 mb-6 pr-[300px]">
              <AnalysisCenterWithSections
                sections={sections}
                classNames={classNames}
              />
            </div>
          ) : (
            <div className="mt-20">No sections found in config file</div>
          )}
        </div>
      </ProtectedContent>
    </>
  );
};

export default Tools;

export { getServerSideProps };
