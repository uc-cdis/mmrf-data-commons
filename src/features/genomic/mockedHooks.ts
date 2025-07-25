import { ComparativeSurvival  } from '@/features/genomic/types';
import { FilterSet } from '@gen3/core';
import type { Survival } from '@/core/survival';
import GeneAndSSMFilters from './data/useGeneAndSSMPanel_data.json';
import GeneFrequencyChartData from './data/useGeneFrequencyChart_data.json';
import SSMSTableData from './data/useGetSssmTableDataQuery_data.json';
import { TablePageOffsetProps } from '@/core';
// import GenesTableData from './data/useGenesTable_data.json';
// for all of the MMRF Gene use this one
import GenesTableData from './data/useGenesTable_data_all.json';


export interface GeneAndSSMPanelData {
  isDemoMode: boolean;
  genomicFilters: FilterSet;
  currentCohortFilters: FilterSet;
  overwritingDemoFilter: FilterSet;
  survivalPlotData: Survival;
  survivalPlotFetching: boolean;
  survivalPlotReady: boolean;
}


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


const generateSubrowQueryData = () => {
    const data = [];
    const maxNumeratorDenominatorSize = 10;
    const maxNumberOfObjects = 40;
    const minNumberOfObjects = 5;
    const numberOfObjects = Math.floor(Math.random() * (maxNumberOfObjects - minNumberOfObjects)) + minNumberOfObjects;
    for (let i = 0; i < numberOfObjects; i++) {
        const projectName = `name ${i}`;
        const numerator = Math.floor(Math.random() * maxNumeratorDenominatorSize);
        const denominator = Math.floor(Math.random() * maxNumeratorDenominatorSize) + numerator;
        data.push({
            project: projectName,
            numerator,
            denominator
        });
    }
    return data;
};


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useGetGeneTableSubrowQuery = (id: any) => {
  return {
    data: generateSubrowQueryData(),
    isFetching: false,
    isLoading: false,
    isSuccess: true,
    isError: false,
    isUninitialized: false,
  }
}

export interface SsmsTableRequestParameters extends TablePageOffsetProps {
  readonly geneSymbol?: string;
  readonly genomicFilters: FilterSet;
  readonly cohortFilters: FilterSet;
  readonly tableFilters: FilterSet;
  readonly _cohortFiltersNoSet?: FilterSet;
}

export const useGetSssmTableDataQuery = (args: SsmsTableRequestParameters) => ({
  isFetching: false,
  isLoading: false,
  isSuccess: true,
  isError: false,
  isUninitialized: false,
  data: SSMSTableData,
})
