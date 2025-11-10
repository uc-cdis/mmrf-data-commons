import React from 'react';
import CohortInactiveIcon from 'public/icons/CohortSym_inactive.svg';
import CohortActiveIcon from 'public/icons/cohort-dna.svg';
import { GeneToggledHandler } from './types';
import SwitchSpring from '@/components/SwitchSpring/shared/SwitchSpring';
import Image from 'next/image';

const GenesTableCohort = ({
  toggledGenes,
  geneID,
  isDemoMode,
  cohort,
  handleGeneToggled,
  symbol,
}: {
  toggledGenes: readonly string[];
  geneID: string;
  isDemoMode: boolean;
  cohort: { checked: boolean };
  handleGeneToggled: GeneToggledHandler;
  symbol: string;
}): JSX.Element => {
  return (
    <SwitchSpring
      isActive={toggledGenes.includes(geneID)}
      icon={
        isDemoMode ? (
          <Image
            src={CohortInactiveIcon}
            alt="Cohort Inactive Icon"
            width={16}
            height={16}
          />
        ) : (
          <Image
            src={CohortActiveIcon}
            alt="Cohort Active Icon"
            width={16}
            height={16}
          />
        )
      }
      selected={cohort}
      handleSwitch={() =>
        handleGeneToggled({
          geneID: geneID,
          symbol: symbol,
        })
      }
      tooltip={
        isDemoMode
          ? 'Feature not available in demo mode'
          : toggledGenes.includes(geneID)
            ? `Remove ${symbol} from cohort filters`
            : `Add ${symbol} to cohort filters`
      }
      disabled={isDemoMode}
    />
  );
};

export default GenesTableCohort;
