import {
  convertFilterSetToGqlFilter,
  FilterSet,
  Includes,
  isIncludes,
} from '@gen3/core';
import { ActiveGeneAndSSMFilters } from '@/features/genomic/types';
import FilterFacets from '@/features/genomic/filters';
import { joinFilters } from '@/core/utils';

/**
 *  The Genomic indices are denormalized but are in different places in the data structure.
 *  This object maps the index to the prefix for genes, ssm, and cases.
 */
export const GenomicIndexFilterPrefixes = {
  case: {
    gene: 'gene.',
    ssm: 'gene.ssm.',
    case: '',
  },
  gene: {
    gene: '',
    ssm: 'case.ssm.',
    case: 'case.',
  },
  ssm: {
    case: 'occurrence.case.',
    gene: 'consequence.transcript.gene.',
    ssm: ""
  },
};

export type GenomicIndexType = 'case' | 'gene' | 'ssm';

/**
 * Adds a prefix to each key in the `root` property of a given FilterSet.
 * Filters of type `Includes` will have their `field` updated to include
 * the prefix, while preserving other properties. Non-Includes filters are
 * logged and skipped if encountered.
 *
 * @param {FilterSet} source - The original FilterSet object containing filters under the `root` property.
 * @param {string} prefix - The prefix to be added to each filter key in the `root` property.
 * @returns {FilterSet} A new FilterSet with modified keys in the `root` property, having the prefix applied.
 */
export const addPrefixToFilterSet = (source: FilterSet, prefix: string): FilterSet => {
  // Ensure root property exists
  const results : FilterSet = { // start with the same structure as source
    mode: source?.mode || 'and',
    root: { }
  };

  for (const [key, value] of Object.entries(source.root)) {
    if (isIncludes(value)) {
      const prefixedKey = `${prefix}${key}`;

      results.root[prefixedKey] = {
        field: prefixedKey,
        operator: 'in',
        operands: [...value.operands],
      } satisfies Includes;
    }
    // Optional: handle or log non-Includes filters
    else if (value) {
      console.warn(`Skipping non-Includes filter for key: ${key}`, value);
    }
  }
  return results;
};

/**
 * Separates genomic filters into two distinct groups: gene-centric filters and SSM-centric filters.
 *
 * This function iterates through the provided genomic filters and categorizes each filter based on
 * its associated index ('gene_centric' or 'ssm_centric') as defined in the `FilterFacets` configuration.
 * The result is an object containing two filter sets: one for gene-centric filters and the other for
 * SSM-centric filters.
 *
 * @param {FilterSet} genomicFilters - The set of genomic filters to be categorized. It should contain a root
 *                                     object where keys represent filter fields, and values represent their criteria.
 * @returns {ActiveGeneAndSSMFilters} An object containing two separate filter sets: one for gene-centric filters
 *                                    (`gene`) and the other for SSM-centric filters (`ssm`).
 */
export const separateGeneAndSSMFilters = (genomicFilters: FilterSet) : ActiveGeneAndSSMFilters => {
  const results : ActiveGeneAndSSMFilters  = {
    gene: { mode: 'and', root: {}} as FilterSet,
    ssm: { mode: 'and', root: {}} as FilterSet
  }

  for (const [key, value ] of Object.entries(genomicFilters.root)) {
    const facetDef = FilterFacets.find((def) => def.field === key);
    if (facetDef) {
      if (facetDef.index === 'gene_centric') results.gene.root[key] = value;
      if (facetDef.index === 'ssm_centric') results.ssm.root[key] = value;
    }
  }
  return results;
}
/**
 * Merges gene and SSM (Simple Somatic Mutation) filters by adding the corresponding filters
 * from one index (gene/ssm) to the other. The merged filters maintain the logical inclusion (`in`) operations.
 *
 * @param {ActiveGeneAndSSMFilters} filters - An object containing the active filters for both gene and SSM.
 *                                             This includes separate root filter structures for both categories.
 * @returns {ActiveGeneAndSSMFilters} A new object with merged gene and SSM filters.
 *                                    Filters from the SSM category are added to the gene filters and vice versa.
 */
export const mergeGeneAndSSMFilters = (
  filters: ActiveGeneAndSSMFilters,
): ActiveGeneAndSSMFilters => {

  const geneIndexSSMPrefix = GenomicIndexFilterPrefixes.gene.ssm;
  const ssmIndexGenePrefix = GenomicIndexFilterPrefixes.ssm.gene;

  const results: ActiveGeneAndSSMFilters = {
    gene: { mode: 'and', root: { ...filters.gene.root } } as FilterSet,
    ssm: { mode: 'and', root: { ...filters.ssm.root } } as FilterSet,
  };
  // add ssm filters to gene filters
  for (const [key, value] of Object.entries(filters.ssm.root)) {
    const geneField = `${geneIndexSSMPrefix}${key}`;
    if (isIncludes(value)) {
      results.gene.root[geneField] = {
        field: geneField,
        operator: 'in',
        operands: [...value.operands],
      } satisfies Includes;
    }
  }

  // add gene filters to ssm filters
  for (const [key, value] of Object.entries(filters.gene.root)) {
    const ssmField = `${ssmIndexGenePrefix}${key}`;
    if (isIncludes(value)) {
      results.ssm.root[ssmField] = {
        field: ssmField,
        operator: 'in',
        operands: [...value.operands],
      } satisfies Includes;
    }
  }
  return results;
};


export const addIndexPrefixToGenomicFilterSet = (genomicFilters:FilterSet, type: GenomicIndexType): FilterSet => {

  const filters = separateGeneAndSSMFilters(genomicFilters);

  const ssmFilters = addPrefixToFilterSet(
    filters.ssm,
    `${GenomicIndexFilterPrefixes[type].ssm}`,
  );
  const geneFilters = addPrefixToFilterSet(
    filters.gene,
    `${GenomicIndexFilterPrefixes[type].gene}`,
  );

  return joinFilters(ssmFilters, geneFilters);
}
