import ClinicalFieldQueryData from './data/useClinicalFieldsQuery_response.json';
import ClinicalAnalysisQueryData from './data/useGetClinicalAnalysisQuery_response.json';
import FacetDefinitions from './data/useFacetDictionary_response.json'
import MainSuvivialPlotData from './data/survivalPlot_response_dashboard.json'
import { Gen3AnalysisApiRequest } from '@/core/features/api';
import { CoreState } from '@gen3/core';
import { FacetDefinition } from '@gen3/frontend';

export const useClinicalFieldsQuery = () => ({
  data: ClinicalFieldQueryData });

export const useGetClinicalAnalysisQuery = ( _args: Gen3AnalysisApiRequest) => ({
  data: ClinicalAnalysisQueryData,
isFetching: false,
isSuccess: true,
isError: false,
error: null,
});

export const useGetSurvivalPlotQuery = (_args: any) => ({
  data: MainSuvivialPlotData,
isFetching: false,
isSuccess: true,
  isError: false,
  isUninitialized: false,
  error: null,
})

export const selectFacetDefinitionByName = (
  _state: CoreState,
  field: string,
): FacetDefinition => {
  return (FacetDefinitions as Record<string, any>)?.[field];
};
