import { ComparativeSurvival  } from '@/features/genomic/types';
import { FilterSet } from '@gen3/core';
import type { Survival } from '@/core/survival';

export interface GeneAndSSMPanelData {
  isDemoMode: boolean;
  genomicFilters: FilterSet;
  currentCohortFilters: FilterSet;
  overwritingDemoFilter: FilterSet;
  survivalPlotData: Survival;
  survivalPlotFetching: boolean;
  survivalPlotReady: boolean;
}

import GeneAndSSMFilters from './data/useGeneAndSSMPanel_data.json';
import GeneFrequencyChartData from './data/useGeneFrequencyChart_data.json';
import GenesTableData from './data/useGenesTable_data.json';
// for all of the MMRF Gene use this one
//import GenesTableData from './data/useGenesTable_data_all.json';

export const useGeneAndSSMPanelData = (
  comparativeSurvival: ComparativeSurvival,
  isGene: boolean,
): GeneAndSSMPanelData =>  {

  return GeneAndSSMFilters as any;
}

export interface GeneFrequencyChartParameters {
  pageSize: number
  offset: number
  genomicFilters: FilterSet
  cohortFilters: FilterSet
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useGeneFrequencyChartData = (_args: GeneFrequencyChartParameters) => {

  return {
    data: GeneFrequencyChartData,
    isFetching: false,
    isLoading: false,
    isSuccess: true,
    isError: false,
    isUninitialized: false,
  }
}

export const useGeneTable = (args: any) => {
  return {
    data: GenesTableData,
    isFetching: false,
    isLoading: false,
    isSuccess: true,
    isError: false,
    isUninitialized: false,
  }
}
