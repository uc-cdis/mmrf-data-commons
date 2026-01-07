import { JSXElementConstructor, ReactElement } from "react";

import {
  Aliquot,
  Analyte,
  Portion,
  Sample,
} from "@/core/features/biospecimen/types";

export type BiospecimenEntityType = Sample | Portion | Analyte | Aliquot | null;

export interface types {
  s: string;
  p: string;
}

export interface NodeProps {
  entity: BiospecimenEntityType;
  children: ReactElement<any, string | JSXElementConstructor<any>>;
  entityTypes: Array<types>;
  type: types;
  selectedEntity: BiospecimenEntityType;
  selectEntity: (entity: BiospecimenEntityType, type: types) => void;
  query: string;
}

export interface BioTreeProps {
  entities?: BiospecimenEntityType[];
  entityTypes: Array<types>;
  type: types;
  parentNode: string;
  treeStatusOverride: overrideMessage | null;
  setTreeStatusOverride: React.Dispatch<React.SetStateAction<overrideMessage | null>>;
  selectedEntity: BiospecimenEntityType;
  selectEntity: (entity: BiospecimenEntityType, type: types) => void;
  setExpandedCount: React.Dispatch<React.SetStateAction<number>>;
  setTotalNodeCount: React.Dispatch<React.SetStateAction<number>>;
  query: string;
  search: (query: string, entity: BiospecimenEntityType) => any[];
}

export const entityTypes = [
  { s: "portion", p: "portions" },
  { s: "aliquot", p: "aliquots" },
  { s: "analyte", p: "analytes" },
  { s: "sample", p: "samples" },
];

export enum overrideMessage {
  Expanded = "Expanded",
  Collapsed = "Collapsed",
  QueryMatches = "QueryMatches",
}
