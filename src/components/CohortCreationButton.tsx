import React, { ReactNode, useEffect, useState } from 'react';
import {
  convertFilterSetToGqlFilter,
  EmptyFilterSet,
  FilterSet,
} from '@gen3/core';
import { ButtonProps, Tooltip } from "@mantine/core";
import tw from "tailwind-styled-components";
import { FaPlus as PlusIcon  } from 'react-icons/fa';
import { modals } from '@mantine/modals';

import { MAX_CASES, useLazyGetCohortCentricQuery } from '@/core';

interface CohortCreationStyledButtonProps extends ButtonProps {
  $fullWidth?: boolean;
}

export const CohortCreationStyledButton = tw.button<CohortCreationStyledButtonProps>`
  flex
  items-stretch
  w-52
  h-full
  ${(p) => !p.$fullWidth && "max-w-[125px]"}
  gap-2
  rounded
  border-primary
  border-solid
  border-1
  text-primary
  bg-base-max
  hover:text-base-max
  hover:bg-primary
  disabled:opacity-50
  disabled:bg-base-lightest
  disabled:text-primary
  disabled:border-base-light
  disabled:text-base-light
`;

export const IconWrapperTW = tw.span`
  ${(p: { $disabled: boolean }) =>
    p.$disabled ? "bg-base-light" : "bg-accent"}
  border-r-1
  border-solid
  ${(p: { $disabled: boolean }) =>
    p.$disabled ? "border-base-light" : "border-primary"}
  flex
  items-center
  p-1
`;

const updateFilters = (facetField: string, outputIds: string[]) => {
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
      facetField,
      outputIds,
      validate: false,
      setAsCurrentCohort: false,
    },
  });
};

const COHORT_CASES_QUERY = `query Case_case($filter: JSON) {
  CaseCentric_case_centric(filter: $filter, first:${MAX_CASES}) {
    case_id
  }
}`;


interface CohortCreationButtonProps {
  readonly label: ReactNode;
  readonly numCases: number;
  readonly filter: FilterSet;
  readonly caseFilter: FilterSet;
  readonly filtersCallback?: () => Promise<FilterSet>;
  readonly createStaticCohort?: boolean;
}

/**
 * Button to create a new cohort
 * @param label - the text label
 * @param numCases - the number of cases in the cohort
 * @param filters - the filters to use for the cohort
 * @property filtersCallback - callback to create filters, used when filters are too complicated for FilterSet
 * @category Buttons
 */
const CohortCreationButton: React.FC<CohortCreationButtonProps> = ({
                                                                     label,
                                                                     numCases,
                                                                     filter,
                                                                     caseFilter
}: CohortCreationButtonProps) => {
  const [loading, setLoading] = useState(false);
  const disabled = numCases === undefined || numCases === 0;
  const [ getCaseIds , { data,  isFetching, isSuccess, isError } ] = useLazyGetCohortCentricQuery();
  const tooltipText = disabled
    ? "No cases available"
    : `Save a new cohort of ${
        numCases > 1 ? `these ${numCases.toLocaleString()} cases` : "this case"
      }`;

  useEffect(() => {
    if (isSuccess) {
      const cases: Array<string> = data?.data?.CaseCentric_case_centric?.map((caseObj: { case_id: string }) => caseObj.case_id) ?? [] ;
      updateFilters("case_id", cases);
      setLoading(false);
    }
    if (isError)
      setLoading(false);

  }, [data, isFetching, isSuccess])

  const cohortFilterGql = convertFilterSetToGqlFilter(caseFilter??EmptyFilterSet);
  const filterGql = convertFilterSetToGqlFilter(filter??EmptyFilterSet);

  return (
      <div className="p-1">
        <Tooltip
          label={
            disabled ? (
              "No cases available"
            ) : (
              <>
                Save a new cohort of{" "}
                {numCases > 1 ? (
                  <>
                    these <b>{numCases.toLocaleString()}</b> cases
                  </>
                ) : (
                  "this case"
                )}
              </>
            )
          }
          withArrow
        >
        <CohortCreationStyledButton
          data-testid="button-save-filtered-cohort"
          onClick={async () => {
            if (loading) {
              return;
            }

            setLoading(true);
            getCaseIds({
              cohortFilter: cohortFilterGql,
              filter: filterGql,
              query: COHORT_CASES_QUERY,
              caseIdsFilterPath: 'case_id',
              caseIdField: 'case_id',
            });
          }}
          disabled={disabled}
          $fullWidth={React.isValidElement(label)} // if label is JSX.Element take the full width
          aria-label={tooltipText}
        >
          <IconWrapperTW $disabled={disabled} aria-hidden="true">
              <PlusIcon color="white" size={12} />
          </IconWrapperTW>
          <span className="pr-2 self-center">{label ?? "--"}</span>
        </CohortCreationStyledButton>

        </Tooltip>
      </div>
  );
};
export default CohortCreationButton;
