import {
  useCoreDispatch,
  useCoreSelector,
  selectCart,
  FilterSet,
  selectCurrentCohortFilters,
  EmptyFilterSet,
  convertFilterSetToGqlFilter
} from '@gen3/core';
import { CartIcon } from '@/utils/icons';
import React,  {useState} from 'react';
import { DownloadButton} from '@/components/DownloadButtons';
import FunctionButton from '@/components/FunctionButton';
import FunctionButtonRemove from '@/components/FunctionButton';
import { getFormattedTimestamp } from '@/utils/date';
import { focusStyles } from '@/utils';
import { useLazyGetAllFilesQuery} from '@/core/features/files/allFilesSlice';
import { addToCart, removeFromCart } from '@/features/cart/updateCart';
import { MMRFFile } from '@/core/features/files/filesSlice';
import { mapFileToCartFile } from '@/features/files/utils';

export const MANIFEST_DOWNLOAD_MESSAGE = `Download a manifest for use with the Gen3 Data Transfer Tool. The Gen3
          Data Transfer Tool is recommended for transferring large volumes of data.`;

interface RepositoryDownloadsPanelProps {
  localFilters: FilterSet;
  fileDataFetching: boolean;
}

const RepositoryDownloadsPanel = ({
  localFilters: repositoryFilters,
  fileDataFetching,
                                  } : RepositoryDownloadsPanelProps) => {

  const [manifestActive, setManifestActive] = useState(false);
  const [addFilesLoading, setAddFilesLoading] = useState(false);
  const [removeFilesLoading, setRemoveFilesLoading] = useState(false);
  const [metadataDownloadActive, setMetadataDownloadActive] = useState(false);
  const [sampleSheetDownloadActive, setSampleSheetDownloadActive] =
    useState(false);
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const [getFileSizeSliceData] = useLazyGetAllFilesQuery();
   const cohortFilters = useCoreSelector((state) => selectCurrentCohortFilters(state))

  const handleCartOperation = (operationType: "add" | "remove") => {
    const isAdd = operationType === "add";
    const setLoading = isAdd ? setAddFilesLoading : setRemoveFilesLoading;
    const callback = isAdd ? addToCart : removeFromCart;
    const filters = isAdd
      ? convertFilterSetToGqlFilter(repositoryFilters)
      : convertFilterSetToGqlFilter(EmptyFilterSet);

    setLoading(true);

    getFileSizeSliceData({
      caseFilters: convertFilterSetToGqlFilter(cohortFilters['case']),
      filters: filters,
    })
      .unwrap()
      .then((data: MMRFFile[]) => {
        return mapFileToCartFile(data);
      })
      .then((cartFiles: any) => {
        callback(cartFiles, currentCart, dispatch);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-wrap xl2:justify-end gap-2 mt-8 mb-4">
      <DownloadButton
        data-testid="button-sample-sheet-files-table"
        buttonLabel="Sample Sheet"
        setActive={setSampleSheetDownloadActive}
        active={sampleSheetDownloadActive}
        preventClickEvent
        endpoint="files"
        filename={`mmrf_sample_sheet.${new Date()
          .toISOString()
          .slice(0, 10)}.tsv`}
        format="tsv"
        method="POST"
        fields={[
          "file_id",
          "file_name",
          "data_category",
          "data_type",
          "cases.project.project_id",
          "cases.submitter_id",
          "cases.samples.submitter_id",
          "cases.samples.tissue_type",
          "cases.samples.tumor_descriptor",
          "cases.samples.specimen_type",
          "cases.samples.preservation_method",
        ]}
        caseFilters={EmptyFilterSet}
        filters={repositoryFilters}
        extraParams={{
          tsv_format: "sample-sheet",
        }}
      />
      <DownloadButton
        data-testid="button-metadata-files-table"
        buttonLabel="Metadata"
        setActive={setMetadataDownloadActive}
        active={metadataDownloadActive}
        preventClickEvent
        endpoint="files"
        filename={`metadata.repository.${new Date()
          .toISOString()
          .slice(0, 10)}.json`}
        method="POST"
        caseFilters={EmptyFilterSet}
        filters={repositoryFilters}
        fields={[
          "state",
          "access",
          "md5sum",
          "data_format",
          "data_type",
          "data_category",
          "file_name",
          "file_size",
          "file_id",
          "platform",
          "experimental_strategy",
          "center.short_name",
          "annotations.annotation_id",
          "annotations.entity_id",
          "tags",
          "submitter_id",
          "archive.archive_id",
          "archive.submitter_id",
          "archive.revision",
          "associated_entities.entity_id",
          "associated_entities.entity_type",
          "associated_entities.case_id",
          "analysis.analysis_id",
          "analysis.workflow_type",
          "analysis.updated_datetime",
          "analysis.input_files.file_id",
          "analysis.metadata.read_groups.read_group_id",
          "analysis.metadata.read_groups.is_paired_end",
          "analysis.metadata.read_groups.read_length",
          "analysis.metadata.read_groups.library_name",
          "analysis.metadata.read_groups.sequencing_center",
          "analysis.metadata.read_groups.sequencing_date",
          "downstream_analyses.output_files.access",
          "downstream_analyses.output_files.file_id",
          "downstream_analyses.output_files.file_name",
          "downstream_analyses.output_files.data_category",
          "downstream_analyses.output_files.data_type",
          "downstream_analyses.output_files.data_format",
          "downstream_analyses.workflow_type",
          "downstream_analyses.output_files.file_size",
          "index_files.file_id",
        ]}
        extraParams={{
          expand: [
            "metadata_files",
            "annotations",
            "archive",
            "associated_entities",
            "center",
            "analysis",
            "analysis.input_files",
            "analysis.metadata",
            "analysis.metadata_files",
            "analysis.downstream_analyses",
            "analysis.downstream_analyses.output_files",
            "reference_genome",
            "index_file",
          ].join(","),
        }}
      />
      <DownloadButton
        data-testid="button-manifest-files-table"
        buttonLabel="Manifest"
        toolTip={MANIFEST_DOWNLOAD_MESSAGE}
        multilineTooltip
        endpoint="files"
        method="POST"
        extraParams={{
          return_type: "manifest",
        }}
        caseFilters={EmptyFilterSet}
        filters={repositoryFilters}
        setActive={setManifestActive}
        active={manifestActive}
        filename={`gdc_manifest.${getFormattedTimestamp({
          includeTimes: true,
        })}.txt`}
      />

      <FunctionButton
        data-testid="button-add-all-files-table"
        leftSection={
          (<CartIcon
              aria-hidden="true"
              className="hidden xl:block"
            />
          )
        }
        isActive={addFilesLoading}
        variant="outline"
        disabled={fileDataFetching}
        onClick={() => {
          // check the number of files selected before making call
            handleCartOperation("add");
        }}
      >
        Add All Files to Cart
      </FunctionButton>

      <FunctionButtonRemove
        data-testid="button-remove-all-files-table"
        leftSection={
          removeFilesLoading ? undefined : (
            <CartIcon
              aria-hidden="true"
              className="hidden xl:block"
            />
          )
        }
        classNames={{
          root: `bg-nci-red-darker text-base-max hover:bg-removeButtonHover border-0 ${focusStyles}`,
        }}
        isActive={removeFilesLoading}
        onClick={() => {
          handleCartOperation("remove");
        }}
      >
        Remove All From Cart
      </FunctionButtonRemove>
    </div>
  );
};

export default RepositoryDownloadsPanel;
