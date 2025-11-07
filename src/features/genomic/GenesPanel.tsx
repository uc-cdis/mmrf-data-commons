import { LoadingOverlay } from '@mantine/core';

import { SurvivalPlotTypes } from '@/features/charts/SurvivalPlot/types';
import React, { useCallback } from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import {
  ComparativeSurvival,
  emptySurvivalPlot,
} from '@/features/genomic/types';
import { useGeneAndSSMPanelData, useSelectFilterContent } from './hooks';
import dynamic from 'next/dynamic';
import { GeneFrequencyChart } from '../charts/GeneFrequencyChart';
import { GenesTableContainer } from '../GenomicTables/GenesTable/GenesTableContainer';
import { EmptyFilterSet } from '@gen3/core';
import { COHORT_FILTER_INDEX } from '@/core';

const SurvivalPlot = dynamic(
  () => import('../charts/SurvivalPlot/SurvivalPlot'),
  {
    ssr: false,
  },
);

interface GenesPanelProps {
  topGeneSSMSSuccess: boolean;
  comparativeSurvival: ComparativeSurvival;
  handleSurvivalPlotToggled: (
    symbol: string,
    name: string,
    field: string,
  ) => void;
  handleGeneAndSSmToggled: (
    cohortStatus: string[],
    field: string,
    idField: string,
    payload: Record<string, any>,
  ) => void;
  handleMutationCountClick: (geneId: string, geneSymbol: string) => void;
}

export const GenesPanel = ({
  topGeneSSMSSuccess,
  comparativeSurvival,
  handleSurvivalPlotToggled,
  handleGeneAndSSmToggled,
  handleMutationCountClick,
}: GenesPanelProps): JSX.Element => {
  const {
    isDemoMode,
    cohortFilters: currentCohortFilters,
    genomicFilters,
    overwritingDemoFilter,
    survivalPlotData,
    survivalPlotFetching,
    survivalPlotReady,
  } = useGeneAndSSMPanelData(comparativeSurvival, true);
  const cohortFilters =
    currentCohortFilters?.[COHORT_FILTER_INDEX] ?? EmptyFilterSet;

  const currentGenes = useSelectFilterContent('genes.gene_id');
  const toggledGenes = useDeepCompareMemo(() => currentGenes, [currentGenes]);
  const handleGeneToggled = useCallback(
    (idAndSymbol: Record<string, any>) =>
      handleGeneAndSSmToggled(
        toggledGenes,
        'gene.gene_id',
        'geneID',
        idAndSymbol,
      ),
    [handleGeneAndSSmToggled, toggledGenes],
  );

  return (
    <div className="flex flex-col" data-testid="genes-panel">
      <div className="flex flex-col gap-6 xl:gap-8 xl:flex-row bg-base-max mb-4">
        <div className="w-full xl:w-1/2 border border-base-lighter p-4">
          <GeneFrequencyChart
            marginBottom={95}
            genomicFilters={genomicFilters}
            cohortFilters={isDemoMode ? overwritingDemoFilter : cohortFilters}
          />
        </div>
        <div className="w-full xl:w-1/2 relative border border-base-lighter p-4">
          <LoadingOverlay
            zIndex={0}
            data-testid="loading-spinner"
            visible={
              survivalPlotFetching ||
              (!survivalPlotReady && !topGeneSSMSSuccess)
            }
          />
          <SurvivalPlot
            plotType={SurvivalPlotTypes.gene}
            data={
              survivalPlotReady && survivalPlotData.survivalData.length > 1
                ? survivalPlotData
                : emptySurvivalPlot
            }
            names={
              survivalPlotReady && comparativeSurvival
                ? [comparativeSurvival.symbol]
                : []
            }
            field="gene.symbol"
            tableTooltip
          />
        </div>
      </div>
      <GenesTableContainer
        selectedSurvivalPlot={comparativeSurvival}
        handleSurvivalPlotToggled={handleSurvivalPlotToggled}
        handleGeneToggled={handleGeneToggled}
        toggledGenes={toggledGenes}
        genomicFilters={genomicFilters}
        cohortFilters={isDemoMode ? overwritingDemoFilter : cohortFilters}
        isDemoMode={isDemoMode}
        handleMutationCountClick={handleMutationCountClick}
      />
    </div>
  );
};
