// this is used to generate tsv files for biospecimen downloads

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

        if (!rowData.hasOwnProperty(prop_key)) {
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
