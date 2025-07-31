import { combineReducers } from "@reduxjs/toolkit";
import {
  useGetClinicalAnalysisQuery,
  clinicalAnalysisApiReducer,
} from "./clinicalDataAnalysisSlice";
import { useClinicalFieldsQuery } from "./clinicalFieldsSlice";
import {
  useGetContinuousDataStatsQuery,
  type ClinicalContinuousStatsData,
} from "./clinicalContinuousStatsSlice";

import { buildRangeQuery} from './utils';

export {
  useClinicalFieldsQuery,
  useGetClinicalAnalysisQuery,
  useGetContinuousDataStatsQuery,
  buildRangeQuery,
  ClinicalContinuousStatsData,
};

export const clinicalDataAnalysisReducer = combineReducers({
  resultCase: clinicalAnalysisApiReducer,
});
