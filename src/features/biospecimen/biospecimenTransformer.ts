import {
  Aliquot,
  Analyte,
  Case,
  Portion,
  Sample,
} from "@/core/features/biospecimen/types";
import { CHILDREN_KEYS } from "./utils";

export type LevelType = "sample" | "portion" | "analyte" | "aliquot";

type BiospecimenNode = Sample | Portion | Analyte | Aliquot;

interface FlattenedRow {
  [key: string]: string | number | boolean | null | undefined;
}

interface Buckets {
  sample: FlattenedRow[];
  portion: FlattenedRow[];
  analyte: FlattenedRow[];
  aliquot: FlattenedRow[];
}

const formatValue = (val: unknown): string =>
  val === null || val === undefined ? "'--" : String(val);

export const arrayToTSV = (data: FlattenedRow[]): string => {
  if (!data || data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const headerRow = headers.join("\t");
  const rows = data.map((row) =>
    headers.map((header) => formatValue(row[header])).join("\t"),
  );
  return [headerRow, ...rows].join("\n");
};

// this is used to generate tsv files for biospecimen downloads and a util function
export const flattenBiospecimenData = (caseData: Case): Buckets => {
  const buckets: Buckets = {
    sample: [],
    portion: [],
    analyte: [],
    aliquot: [],
  };

  const projectContext: FlattenedRow = {
    "project.project_id": caseData.project?.project_id,
    "cases.case_id": caseData.case_id,
    "cases.submitter_id": caseData.submitter_id,
  };

  const traverse = (
    nodes: BiospecimenNode[],
    level: LevelType,
    parentContext: FlattenedRow,
  ) => {
    if (!nodes || !Array.isArray(nodes)) return;

    nodes.forEach((node) => {
      const currentIdKey = `${level}s.${level}_id`;
      const currentSubmitterKey = `${level}s.submitter_id`;
      const nodeIdValue = (node as any)[`${level}_id`];

      const currentContext: FlattenedRow = {
        ...parentContext,
        [currentIdKey]: nodeIdValue,
        [currentSubmitterKey]: node.submitter_id,
      };

      const rowData: FlattenedRow = { ...currentContext };

      Object.keys(node).forEach((key) => {
        if (CHILDREN_KEYS.includes(key)) return;

        const prop_key = `${level}s.${key}`;

        if (!Object.hasOwn(rowData, prop_key)) {
          rowData[prop_key] = (node as any)[key];
        }
      });

      buckets[level].push(rowData);

      if ("portions" in node && node.portions)
        traverse(node.portions, "portion", currentContext);
      if ("analytes" in node && node.analytes)
        traverse(node.analytes, "analyte", currentContext);
      if ("aliquots" in node && node.aliquots)
        traverse(node.aliquots, "aliquot", currentContext);
    });
  };

  if (caseData.samples) {
    traverse(caseData.samples, "sample", projectContext);
  }

  return buckets;
};


/**
 * Adapter to process the raw API response (list of files)
 * and generate the final Buckets for all data.
 * This is used in cart download biospecimen TSV
 */
export const processBiospecimenResponse = (apiResponse: any[]): Buckets => {
  const masterBuckets: Buckets = {
    sample: [],
    portion: [],
    analyte: [],
    aliquot: [],
  };

  if (!apiResponse || !Array.isArray(apiResponse)) return masterBuckets;

  apiResponse.forEach((file) => {
    if (file?.cases && Array.isArray(file?.cases)) {
      file?.cases.forEach((caseData: any) => {

        // single case parser
        const caseBuckets = flattenBiospecimenData(caseData);

        masterBuckets.sample.push(...caseBuckets.sample);
        masterBuckets.portion.push(...caseBuckets.portion);
        masterBuckets.analyte.push(...caseBuckets.analyte);
        masterBuckets.aliquot.push(...caseBuckets.aliquot);
      });
    }
  });

  return masterBuckets;
};
