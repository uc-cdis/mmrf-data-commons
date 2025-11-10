import React, { useMemo } from "react";
import { useRouter } from "next/router";
import PageTitle from "@/components/PageTitle";
import MainNavigation from "@/components/Navigation/MainNavigation/MainNavigation";
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
import { Button, Tooltip } from "@mantine/core";
import { UploadIcon } from "@/utils/icons";
import { modals } from "@mantine/modals";

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

  const rand = () => {};

  const handleImport = () => {
    modals.openContextModal({
      modal: "filterByUserInputModal",
      title: "Import a New Cohort",
      size: "xl",
      innerProps: {
        userInputProps: {
          inputInstructions:
            "Enter one or more case identifiers in the field below or upload a file to import a new cohort.",
          textInputPlaceholder:
            "e.g. TCGA-DD-AAVP, TCGA-DD-AAVP-10A-01D-A40U-10, 0004d251-3f70-4395-b175-c94c2f5b1b81",
          entityType: "cases",
          entityLabel: "case",
          identifierToolTip: (
            <div>
              <p>
                - Case identifiers accepted: Case UUID, Case ID, Sample UUID,
                Sample ID, Portion UUID, Portion ID,
                <p>
                  Slide UUID, Slide ID, Analyte UUID, Analyte ID, Aliquot UUID,
                  Aliquot ID
                </p>
              </p>
              <p>
                - Delimiters between case identifiers: comma, space, tab or 1
                case identifier per line
              </p>
              <p>- File formats accepted: .txt, .csv, .tsv</p>{" "}
            </div>
          ),
        },
        rand,
        type: "cases",
      },
    });
  };

  const customButtons = [
    <Tooltip label="Import Cohort" position="bottom" withArrow key="import">
      <Button
        size="compact-md"
        data-testid="uploadButton"
        aria-label="Upload cohort"
        variant="action"
        onClick={handleImport}
      >
        <UploadIcon size="1.5em" aria-hidden="true" />
      </Button>
    </Tooltip>,
  ];

  return (
    <>
      <PageTitle pageName="Analysis Center" />
      <MainNavigation />
      <ProtectedContent>
        <div className="flex flex-col ml-2">
          <CohortManager
            rightPanel={<CountsPanel index="case" indexPrefix="Case_" />}
            size="md"
            customActions={customButtons}
          />
          <QueryExpression index="case" />

          {appInfo ? (
            <AnalysisWorkspace appInfo={appInfo} />
          ) : sections ? (
            <div className="ml-2 pr-[300px]">
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
