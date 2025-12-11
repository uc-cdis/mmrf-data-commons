import React, { useState } from "react";
import {
  FilterSet,
  GQLUnion,
  GQLIntersection,
} from "@gen3/core";
import { SetOperationEntityType } from "@/features/set-operations/types";
import { Loader, Tooltip } from "@mantine/core";
import CohortCreationButton, {
  CohortCreationStyledButton,
  IconWrapperTW,
} from "@/components/CohortCreationButton";
import { PlusIcon } from "@/utils/icons";

export const CreateFromCountButton = ({
  tooltipLabel,
  ariaLabel,
  disabled,
  handleOnClick,
  count,
  loading = false,
}: {
  tooltipLabel: string;
  ariaLabel?: string;
  disabled: boolean;
  handleOnClick: () => void;
  count: number;
  loading?: boolean;
}): JSX.Element => {
  return (
    <div className="p-1">
      <Tooltip label={tooltipLabel} withArrow>
        <span>
          <CohortCreationStyledButton
            data-testid="button-save-filtered-set"
            disabled={disabled}
            onClick={handleOnClick}
            aria-label={ariaLabel}
          >
            <IconWrapperTW $disabled={disabled}>
              <PlusIcon color="white" size={12} aria-disabled />
            </IconWrapperTW>
            <span className="w-fit">
              {loading ? (
                <Loader size="xs" />
              ) : count !== undefined ? (
                count.toLocaleString()
              ) : null}
            </span>
          </CohortCreationStyledButton>
        </span>
      </Tooltip>
    </div>
  );
};

interface CountButtonWrapperForSetProps {
  readonly count: number;
  readonly filters: GQLUnion | GQLIntersection;
  readonly entityType?: SetOperationEntityType;
}

const CountButtonWrapperForSetsAndCases: React.FC<
  CountButtonWrapperForSetProps
> = ({ count, filters, entityType }: CountButtonWrapperForSetProps) => {

  if (entityType === "cohort") {
    return (
      <CohortCreationButton
        numCases={count}
        label={count?.toLocaleString()}
        filtersCallback={createCohort}
      />
    );
  }
};
export default CountButtonWrapperForSetsAndCases;
