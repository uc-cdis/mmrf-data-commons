import React, { useCallback, useEffect } from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import dynamic from 'next/dynamic';
import { LoadingOverlay } from '@mantine/core';
import { SurvivalPlotTypes } from '@/features/charts/SurvivalPlot/types';
import {
  emptySurvivalPlot,
  ComparativeSurvival,
} from '@/features/genomic/types';
import { useScrollIntoView } from '@mantine/hooks';
import { SMTableContainer } from '../GenomicTables/SomaticMutationsTable/SMTableContainer';
import { useSelectFilterContent, useGeneAndSSMPanelData } from './hooks';
import { EmptyFilterSet, FilterSet } from '@gen3/core';
import { useAdvancedSmmTableDataQuery } from '@/core/genomic';
import { COHORT_FILTER_INDEX } from '@/core';
import {
  addPrefixToFilterSet,
  GenomicIndexFilterPrefixes,
  separateGeneAndSSMFilters,
} from '@/core/genomic/genomicFilters';
const SurvivalPlot = dynamic(
  () => import('../charts/SurvivalPlot/SurvivalPlot'),
  {
    ssr: false,
  },
);

interface SSMSPanelProps {
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
  searchTermsForGene: { geneId?: string; geneSymbol?: string };
  clearSearchTermsForGene: () => void;
}

export const SSMSPanel = ({
  topGeneSSMSSuccess,
  comparativeSurvival,
  handleSurvivalPlotToggled,
  handleGeneAndSSmToggled,
  searchTermsForGene,
  clearSearchTermsForGene,
}: SSMSPanelProps): JSX.Element => {
  const {
    isDemoMode,
    cohortFilters: currentCohortFilters,
    genomicFilters,
    survivalPlotData,
    overwritingDemoFilter,
    survivalPlotFetching,
    survivalPlotReady,
  } = useGeneAndSSMPanelData(comparativeSurvival, false);
  const cohortFilters =
    currentCohortFilters?.[COHORT_FILTER_INDEX] ?? EmptyFilterSet;
  /**
   * Get the mutations in cohort
   */
  const currentMutations = useSelectFilterContent('ssms.ssm_id');
  const toggledMutations = useDeepCompareMemo(
    () => currentMutations,
    [currentMutations],
  );
  const handleSsmToggled = useCallback(
    (idAndSymbol: Record<string, any>) =>
      handleGeneAndSSmToggled(
        toggledMutations,
        'gene.ssm.ssm_id',
        'mutationID',
        idAndSymbol,
      ),
    [handleGeneAndSSmToggled, toggledMutations],
  );

  /* Scroll for gene search */
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 500,
    duration: 1000,
  });

  useEffect(() => {
    // should happen only on mount
    if (searchTermsForGene) scrollIntoView();

  }, []);


  const { geneFilters, ssmFilters } = useDeepCompareMemo(() => {
    const filters = separateGeneAndSSMFilters(genomicFilters);

    const ssmFilters = addPrefixToFilterSet(
      filters.ssm,
      `${GenomicIndexFilterPrefixes.ssm.ssm}`,
    );
    const geneFilters = addPrefixToFilterSet(
      filters.gene,
      `${GenomicIndexFilterPrefixes.ssm.gene}`,
    );

    return {
      geneFilters,
      ssmFilters,
    };
  }, [genomicFilters]);

  return (
    <div className="flex flex-col" data-testid="ssms-panel">
      <div className="bg-base-max relative mb-4 border border-base-lighter p-4">
        <LoadingOverlay
          data-testid="loading-spinner"
          visible={
            survivalPlotFetching || (!survivalPlotReady && !topGeneSSMSSuccess)
          }
          zIndex={0}
        />
        <SurvivalPlot
          plotType={SurvivalPlotTypes.mutation}
          data={
            survivalPlotReady && survivalPlotData.survivalData.length > 1
              ? survivalPlotData
              : emptySurvivalPlot
          }
          names={
            survivalPlotReady && comparativeSurvival
              ? [comparativeSurvival.name]
              : []
          }
          tableTooltip
        />
      </div>
      <div ref={targetRef}>
        <SMTableContainer
          selectedSurvivalPlot={comparativeSurvival}
          handleSurvivalPlotToggled={handleSurvivalPlotToggled}
          genomicFilters={genomicFilters}
          cohortFilters={isDemoMode ? overwritingDemoFilter : cohortFilters}
          handleSsmToggled={handleSsmToggled}
          toggledSsms={toggledMutations}
          isDemoMode={isDemoMode}
          isModal={true}
          searchTermsForGene={searchTermsForGene}
          clearSearchTermsForGene={clearSearchTermsForGene}
          dataHook={useAdvancedSmmTableDataQuery}
        />
      </div>
    </div>
  );
};
