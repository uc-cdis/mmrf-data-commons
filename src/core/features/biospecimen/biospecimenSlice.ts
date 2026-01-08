import { convertFilterSetToGqlFilter, FilterSet, guppyApi } from '@gen3/core';
import { BiospecimenApiResponse } from './types';

const biospecimenDownload = `query biospecimenDownload ($filter: JSON) {
   hits : CaseCentric_case_centric (filter: $filter, offset: 0, first:10) {
        case_id
        project {
            project_id
        }
        samples {
            tumor_descriptor
            specimen_type
            sample_id
            submitter_id
            state
            preservation_method
            tissue_type
            days_to_sample_procurement
            portions {
                portion_id
                analytes {
                    analyte_id
                    aliquots {
                        aliquot_id
                        submitter_id
                        state
                    }
                }
            }
        }
        submitter_id
    }
}`;

interface BiospecimenDownloadRequest {
  filter: FilterSet;
}

interface BiospecimenDownloadResults {
  hits: Record<string, any>;
}

const biospecimenSlice = guppyApi.injectEndpoints({
  endpoints: (builder) => ({
    biospecimenDownload: builder.query<
      BiospecimenDownloadResults,
      BiospecimenDownloadRequest
    >({
      query: ({ filter }: BiospecimenDownloadRequest) => ({
        query: biospecimenDownload,
        variables: {
          filter: convertFilterSetToGqlFilter(filter),
        },
      }),
    }),
    biospecimenForCase: builder.query<BiospecimenApiResponse, string>({
      query: (caseId: string) => ({
        query: biospecimenDownload,
        variables: {
          filter: { eq: { case_id: caseId } },
        },
      }),
    }),
  }),
});

export const { useBiospecimenDownloadQuery, useBiospecimenForCaseQuery } =
  biospecimenSlice;
