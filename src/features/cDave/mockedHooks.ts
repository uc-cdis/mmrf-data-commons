import ClinicalFieldQueryData from './data/useClinicalFieldsQuery_response.json';
import ClinicalAnalysisQueryData from './data/useGetClinicalAnalysisQuery_response.json';
import { Gen3AnalysisApiRequest } from '@/core/features/api';

export const useClinicalFieldsQuery = () => ({
  data: ClinicalFieldQueryData });

export const useGetClinicalAnalysisQuery = ( _args: Gen3AnalysisApiRequest) => ({
  data: ClinicalAnalysisQueryData,
isFetching: false,
isSuccess: true,
isError: false,
error: null,
});
