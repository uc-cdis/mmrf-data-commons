import { ComparativeSurvival,  } from '@/features/genomic/types';
import { FilterSet } from '../../utils';
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

export const useGeneAndSSMPanelData = (
  comparativeSurvival: ComparativeSurvival,
  isGene: boolean,
): GeneAndSSMPanelData =>  {

  return GeneAndSSMFilters;
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
