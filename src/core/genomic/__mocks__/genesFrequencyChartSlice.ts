import topGenesData from './data/topGenesInCohort.json';


export  * from '@/core/genomic/genesFrequencyChartSlice';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useGeneFrequencyChartQuery = (_params: any) => (
  {
    data: topGenesData,
    isFetching: false,
    isLoading: false,
    isSuccess: true,
    isError: false,
    isUninitialized: false,
  }
)
