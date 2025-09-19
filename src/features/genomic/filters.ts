import { FacetDefinition } from '@gen3/core';

const FilterFacets : Array<FacetDefinition> = [
  {
    "field": "genes.upload.gene_id",
    "label": "Mutated Gene",
    "type": "upload",
    "index": "gene",
  },
  {
    "field": "ssms.upload.ssm_id",
    "label": "Somatic Mutation",
    "type": "upload",
    "index": "ssm",
  },
  {
    "field": "biotype",
    "label": "Biotype",
    "type": "enum",
    "index": "genes"
  },
  {
    "field": "consequence.transcript.annotation.vep_impact",
    "label": "VEP Impact",
    "type": "enum",
    "index": "ssm_occurrence"
  },
  {
    "field": "consequence.transcript.annotation.sift_impact",
    "label": "SIFT Impact",
    "type": "enum",
    "index": "ssm_occurrence"
  },
  {
    "field": "consequence.transcript.annotation.polyphen_impact",
    "label": "Polyphen Impact",
    "type": "enum",
    "index": "ssm_occurrence"
  },
  {
    "field": "consequence.transcript.consequence_type",
    "label": "Consequence Type",
    "type": "enum",
    "index": "ssm_occurrence"
  },
  {
    "field": "mutation_subtype",
    "label": "Type",
    "type": "enum",
    "index": "ssm_occurrence"
  }
]

export default FilterFacets;
