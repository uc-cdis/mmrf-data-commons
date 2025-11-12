import biospecimenData from './data/biospecimenData.json';

export const useBiospecimenDataQuery = (caseId: string): any => {
  return {
    data: biospecimenData,
    isFetching: false,
    isSuccess: true,
    isUninitialized: Boolean(caseId),
    isError: false,
  };
};
