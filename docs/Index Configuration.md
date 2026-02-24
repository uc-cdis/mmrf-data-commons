# Setting up Guppy/API Elasticsearch Index

Whenever you have a new index you need to do the following:

Alias the indexes to their base names:

* case
* file
* project
* annotation
* gene_centric
* ssm_centric
* ssm_occurrence_centric
* cnv_centric
* cnv_occrrence_centric

So for example if you have an index called "ssm_centric_v1" you would alias it to "ssm_centric"
The aliasing is done in a variety of ways depending on the client. For example here is a curl command:
```
curl -XPUT 'localhost:9200/_aliases' -d '{
"actions" :
[
{ "add" :
{ "index" :
"ssm_centric_v1",
"alias" :
"ssm_centric" } }
```
Once the alias is set up you will need to restart guppy and the gen3-analytics pods.

## Summary
1. Create the alias for the index
2. Restart guppy and the gen3-analytics pods

# Array Configuration

You need to ensure that the array configuration is set up correctly. Here is the current configuration:
```json
{"_index":"ia24-config","_type":"_doc","_id":"file","_score":1,"_source":{"index":"file","array":["acl","archive","analysis.input_files","analysis.metadata.read_groups","associated_entities","cases","cases.diagnoses","cases.diagnoses.sites_of_involvement","cases.diagnoses.treatments","cases.exposures","cases.family_histories","cases.follow_ups","cases.follow_ups.molecular_tests","cases.follow_ups.other_clinical_attributes","cases.follow_ups.other_clinical_attributes.comorbidities","cases.follow_ups.other_clinical_attributes.risk_factors","cases.samples","cases.project.disease_type","cases.project.primary_site","cases.samples.portions","cases.samples.portions.analytes","cases.samples.portions.analytes.aliquots","cases.samples.portions.slides","downstream_analyses","downstream_analyses.output_files","index_files"]}}
{"_index":"ia24-config","_type":"_doc","_id":"case","_score":1,"_source":{"index":"case","array":["aliquot_ids","analyte_ids","diagnoses","diagnoses.sites_of_involvement","diagnoses.treatments","diagnosis_ids","exposures","family_histories","files","files.acl","files.analysis.metadata.read_groups","files.downstream_analyses","files.downstream_analyses.output_files","files.index_files","follow_ups","follow_ups.molecular_tests","follow_ups.other_clinical_attributes","follow_ups.other_clinical_attributes.comorbidities","follow_ups.other_clinical_attributes.risk_factors","portion_ids","project.disease_type","project.primary_site","sample_ids","samples","samples.portions","samples.portions.analytes","samples.portions.analytes.aliquots","samples.portions.slides","slide_ids","submitter_aliquot_ids","submitter_analyte_ids","submitter_diagnosis_ids","submitter_portion_ids","submitter_sample_ids","submitter_slide_ids","summary.experimental_strategies","summary.data_categories"]}}
{"_index":"ia24-config","_type":"_doc","_id":"ssm_centric","_score":1,"_source":{"index":"ssm_centric","array":["consequence","consequence.transcript.gene.cytoband","consequence.transcript.gene.external_db_ids.entrez_gene","consequence.transcript.gene.external_db_ids.hgnc","consequence.transcript.gene.external_db_ids.omim_gene","consequence.transcript.gene.external_db_ids.uniprotkb_swissprot","consequence.transcript.gene.synonyms","cosmic_id","gene_aa_change","occurrence","occurrence.case.available_variation_data","occurrence.case.diagnoses","occurrence.case.diagnoses.treatments","occurrence.case.exposures","occurrence.case.family_histories","occurrence.case.observation","occurrence.case.project.disease_type","occurrence.case.project.primary_site"]}}
{"_index":"ia24-config","_type":"_doc","_id":"gene_centric","_score":1,"_source":{"index":"gene_centric","array":["case","case.cnv","case.ssm.consequence","case.ssm.consequence.transcript","case.ssm.consequence.transcript.annotation","cytoband","external_db_ids.entrez_gene","external_db_ids.hgnc","external_db_ids.omim_gene","external_db_ids.uniprotkb_swissprot","synonyms","transcripts","transcripts.domains","transcripts.exons","diagnoses.treatments"]}}
{"_index":"ia24-config","_type":"_doc","_id":"case_centric","_score":1,"_source":{"index":"case_centric","array":["aliquot_ids","analyte_ids","annotations","available_variation_data","diagnoses","diagnoses.sites_of_involvement","diagnoses.treatments","diagnosis_ids","exposures","family_histories","files","files.acl","files.analysis.metadata.read_groups","files.downstream_analyses","files.downstream_analyses.output_files","files.index_files","follow_ups","follow_ups.molecular_tests","follow_ups.other_clinical_attributes","follow_ups.other_clinical_attributes.comorbidities","follow_ups.other_clinical_attributes.risk_factors","gene.ssm","gene.ssm.consequence","portion_ids","project.disease_type","project.primary_site","sample_ids","samples","samples.portions","samples.portions.analytes","samples.portions.analytes.aliquots","samples.portions.slides","segment_cnv","segment_cnv.observation","slide_ids","submitter_aliquot_ids","submitter_analyte_ids","submitter_diagnosis_ids","submitter_portion_ids","submitter_sample_ids","submitter_slide_ids"]}}
{"_index":"ia24-config","_type":"_doc","_id":"ssm_occurrence_centric","_score":1,"_source":{"index":"ssm_occurrence_centric","array":["case.available_variation_data","case.diagnoses","case.diagnoses.treatments","case.exposures","case.family_histories","case.observation","case.project.disease_type","case.project.primary_site","case.samples","ssm.consequence","ssm.consequence.transcript.gene.cytoband","ssm.consequence.transcript.gene.external_db_ids.entrez_gene","ssm.consequence.transcript.gene.external_db_ids.hgnc","ssm.consequence.transcript.gene.external_db_ids.omim_gene","ssm.consequence.transcript.gene.external_db_ids.uniprotkb_swissprot","ssm.consequence.transcript.gene.synonyms","ssm.cosmic_id"]}}
{"_index":"ia24-config","_type":"_doc","_id":"cnv_centric","_score":1,"_source":{"index":"cnv_centric","array":["occurrence","occurrence.case.observation","occurrence.case.diagnoses","occurrence.case.family_histories","occurrence.case.samples","occurrence.case.project.disease_type","occurrence.case.project.primary_site","occurrence.case.available_variation_data"]}}
{"_index":"ia24-config","_type":"_doc","_id":"cnv_occurrence_centric","_score":1,"_source":{"index":"cnv_occurrence_centric","array":["cnv.consequence","case.observation","case.diagnoses","case.family_histories","case.samples"]}}
{"_index":"ia24-config","_type":"_doc","_id":"all-ia-20251119-001-nn_project","_score":1,"_source":{"index":"project","array":["disease_type","primary_site","summary.experimental_strategies","summary.data_categories"]}}
{"_index":"ia24-config","_type":"_doc","_id":"project","_score":1,"_source":{"index":"project","array":["disease_type","primary_site","summary.experimental_strategies","summary.data_categories"]}}
```

you can update the array config using a tool like [eleasticvue](https://github.com/sudhirnl7/elasticvue) which would allow you to update the array configuration in real time.
or you can update the array configuration manually using elasticdump:
```
elasticdump --input=ia24_array_config.json --output=http://localhost:9200/ia24-config --type=data
```
