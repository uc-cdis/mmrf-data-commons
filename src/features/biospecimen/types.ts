interface SampleNode {
  sample_id: string | null;
  submitter_id: string | null;
  tissue_type: string | null;
  tumor_code_id: string | null;
  shortest_dimension: string | null;
  intermediate_dimension: string | null;
  longest_dimension: string | null;
  pathology_report_uuid: string | null;
  tumor_descriptor: string | null;
  current_weight: string | null;
  initial_weight: string | null;
  time_between_clamping_and_freezing: string | null;
  time_between_excision_and_freezing: string | null;
  days_to_sample_procurement: number | null;
  freezing_method: string | null;
  preservation_method: string | null;
  days_to_collection: string | null;
  portions: {
    hits: {
      edges: Array<{
        node: Partial<PortionNode>;
      }>;
    };
  };
}
interface PortionNode {
  submitter_id: string | null;
  portion_id: string | null;
  portion_number: string | null;
  weight: string | null;
  is_ffpe: string | null;
  analytes: {
    hits: {
      edges: Array<{
        node: Partial<AnalytesNode>;
      }>;
    };
  };
  slides: {
    hits: {
      edges: Array<{
        node: Partial<SlidesNode>;
      }>;
    };
  };
}
interface AnalytesNode {
  submitter_id: string | null;
  analyte_id: string | null;
  analyte_type: string | null;
  well_number: string | null;
  amount: string | null;
  a260_a280_ratio: string | null;
  concentration: string | null;
  spectrophotometer_method: string | null;
  aliquots: {
    hits: {
      edges: Array<{
        node: Partial<AliquotsNode>;
      }>;
    };
  };
}
interface SlidesNode {
  submitter_id: string | null;
  slide_id: string | null;
  percent_tumor_nuclei: string | null;
  percent_monocyte_infiltration: string | null;
  percent_normal_cells: string | null;
  percent_stromal_cells: string | null;
  percent_eosinophil_infiltration: string | null;
  percent_lymphocyte_infiltration: string | null;
  percent_neutrophil_infiltration: string | null;
  section_location: string | null;
  percent_granulocyte_infiltration: string | null;
  percent_necrosis: string | null;
  percent_inflam_infiltration: string | null;
  number_proliferating_cells: string | null;
  percent_tumor_cells: string | null;
}
interface AliquotsNode {
  submitter_id: string | null;
  aliquot_id: string | null;
  source_center: string | null;
  amount: string | null;
  concentration: string | null;
  analyte_type: string | null;
}
type BiospecimenEntityType =
  | SampleNode
  | PortionNode
  | AnalytesNode
  | SlidesNode
  | AliquotsNode
  | null;

export type { BiospecimenEntityType };
