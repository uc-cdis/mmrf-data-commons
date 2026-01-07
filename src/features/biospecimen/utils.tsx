import React from "react";
import { formatDataForHorizontalTable } from "../files/utils";

import { humanify } from "src/utils";
import { BiospecimenEntityType } from "@/components/BioTree/types";

const childrenKeys = ["samples", "portions", "analytes", "aliquots", "slides"];

export const match = (query: string, entity: any): boolean => {
  if (!entity) return false;

  const lowerQuery = query.toLowerCase();
  const valueMatch = Object.keys(entity).some((k) => {
    return (
      typeof entity[k] === "string" &&
      entity[k].toLowerCase().includes(lowerQuery)
    );
  });

  const keyMatch = childrenKeys.some(
    (key) =>
      key.includes(lowerQuery) &&
      Array.isArray(entity[key]) &&
      entity[key].length > 0,
  );

  return valueMatch || keyMatch;
};

export const searchForStringInNode = (query: string, entity: any): any[] => {
  const found: any[] = [];

  function traverse(node: any) {
    if (!node) return;

    if (match(query, node)) {
      found.push({ node });
    }

    childrenKeys.forEach((key) => {
      const children = node[key];
      if (Array.isArray(children)) {
        children.forEach((child: any) => {
          traverse(child);
        });
      }
    });
  }

  traverse(entity);
  return found;
};

export const idFields = ["sample_id", "portion_id", "analyte_id", "aliquot_id"];

export const formatEntityInfo = (
  entity: BiospecimenEntityType,
  foundType: string,
): {
  readonly headerName: string;
  readonly values: readonly (
    | string
    | number
    | boolean
    | JSX.Element
    | readonly string[]
  )[];
}[] => {
  if (!entity) return [];

  const uuIDIndexer = idFields.find((id) => (entity as any)[id]);
  const uuIDResult = uuIDIndexer ? (entity as any)[uuIDIndexer] : "";

  const ids = {
    [`${foundType}_ID`]: entity.submitter_id,
    [`${foundType}_UUID`]: uuIDResult,
  };

  const fieldOrder = getOrder(foundType);

  const ordered = fieldOrder.reduce((acc: any, key: string) => {
    return { ...acc, [key]: (entity as any)[key] };
  }, {});

  const filtered = Object.entries(ids).concat(
    Object.entries(ordered)
      .filter(
        ([key]) =>
          !["submitter_id", "expanded", `${foundType}_id`].includes(key),
      )
      .map(([key, value]) => {
        if (Array.isArray(value)) return [key, value.length];
        return [key, value];
      }),
  );

  const headersConfig = filtered.map(([key]) => {
    const config: { field: string; name: string; modifier?: any } = {
      field: key,
      name: humanify({ term: key }),
    };
    if (
      [
        "days_to_sample_procurement", // TODO: don't know what this value is yet
      ].includes(key)
    ) {
      // config.modifier = (a: any) => ageDisplay(a);
    }
    return config;
  });

  const obj = { ...ids, ...Object.fromEntries(filtered) };
  return formatDataForHorizontalTable(obj, headersConfig);
};

const getOrder = (type: string): string[] => {
  switch (type) {
    case "sample":
      return [
        "submitter_id",
        "sample_id",
        "specimen_type",
        "tissue_type",
        "state",
        "tumor_descriptor",
        "preservation_method",
        "days_to_sample_procurement",
        "portions",
      ];
    case "portion":
      return ["submitter_id", "portion_id", "analytes"];
    case "analyte":
      return ["submitter_id", "analyte_id", "aliquots"];
    case "aliquot":
      return ["submitter_id", "aliquot_id", "state"];
    default:
      return [];
  }
};
