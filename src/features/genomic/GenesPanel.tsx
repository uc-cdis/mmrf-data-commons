import { LoadingOverlay } from '@mantine/core';
// import { GeneFrequencyChart } from "@/features/charts/GeneFrequencyChart";
import { SurvivalPlotTypes } from '@/features/charts/SurvivalPlot/types';
import React, { useCallback } from 'react';
import { useDeepCompareEffect, useDeepCompareMemo } from 'use-deep-compare';
import {
  ComparativeSurvival,
  emptySurvivalPlot,
} from '@/features/genomic/types';
import {
  useSelectFilterContent,
  useGeneAndSSMPanelData,
} from './hooks';

import dynamic from 'next/dynamic';
import { GeneFrequencyChart } from '../charts/GeneFrequencyChart';
import { GenesTableContainer } from '../GenomicTables/GenesTable/GenesTableContainer';
import { EmptyFilterSet, FilterSet } from '@gen3/core';
import { useGeneFrequencyChartQuery } from '../../core/genomic/genesFrequencyChartSlice';
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

const GENE_FILTERS = ['biotype', "is_gene_cancer_census"];

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
  const cohortFilters = currentCohortFilters?.[COHORT_FILTER_INDEX] ?? EmptyFilterSet;

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

  // extract geneFilters from genomicFilters
  const geneFilters : FilterSet= {
    mode: 'and',
    root: Object.fromEntries(
      Object.entries(genomicFilters?.root || {}).filter(([key]) =>
        GENE_FILTERS.includes(key),
      ),
    ),
  };

  const ssmFilters : FilterSet= {
    mode: 'and',
    root: Object.fromEntries(
      Object.entries(genomicFilters?.root || {}).filter(
        ([key]) => !GENE_FILTERS.includes(key),
      ),
    ),
  };


  // const queryParams = useDeepCompareMemo(
  //   () => ({
  //     pageSize: 10000,
  //     offset: 0,
  //     geneFilters,
  //     ssmFilters,
  //     cohortFilters,
  //   }),
  //   [geneFilters,ssmFilters, cohortFilters],
  // );

  /**
   * Different that MMRF as we are querying the whole table and not just the top 20 genes. The
   * query data is used for the table and the chart.
   */
  console.log("geneFilters", geneFilters);
  const { data: topGenesData, isFetching, isSuccess, isError, isUninitialized, isLoading } = useGeneFrequencyChartQuery(
    {
      cohortFilters,
      geneFilters,
      ssmFilters,
    }
  );

  useDeepCompareEffect(() => {
     if (topGenesData && topGenesData.genes.length > 0 && comparativeSurvival?.symbol !==  topGenesData.genes[0].symbol) {
      handleSurvivalPlotToggled(
        topGenesData?.genes[0].symbol,
        topGenesData?.genes[0].symbol,
        'gene.symbol',
       );
     }
  }, [topGenesData]);

  return (
    <div className="flex flex-col" data-testid="genes-panel">
      <div className="flex flex-col gap-6 xl:gap-8 xl:flex-row bg-base-max mb-4">
        <div className="w-full xl:w-1/2 border border-base-lighter p-4">
          <GeneFrequencyChart
            chartData={topGenesData ? { genes: topGenesData?.genes.slice(0, 20), filteredCases: topGenesData?.filteredCases, genesTotal: topGenesData?.genesTotal, cnvCases: topGenesData?.cnvCases

            } : undefined}
            isFetching={isFetching}
            isError={isError}
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
              (!survivalPlotReady && !isSuccess)
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
        isFetching={isFetching || isLoading || isUninitialized}
        isError={isError}
        isSuccess={isSuccess}
        data={ topGenesData ? { ...topGenesData, cases: 995, mutationCounts: {} }: {
          genes: [],
          filteredCases: 0,
          genesTotal: 0,
          cases: 0,
          mutationCounts: {}
        }}
      />
    </div>
  );
};
