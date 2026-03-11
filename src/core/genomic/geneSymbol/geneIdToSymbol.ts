import geneIdToSymbol from './data/ensembl_gene_id_to_symbol.json';

const geneSymbolMap: Record<string, string> = geneIdToSymbol;

/**
 * Look up the gene symbol for a given Ensembl gene ID.
 * Returns the symbol if found, otherwise returns the gene_id as-is.
 */
export const getGeneSymbol = (gene_id: string): string => {
  return geneSymbolMap[gene_id] ?? gene_id;
};
