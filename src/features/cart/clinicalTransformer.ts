interface FlattenedRow {
  [key: string]: any;
}

interface ClinicalBuckets {
  clinical: FlattenedRow[];
  follow_up: FlattenedRow[];
  exposure: FlattenedRow[];
  family_history: FlattenedRow[];
}

/**
 * Transforms the API response (list of files/cases) into bucketed arrays for TSV generation.
 */
export const processClinicalResponse = (
  apiResponse: any[],
): ClinicalBuckets => {
  const buckets: ClinicalBuckets = {
    clinical: [],
    follow_up: [],
    exposure: [],
    family_history: [],
  };

  if (!apiResponse || !Array.isArray(apiResponse)) return buckets;

  apiResponse.forEach((file) => {
    if (!file.cases || !Array.isArray(file.cases)) return;

    file.cases.forEach((caseData: any) => {

      const caseContext = {
        "project.project_id": caseData.project?.project_id,
        "cases.case_id": caseData.case_id,
        "cases.submitter_id": caseData.submitter_id,
        "cases.primary_site": caseData.primary_site,
        "cases.disease_type": caseData.disease_type,
      };

      const demographicData = caseData.demographic || {};

      const flatDemographic = Object.keys(demographicData).reduce(
        (acc, key) => {
          if (typeof demographicData[key] !== "object") {
            acc[`demographic.${key}`] = demographicData[key];
          }
          return acc;
        },
        {} as FlattenedRow,
      );

      const diagnoses =
        caseData?.diagnoses && caseData?.diagnoses.length > 0
          ? caseData.diagnoses
          : [{}];

      diagnoses.forEach((diag: any) => {
        const flatDiag = Object.keys(diag).reduce((acc, key) => {
          if (typeof diag[key] !== "object") {
            acc[`diagnoses.${key}`] = diag[key];
          }
          return acc;
        }, {} as FlattenedRow);

        buckets.clinical.push({
          ...caseContext,
          ...flatDemographic, // Demographic info repeats for every diagnosis
          ...flatDiag,
        });
      });

      if (caseData?.follow_ups && Array.isArray(caseData.follow_ups)) {
        caseData.follow_ups.forEach((fu: any) => {
          const flatFu = Object.keys(fu).reduce((acc, key) => {
            if (typeof fu[key] !== "object") acc[`follow_ups.${key}`] = fu[key];
            return acc;
          }, {} as FlattenedRow);

          buckets.follow_up.push({ ...caseContext, ...flatFu });
        });
      }

      if (caseData?.exposures && Array.isArray(caseData.exposures)) {
        caseData.exposures.forEach((exp: any) => {
          const flatExp = Object.keys(exp).reduce((acc, key) => {
            if (typeof exp[key] !== "object")
              acc[`exposures.${key}`] = exp[key];
            return acc;
          }, {} as FlattenedRow);

          buckets.exposure.push({ ...caseContext, ...flatExp });
        });
      }

      if (
        caseData.family_histories &&
        Array.isArray(caseData.family_histories)
      ) {
        caseData.family_histories.forEach((fh: any) => {
          const flatFh = Object.keys(fh).reduce((acc, key) => {
            if (typeof fh[key] !== "object")
              acc[`family_histories.${key}`] = fh[key];
            return acc;
          }, {} as FlattenedRow);

          buckets.family_history.push({ ...caseContext, ...flatFh });
        });
      }
    });
  });

  return buckets;
};
