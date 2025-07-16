import { Union } from "@gen3/core";


export type CnvChange =
  | "Amplification"
  | "Gain"
  | "Loss"
  | "Homozygous Deletion";

export const buildGeneTableSearchFilters = (
  term?: string,
): Union | undefined => {
  if (term !== undefined) {
    return {
      operator: "or",
      operands: [
        {
          operator: "includes",
          field: "genes.cytoband",
          operands: [`*${term}*`],
        },
        {
          operator: "includes",
          field: "genes.gene_id",
          operands: [`*${term}*`],
        },
        {
          operator: "includes",
          field: "genes.symbol",
          operands: [`*${term}*`],
        },
        { operator: "includes", field: "genes.name", operands: [`*${term}*`] },
      ],
    };
  }
  return undefined;
};
