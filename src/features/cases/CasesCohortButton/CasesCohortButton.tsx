import React, { useState } from "react";
import { modals } from "@mantine/modals";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { CountsIcon } from "@/components/tailwindComponents";
import { Tooltip } from "@mantine/core";
import {
  SelectCohortsModal,
  WithOrWithoutCohortType,
} from "./SelectCohortsModal";
import { COHORT_FILTER_INDEX } from "@/core";
import { useLazyCohortCaseIdQuery } from "@/core/features/cases/caseSlice";

interface CasesCohortButtonProps {
  readonly filters: any;
  readonly numCases: number;
}

export const CasesCohortButton: React.FC<CasesCohortButtonProps> = ({
  filters,
  numCases,
}: CasesCohortButtonProps) => {
  const [openSelectCohorts, setOpenSelectCohorts] = useState(false);
  const [withOrWithoutCohort, setWithOrWithoutCohort] =
    useState<WithOrWithoutCohortType>(undefined);
  const [fetchCaseIds] = useLazyCohortCaseIdQuery();

  const openSaveCohortModal = (caseIds: ReadonlyArray<string>) => {
    const cohortFilters = {
      mode: "and",
      root: {
        "cases.case_id": {
          operator: "in",
          field: "case_id",
          operands: Array.from(caseIds),
        },
      },
    };

    modals.openContextModal({
      modal: "saveCohortModal",
      title: "Save Cohort",
      size: "md",
      zIndex: 1200,
      styles: {
        header: {
          marginLeft: "16px",
        },
      },
      innerProps: {
        filters: {
          [COHORT_FILTER_INDEX]: cohortFilters,
        },
      },
    });
  };

  // can reuse also in SelectCohortsModal right now
  const getCaseIdsFromFilter = (filter: any): ReadonlyArray<string> | null => {
    // Check if filter only contains cases.case_id
    const rootKeys = Object.keys(filter?.root || {});
    if (
      rootKeys.length === 1 &&
      rootKeys[0] === "cases.case_id" &&
      filter.root["cases.case_id"]?.operands
    ) {
      return filter.root["cases.case_id"].operands;
    }
    return null;
  };

  const handleSaveOnlySelectedCases = async () => {
    if (numCases < 1) return;

    try {
      // Check if we can extract case IDs directly
      const directCaseIds = getCaseIdsFromFilter(filters);

      if (directCaseIds) {
        // Use extracted IDs directly
        openSaveCohortModal(directCaseIds);
      } else {
        // Fetch case IDs from current filters
        const result = await fetchCaseIds({ filter: filters }).unwrap();
        openSaveCohortModal(result);
      }
    } catch (error) {
      console.error("Error fetching case IDs:", error);
    }
  };

  const dropDownIcon = (
    <DropdownWithIcon
      customTargetButtonDataTestId="button-save-new-cohort-cases-table"
      dropdownElements={[
        {
          title: "Only Selected Cases",
          onClick: handleSaveOnlySelectedCases,
        },
        {
          title: "Existing Cohort With Selected Cases",
          onClick: () => {
            setWithOrWithoutCohort("with");
            setOpenSelectCohorts(true);
          },
        },
        {
          title: "Existing Cohort Without Selected Cases",
          onClick: () => {
            setWithOrWithoutCohort("without");
            setOpenSelectCohorts(true);
          },
        },
      ]}
      TargetButtonChildren="Save New Cohort"
      targetButtonTooltip="Save a new cohort based on selection"
      disableTargetWidth={true}
      targetButtonDisabled={numCases === 0}
      menuLabelText={`${numCases.toLocaleString()}
        ${numCases > 1 ? " Cases" : " Case"}`}
      menuLabelCustomClass="bg-primary text-primary-contrast font-heading font-bold mb-2"
      LeftSection={
        numCases ? (
          <CountsIcon $count={numCases}>{numCases.toLocaleString()}</CountsIcon>
        ) : undefined
      }
      customPosition="bottom-start"
    />
  );

  return (
    <>
      <span>
        {numCases === 0 ? (
          <Tooltip label={"Save a new cohort based on selection"}>
            <span>{dropDownIcon}</span>
          </Tooltip>
        ) : (
          <span>{dropDownIcon}</span>
        )}
      </span>

      <SelectCohortsModal
        opened={openSelectCohorts}
        onClose={() => setOpenSelectCohorts(false)}
        withOrWithoutCohort={withOrWithoutCohort}
        currentFilters={filters}
        onSaveCohort={(caseIds) => {
          openSaveCohortModal(caseIds);
          setOpenSelectCohorts(false);
        }}
      />
    </>
  );
};

interface CasesCohortButtonFromFilters {
  readonly filters?: any;
  readonly numCases: number;
}

export const CasesCohortButtonFromFilters: React.FC<
  CasesCohortButtonFromFilters
> = ({ filters, numCases }: CasesCohortButtonFromFilters) => {
  return <CasesCohortButton filters={filters} numCases={numCases} />;
};
