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
    "field": "genes.biotype",
    "label": "Biotype",
    "type": "enum",
    "index": "genes"
  },
  {
    "field": "ssms.consequence.transcript.annotation.vep_impact",
    "label": "VEP Impact",
    "type": "enum",
    "index": "ssm"
  },
  {
    "field": "ssms.consequence.transcript.annotation.sift_impact",
    "label": "SIFT Impact",
    "type": "enum",
    "index": "ssm"
  },
  {
    "field": "ssms.consequence.transcript.annotation.polyphen_impact",
    "label": "Polyphen Impact",
    "type": "enum",
    "index": "ssm"
  },
  {
    "field": "ssms.consequence.transcript.consequence_type",
    "label": "Consequence Type",
    "type": "enum",
    "index": "ssm"
  },
  {
    "field": "ssms.mutation_subtype",
    "label": "Type",
    "type": "enum",
    "index": "ssm"
  }
]

export default FilterFacets;
