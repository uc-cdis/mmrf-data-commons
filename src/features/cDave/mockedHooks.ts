import ClinicalFieldQueryData from './data/clinicalFields.json';
import ClinicalAnalysisQueryData from './data/useGetClinicalAnalysisQuery_response.json';
import MainSurvivalPlotData from './data/survivalPlot_response_dashboard.json';
import { Gen3AnalysisApiRequest } from '@/core/features/api';

export const useClinicalFieldsQuery = () => ({
  data: ClinicalFieldQueryData,
});

export const useGetClinicalAnalysisQuery = (_args: Gen3AnalysisApiRequest) => ({
  data: ClinicalAnalysisQueryData,
  isFetching: false,
  isSuccess: true,
  isError: false,
  error: null,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useGetSurvivalPlotQuery = (_args: any) => ({
  data: MainSurvivalPlotData,
  isFetching: false,
  isSuccess: true,
  isError: false,
  isUninitialized: false,
  error: null,
});
