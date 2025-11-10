import React, { ReactElement } from "react";
import CohortInactiveIcon from "public/icons/CohortSym_inactive.svg";
import CohortActiveIcon from "public/icons/cohort-dna.svg";
import { SsmToggledHandler } from "../types";
import SwitchSpring from "@/components/SwitchSpring/shared/SwitchSpring";
import Image from 'next/image';

const SMTableCohort = ({
  isToggledSsm,
  mutationID,
  isDemoMode,
  cohort,
  handleSsmToggled,
  DNAChange,
}: {
  isToggledSsm: boolean;
  mutationID: string;
  isDemoMode: boolean;
  cohort: {
    checked: boolean;
  };
  handleSsmToggled: SsmToggledHandler;
  DNAChange: string;
}): ReactElement => {

  return (
    <SwitchSpring
      isActive={isToggledSsm}
      icon={
        isDemoMode ? (
          <Image
            src={CohortInactiveIcon}
            alt="Cohort Active Icon"
            width={16}
            height={16}
            aria-label="inactive cohort icon"
          />
        ) : (
          <Image
            src={CohortActiveIcon}
            alt="Cohort Active Icon"
            width={16}
            height={16}
            aria-label="active cohort icon"
          />
        )
      }
      selected={cohort}
      handleSwitch={() => {
        handleSsmToggled({
          mutationID: mutationID,
          symbol: DNAChange,
        });
      }}
      tooltip={
        isDemoMode
          ? "Feature not available in demo mode"
          : isToggledSsm
            ? `Remove ${DNAChange} from cohort filters`
            : `Add ${DNAChange} to cohort filters`
      }
      disabled={isDemoMode}
    />
  );
}

export default SMTableCohort;
