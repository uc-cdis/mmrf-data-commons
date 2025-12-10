import React, { useRef } from "react";
import { ProjectDefaults } from "@/core";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import CategoryTableSummary from "@/components/Summary/CategoryTableSummary";
import { HeaderTitle } from "@/components/tailwindComponents";
import { HorizontalTable } from "@/components/HorizontalTable";
import { SingularOrPluralSpan } from "@/components/SingularOrPluralSpan/SingularOrPluralSpan";
import {
  formatDataForDataCategoryTable,
  formatDataForExpCategoryTable,
  formatDataForSummary,
} from "./utils";
import { useViewportSize } from "@mantine/hooks";
import { LG_BREAKPOINT } from "src/utils";
import SummaryHeaderControls from "./SummaryHeaderControls";
import { useSynchronizedRowHeights } from "@/components/HorizontalTable/useSynchronizedRowHeights";
import { FileIcon, PersonIcon } from "@/utils/icons";

export interface ProjectViewProps extends ProjectDefaults {
  hasControlledAccess: boolean;
  isModal?: boolean;
}

export const ProjectView: React.FC<ProjectViewProps> = (
  projectData: ProjectViewProps,
) => {
  const { width } = useViewportSize();
  const leftSummaryTableRef = useRef<HTMLTableElement|null>(null);
  const rightSummaryTableRef = useRef<HTMLTableElement|null>(null);
  useSynchronizedRowHeights([leftSummaryTableRef, rightSummaryTableRef]);

  const Cases = (
    <span className="flex items-center gap-1">
      <PersonIcon size="1.2em" />

      <SingularOrPluralSpan
        customDataTestID="text-case-count-project-summary"
        count={projectData.summary?.case_count ?? 0}
        title="Case"
      />
    </span>
  );

  const Files = (
    <span className="flex items-center gap-1">
      <FileIcon />

      <SingularOrPluralSpan
        customDataTestID="text-file-count-project-summary"
        count={projectData.summary?.file_count ?? 0}
        title="File"
      />
    </span>
  );

  const message = projectData.hasControlledAccess ? (
    <p className="font-content">
      The project has controlled access data which requires dbGaP Access. See
      instructions for{" "}
      <a
        data-testid="link-obtaining-access-to-controlled-data"
        href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data"
        className="text-utility-link underline"
        target="_blank"
        rel="noreferrer"
      >
        Obtaining Access to Controlled Data.
      </a>
    </p>
  ) : null;

  const summaryData = formatDataForSummary(projectData);
  const [leftColumnData, rightColumnData] = [
    summaryData.slice(0, summaryData.length === 4 ? 2 : 3),
    summaryData.slice(summaryData.length === 4 ? 2 : 3),
  ];

  return (
    <>
      <SummaryHeader
        iconPath="/icons/user.svg"
        headerTitleLeft="Project"
        headerTitle={projectData.project_id}
        isModal={projectData.isModal}
        leftElement={<SummaryHeaderControls projectData={projectData} />}
        rightElement={
          <div className="flex items-center gap-2 text-sm md:text-xl xl:text-sm 2xl:text-xl text-base-lightest leading-4 font-montserrat uppercase whitespace-no-wrap">
            Total of {Cases} {Files}
          </div>
        }
      />

      <div className={`${!projectData?.isModal ? "mt-6" : "mt-4"} mx-4`}>
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <HeaderTitle>Summary</HeaderTitle>
          {message && <div className="text-sm lg:text-right">{message}</div>}
        </div>
        <div data-testid="table-summary-project-summary" className="flex mt-2">
          <div className="basis-full lg:basis-1/2">
            <HorizontalTable
              tableData={width >= LG_BREAKPOINT ? leftColumnData : summaryData}
              ref={leftSummaryTableRef}
              enableSync={true}
            />
          </div>
          {width >= LG_BREAKPOINT && (
            <div className="basis-1/2 h-full">
              <HorizontalTable
                tableData={rightColumnData}
                ref={rightSummaryTableRef}
                enableSync={true}
              />
            </div>
          )}
        </div>

        {(projectData?.summary?.data_categories ||
          projectData?.summary?.experimental_strategies) && (
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            {projectData?.summary?.data_categories && (
              <CategoryTableSummary
                customDataTestID="table-data-category-project-summary"
                title="Cases and File Counts by Data Category"
                {...formatDataForDataCategoryTable(projectData)}
              />
            )}
            {projectData?.summary?.experimental_strategies && (
              <CategoryTableSummary
                customDataTestID="table-experimental-strategy-project-summary"
                title="Cases and File Counts by Experimental Strategy"
                {...formatDataForExpCategoryTable(projectData)}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};
