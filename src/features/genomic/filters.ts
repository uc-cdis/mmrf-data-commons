import { FacetDefinition } from '@gen3/core';

const FilterFacets : Array<FacetDefinition> = [
  {
    "field": "gene_id",
    "label": "Mutated Gene",
    "type": "upload",
    "index": "gene_centric",
  },
  {
    "field": "is_cancer_gene_census",
    "label": "Cancer Gene Census",
    "type": "toggle",
    "index": "gene_centric"
  },
  {
    "field": "ssm_id",
    "label": "Somatic Mutation",
    "type": "upload",
    "index": "ssm_centric",
  },
  {
    "field": "biotype",
    "label": "Biotype",
    "type": "enum",
    "index": "gene_centric"
  },
  {
    "field": "consequence.transcript.annotation.vep_impact",
    "label": "VEP Impact",
    "type": "enum",
    "index": "ssm_centric"
  },
  {
    "field": "consequence.transcript.annotation.sift_impact",
    "label": "SIFT Impact",
    "type": "enum",
    "index": "ssm_centric"
  },
  {
    "field": "consequence.transcript.annotation.polyphen_impact",
    "label": "Polyphen Impact",
    "type": "enum",
    "index": "ssm_centric"
  },
  {
    "field": "consequence.transcript.consequence_type",
    "label": "Consequence Type",
    "type": "enum",
    "index": "ssm_centric"
  },
  {
    "field": "mutation_subtype",
    "label": "Type",
    "type": "enum",
    "index": "ssm_centric"
  }
];


export const GenomicIndexFilterPrefixes = {
  case: {
    gene: 'gene',
    ssm: 'gene.ssm',
    case: '',
  },
  gene: {
    gene: '',
    ssm: 'case.ssm',
    case: 'case',
  },
  ssm: {
    case: 'occurrence.case',
    gene: 'consequence.transcript.gene',
    ssm: ""
  },
};

export default FilterFacets;
