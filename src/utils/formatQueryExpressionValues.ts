
import { getGeneSymbol } from '@/core/genomic/geneSymbol/geneIdToSymbol';

export const formatGeneSymbol = (value: string, field: string): Promise<string> => {
  if (field.includes('gene_id') && value.length > 0) {
    const symbol = getGeneSymbol(value);
    return Promise.resolve(symbol);
  }
  return Promise.resolve(value);
};
