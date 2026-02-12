import React, { useState } from "react";
import {
  useCoreDispatch,
  CartItem,
  EmptyFilterSet,
  downloadJSONDataFromGuppy,
} from "@gen3/core";
import { filesize } from "filesize";
import { Button, Loader, Menu } from "@mantine/core";
import { DownloadButton } from "@/components/DownloadButtons";
import { removeFromCart } from "./updateCart";
import { focusStyles } from "@/utils";
import {
  ArrowDropDownIcon,
  CartIcon,
  DownloadIcon,
  FileIcon,
  PersonIcon,
  SaveIcon,
} from "@/utils/icons";
import { getFormattedTimestamp } from "@/utils/date";
import { MANIFEST_DOWNLOAD_MESSAGE } from "@/utils/constants";
import { handleDownload } from "@/utils/downloads";
import { BIOSPECIMEN_FIELDS, CLINICAL_FIELDS } from "./utils";
import {
  arrayToTSV,
  processBiospecimenResponse,
} from "../biospecimen/biospecimenTransformer";
import { generateTarGzBlob } from "@/utils/archiver";
import FunctionButton from "@/components/FunctionButton";
import { processClinicalResponse } from "./clinicalTransformer";

const buttonStyle =
  "bg-base-max text-primary border-primary data-disabled:opacity-50 data-disabled:bg-base-max data-disabled:text-primary hover:bg-base-max hover:text-primary";

interface CartHeaderProps {
  summaryData: any;
  cart: CartItem[];
}

const CartHeader: React.FC<CartHeaderProps> = ({
  summaryData,
  cart,
}: CartHeaderProps) => {
  const dispatch = useCoreDispatch();
  const [manifestDownloadActive, setManifestDownloadActive] = useState(false);
  const [clinicalTSVDownloadActive, setClinicalTSVDownloadActive] =
    useState(false);
  const [clinicalJSONDownloadActive, setClinicalJSONDownloadActive] =
    useState(false);
  const [biospecimenTSVDownloadActive, setBiospecimenTSVDownloadActive] =
    useState(false);
  const [biospecimenJSONDownloadActive, setBiospecimenJSONDownloadActive] =
    useState(false);
  const [metadataDownloadActive, setMetadataDownloadActive] = useState(false);
  const [sampleSheetDownloadActive, setSampleSheetDownloadActive] =
    useState(false);

  const handleBiospecimenTsvDownload = async () => {
    try {
      setBiospecimenTSVDownloadActive(true);

      const rawData = await downloadJSONDataFromGuppy({
        parameters: {
          type: "file",
          fields: BIOSPECIMEN_FIELDS,
          filter: {
            mode: "and",
            root: {
              file_id: {
                operator: "in",
                field: "file_id",
                operands: cart.map((file) => file?.file_id),
              },
            },
          },
          format: "json",
        },
      });

      const buckets = processBiospecimenResponse(rawData);

      const files = [
        { name: "sample.tsv", content: arrayToTSV(buckets.sample) },
        { name: "portion.tsv", content: arrayToTSV(buckets.portion) },
        { name: "analyte.tsv", content: arrayToTSV(buckets.analyte) },
        { name: "aliquot.tsv", content: arrayToTSV(buckets.aliquot) },
      ];

      const blob = await generateTarGzBlob(files);

      const filename = `biospecimen_cart.${new Date().toISOString().slice(0, 10)}.tar.gz`;
      handleDownload(blob, filename);
    } catch (error) {
      console.error("Error downloading biospecimen TSV:", error);
    } finally {
      setBiospecimenTSVDownloadActive(false);
    }
  };

  const handleClinicalTsvDownload = async () => {
    try {
      setClinicalTSVDownloadActive(true);

      const rawData = await downloadJSONDataFromGuppy({
        parameters: {
          type: "file",
          filter: {
            mode: "and",
            root: {
              file_id: {
                operator: "in",
                field: "file_id",
                operands: cart.map((file) => file?.file_id),
              },
            },
          },
          fields: CLINICAL_FIELDS,
          format: "json",
        },
      });

      const buckets = processClinicalResponse(rawData);

      const files = [];

      if (buckets.clinical.length) {
        files.push({
          name: "clinical.tsv",
          content: arrayToTSV(buckets.clinical),
        });
      }
      if (buckets.follow_up.length) {
        files.push({
          name: "follow_up.tsv",
          content: arrayToTSV(buckets.follow_up),
        });
      }
      if (buckets.exposure.length) {
        files.push({
          name: "exposure.tsv",
          content: arrayToTSV(buckets.exposure),
        });
      }
      if (buckets.family_history.length) {
        files.push({
          name: "family_history.tsv",
          content: arrayToTSV(buckets.family_history),
        });
      }

      if (files.length === 0) {
        console.warn("No clinical data found to download");
        return;
      }

      const blob = await generateTarGzBlob(files);
      handleDownload(
        blob,
        `clinical_cart.${new Date().toISOString().slice(0, 10)}.tar.gz`,
      );
    } catch (err) {
      console.error("Clinical TSV Download failed", err);
    } finally {
      setClinicalTSVDownloadActive(false);
    }
  };

  return (
    <>
      <div
        className="bg-primary text-primary-contrast-darkest flex flex-col-reverse 2xl:flex-row 2xl:items-center gap-4 w-full p-4"
        data-testid="cart-header"
      >
        <div className="flex flex-wrap gap-2">
          <DownloadButton
            buttonLabel="Manifest"
            toolTip={MANIFEST_DOWNLOAD_MESSAGE}
            preventClickEvent
            endpoint="file"
            setActive={setManifestDownloadActive}
            active={manifestDownloadActive}
            filename={`mmrf_manifest.${getFormattedTimestamp({
              includeTimes: true,
            })}.json`}
            variant="white"
            method="POST"
            fields={[
              "file_id",
              "file_name",
              "file_size",
              "md5sum",
              "cases.case_id",
            ]}
            extraParams={{
              isManifest: true,
            }}
            leftSection={
              manifestDownloadActive ? (
                <Loader size={15} />
              ) : (
                <DownloadIcon aria-hidden="true" className="hidden xl:block" />
              )
            }
            caseFilters={EmptyFilterSet}
            filters={{
              mode: "and",
              root: {
                file_id: {
                  operator: "in",
                  field: "file_id",
                  operands: cart.map((file) => file?.file_id),
                },
              },
            }}
            caseIdField="cases.case_id"
          />
          {/* Biospecimen */}
          <Menu width="target">
            <Menu.Target>
              <Button
                data-testid="button-download-biospecimen"
                classNames={{
                  root: `${buttonStyle} ${focusStyles}`,
                }}
                leftSection={
                  <DownloadIcon
                    aria-hidden="true"
                    size="1rem"
                    className="hidden xl:block"
                  />
                }
                rightSection={
                  <div className="border-l pl-1 -mr-2">
                    <ArrowDropDownIcon size="1.5em" aria-hidden="true" />
                  </div>
                }
              >
                Biospecimen
              </Button>
            </Menu.Target>
            <Menu.Dropdown data-testid="dropdown-menu-options">
              <Menu.Item
                component={DownloadButton}
                classNames={{ item: "font-normal border-0" }}
                buttonLabel="JSON"
                preventClickEvent
                endpoint="file"
                setActive={setBiospecimenJSONDownloadActive}
                active={biospecimenJSONDownloadActive}
                format="json"
                method="POST"
                filename={`biospecimen_cart.${new Date()
                  .toISOString()
                  .slice(0, 10)}.json`}
                fields={BIOSPECIMEN_FIELDS}
                caseFilters={EmptyFilterSet}
                filters={{
                  mode: "and",
                  root: {
                    file_id: {
                      operator: "in",
                      field: "file_id",
                      operands: cart.map((file) => file?.file_id),
                    },
                  },
                }}
                caseIdField="cases.case_id"
              />
              <Menu.Item
                component={FunctionButton}
                onClick={handleBiospecimenTsvDownload}
                disabled={biospecimenTSVDownloadActive}
                $variant="subtle"
                isDownload
                showDownloadIcon
                isActive={biospecimenJSONDownloadActive}
                closeMenuOnClick={false}
              >
                TSV
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          {/* Clinical */}
          <Menu width="target">
            <Menu.Target>
              <Button
                data-testid="button-download-clinical"
                classNames={{
                  root: `${buttonStyle} ${focusStyles}`,
                }}
                leftSection={
                  <DownloadIcon
                    aria-hidden="true"
                    size="1rem"
                    className="hidden xl:block"
                  />
                }
                rightSection={
                  <div className="border-l pl-1 -mr-2">
                    <ArrowDropDownIcon size="1.5em" aria-hidden="true" />
                  </div>
                }
              >
                Clinical
              </Button>
            </Menu.Target>
            <Menu.Dropdown data-testid="dropdown-menu-options">
              <Menu.Item
                component={DownloadButton}
                classNames={{ item: "font-normal border-0" }}
                buttonLabel="JSON"
                preventClickEvent
                endpoint="file"
                setActive={setClinicalJSONDownloadActive}
                active={clinicalJSONDownloadActive}
                format="json"
                method="POST"
                filename={`clinical_cart.${new Date()
                  .toISOString()
                  .slice(0, 10)}.json`}
                caseFilters={EmptyFilterSet}
                fields={CLINICAL_FIELDS}
                filters={{
                  mode: "and",
                  root: {
                    file_id: {
                      operator: "in",
                      field: "file_id",
                      operands: cart.map((file) => file?.file_id),
                    },
                  },
                }}
                caseIdField="cases.case_id"
              />
              <Menu.Item
                component={FunctionButton}
                onClick={handleClinicalTsvDownload}
                disabled={clinicalTSVDownloadActive}
                $variant="subtle"
                isDownload
                showDownloadIcon
                isActive={clinicalTSVDownloadActive}
                closeMenuOnClick={false}
              >
                TSV
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          {/* Sample Sheet */}
          <DownloadButton
            buttonLabel="Sample Sheet"
            preventClickEvent
            endpoint="file"
            setActive={setSampleSheetDownloadActive}
            active={sampleSheetDownloadActive}
            method="POST"
            format="json"
            filename={`cart_sample_sheet.${new Date()
              .toISOString()
              .slice(0, 10)}.json`}
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
            filters={{
              mode: "and",
              root: {
                file_id: {
                  operator: "in",
                  field: "file_id",
                  operands: cart.map((file) => file?.file_id),
                },
              },
            }}
            caseIdField="cases.case_id"
          />
          {/* Metadata */}
          <DownloadButton
            preventClickEvent
            endpoint="file"
            setActive={setMetadataDownloadActive}
            active={metadataDownloadActive}
            buttonLabel="Download Metadata"
            format="json"
            method="POST"
            filename={`metadata.cart.${new Date()
              .toISOString()
              .slice(0, 10)}.json`}
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
            caseFilters={EmptyFilterSet}
            filters={{
              mode: "and",
              root: {
                file_id: {
                  operator: "in",
                  field: "file_id",
                  operands: cart.map((file) => file?.file_id),
                },
              },
            }}
            caseIdField="cases.case_id"
          />
          {/* Remove From Cart */}
          <Button
            data-testid="button-remove-from-cart"
            leftSection={
              <CartIcon
                aria-hidden="true"
                size="1rem"
                className="hidden xl:block"
              />
            }
            classNames={{
              root: `bg-white text-primary hover:bg-removeButtonHover ${focusStyles}`,
            }}
            onClick={() => removeFromCart(cart, cart, dispatch)}
          >
            Remove From Cart ({cart.length})
          </Button>
        </div>

        <h1 className="uppercase flex 2xl:ml-auto items-center truncate text-xl">
          Total of{" "}
          <FileIcon size={25} className="ml-2 mr-1" aria-hidden="true" />{" "}
          <b data-testid="text-file-count" className="mr-1">
            {summaryData?.total_doc_count?.toLocaleString() || "--"}
          </b>{" "}
          {summaryData?.total_doc_count === 1 ? "File" : "Files"}
          <PersonIcon size={25} className="ml-2 mr-1" aria-hidden="true" />{" "}
          <b data-testid="text-case-count" className="mr-1">
            {summaryData?.total_case_count?.toLocaleString() || "--"}
          </b>{" "}
          {summaryData?.total_case_count === 1 ? "Case" : "Cases"}{" "}
          <SaveIcon size={25} className="ml-2 mr-1" aria-hidden="true" />{" "}
          <span data-testid="text-size-count">
            {filesize(summaryData?.total_file_size || 0)}
          </span>{" "}
        </h1>
      </div>
    </>
  );
};

export default CartHeader;
