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

  // this is only being used for "Only Selected Cases"
  const openSaveCohortModal = (cohortFilters: any) => {
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

  const handleSaveOnlySelectedCases = () => {
    if (numCases > 1) {
      openSaveCohortModal(filters);
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
          title: " Existing Cohort With Selected Cases",
          onClick: () => {
            setWithOrWithoutCohort("with");
            setOpenSelectCohorts(true);
          },
        },
        {
          title: " Existing Cohort Without Selected Cases",
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
        pickedCases={[]}
        currentFilters={filters}
        onSaveCohort={(combinedFilters) => {
          openSaveCohortModal(combinedFilters);
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
