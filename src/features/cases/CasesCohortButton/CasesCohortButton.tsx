import React, { useState } from "react";
import { modals } from "@mantine/modals";
import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { CountsIcon } from "@/components/tailwindComponents";
import { LoadingOverlay, Tooltip } from "@mantine/core";
import {
  SelectCohortsModal,
  WithOrWithoutCohortType,
} from "./SelectCohortsModal";
import { COHORT_FILTER_INDEX } from "@/core";
import { useLazyCohortCaseIdQuery } from "@/core/features/cases/caseSlice";
import { EmptyFilterSet, FilterSet } from '@gen3/core';

interface CasesCohortButtonProps {
  readonly filters: FilterSet;
  readonly numCases: number;
  readonly asFilterRepresentation?: boolean; // set to true to use the cohort filter instead of case ids
}

const openModalWithCohortFilterRepresentation = (cohortFilters: FilterSet) => {
  modals.openContextModal({
    modal: 'saveCohortModal',
    title: 'Save Cohort',
    size: 'md',
    zIndex: 1200,
    styles: {
      header: {
        marginLeft: '16px',
      },
    },
    innerProps: {
      filters: {
        [COHORT_FILTER_INDEX]: cohortFilters,
      },
    },
  });
}

const openSaveCohortModal = (caseIds: ReadonlyArray<string>) => {
  const cohortFilters : FilterSet = {
    mode: 'and',
    root: {
      case_id: {
        operator: 'in',
        field: 'case_id',
        operands: Array.from(caseIds ?? []),
      },
    },
  };

  openModalWithCohortFilterRepresentation(cohortFilters);
};

export const CasesCohortButton: React.FC<CasesCohortButtonProps> = ({
  filters,
  numCases,
  asFilterRepresentation = false,
}: CasesCohortButtonProps) => {
  const [openSelectCohorts, setOpenSelectCohorts] = useState(false);
  const [withOrWithoutCohort, setWithOrWithoutCohort] =
    useState<WithOrWithoutCohortType>(undefined);
  // TODO: To save a cohort as filters remove this and pass the filters directly to the modal
  const [fetchCaseIds, { isFetching }] = useLazyCohortCaseIdQuery();



  // can reuse also in SelectCohortsModal right now
  const getCaseIdsFromFilter = (filter: any): ReadonlyArray<string> | null => {
    // Check if filter only contains cases.case_id
    const rootKeys = Object.keys(filter?.root || {});
    if (
      rootKeys.length === 1 &&
      rootKeys[0] === 'cases.case_id' &&
      filter.root['cases.case_id']?.operands
    ) {
      return filter.root['cases.case_id'].operands;
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
        if (asFilterRepresentation) {
          openModalWithCohortFilterRepresentation(filters);
        } else {
          // Fetch case IDs from current filters
          const result = await fetchCaseIds({ filter: filters }).unwrap();
          openSaveCohortModal(result);
        }
      }
    } catch (error) {
      console.error('Error fetching case IDs:', error);
    }
  };

  const dropDownIcon = (
    <DropdownWithIcon
      customTargetButtonDataTestId="button-save-new-cohort-cases-table"
      dropdownElements={[
        {
          title: 'Only Selected Cases',
          onClick: handleSaveOnlySelectedCases,
        },
        {
          title: 'Existing Cohort With Selected Cases',
          onClick: () => {
            setWithOrWithoutCohort('with');
            setOpenSelectCohorts(true);
          },
        },
        {
          title: 'Existing Cohort Without Selected Cases',
          onClick: () => {
            setWithOrWithoutCohort('without');
            setOpenSelectCohorts(true);
          },
        },
      ]}
      TargetButtonChildren="Save New Cohort"
      targetButtonTooltip="Save a new cohort based on selection"
      disableTargetWidth={true}
      targetButtonDisabled={numCases === 0}
      menuLabelText={`${numCases.toLocaleString()}
        ${numCases > 1 ? ' Cases' : ' Case'}`}
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
      <LoadingOverlay visible={isFetching} />
      <span>
        {numCases === 0 ? (
          <Tooltip label={'Save a new cohort based on selection'}>
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
  readonly filters?: FilterSet;
  readonly numCases: number;
  asFilterRepresentation?: boolean;
}

export const CasesCohortButtonFromFilters: React.FC<CasesCohortButtonFromFilters> = ({
  filters,
  numCases,
  asFilterRepresentation = false,
}: CasesCohortButtonFromFilters) => {
  return (
    <CasesCohortButton
      filters={filters ?? EmptyFilterSet}
      numCases={numCases}
      asFilterRepresentation={asFilterRepresentation}
    />
  );
};
