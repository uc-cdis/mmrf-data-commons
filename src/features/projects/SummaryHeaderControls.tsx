import { DropdownWithIcon } from "@/components/DropdownWithIcon/DropdownWithIcon";
import { focusStyles } from "@/utils/index";
import { useCoreDispatch } from "@gen3/core";
import { Button, Loader, Tooltip } from "@mantine/core";
import React, { useState } from "react";
import { ProjectViewProps } from "./ProjectView";
import { getFormattedTimestamp } from "@/utils/date";
import { DownloadIcon } from "@/utils/icons";
import {
  ADDITIONAL_DOWNLOAD_MESSAGE,
  MANIFEST_DOWNLOAD_MESSAGE,
} from "@/utils/constants";
import { download } from '@/utils/downloads';

function SummaryHeaderControls({
  projectData,
}: {
  projectData: ProjectViewProps;
}) {
  const dispatch = useCoreDispatch();
  const [manifestDownloadActive, setManifestDownloadActive] = useState(false);
  const [clinicalDownloadActiveTSV, setClinicalDownloadActiveTSV] =
    useState(false);
  const [clinicalDownloadActiveJSON, setClinicalDownloadActiveJSON] =
    useState(false);
  const [biospecimenDownloadActiveTSV, setBiospecimenDownloadActiveTSV] =
    useState(false);
  const [biospecimenDownloadActiveJSON, setBiospecimenDownloadActiveJSON] =
    useState(false);
  const [showSaveCohort, setShowSaveCohort] = useState(false);

  const handleBiospeciemenTSVDownload = () => {
    /** -- TODO:  Need to add once the API is updated -- **/
    /** --
    setBiospecimenDownloadActiveTSV(true);
    download({
      endpoint: "biospecimen_tar",
      method: "POST",
      dispatch,
      params: {
        filename: `biospecimen.project-${projectData.project_id}.${new Date()
          .toISOString()
          .slice(0, 10)}.tar.gz`,
        filters: {
          op: "in",
          content: {
            field: "cases.project.project_id",
            value: [projectData.project_id],
          },
        },
        size: projectData.summary?.case_count,
      },
      done: () => setBiospecimenDownloadActiveTSV(false),
    });
      --- */
  };

  const handleBiospeciemenJSONDownload = () => {
    /** -- TODO:  Need to add once the API is updated -- **/
    /* ---
    setBiospecimenDownloadActiveJSON(true);

    download({
      endpoint: "biospecimen_tar",
      method: "POST",
      dispatch,
      params: {
        format: "json",
        filename: `biospecimen.project-${projectData.project_id}.${new Date()
          .toISOString()
          .slice(0, 10)}.json`,
        filters: { mode: "and", root: {
            "cases.project.project_id": {
          operator: "in",
            field: "cases.project.project_id",
            operands:  [projectData.project_id],
          }},
        },
        size: projectData.summary?.case_count,
      },
      done: () => setBiospecimenDownloadActiveJSON(false),
    });
     */
  };

  const handleClinicalTSVDownload = () => {
/** -- TODO:  Need to add once the API is updated -- **/
/* ---
setClinicalDownloadActiveTSV(true);
download({
  endpoint: "clinical_tar",
  method: "POST",
  dispatch,
  params: {
    filename: `clinical.project-${projectData.project_id}.${new Date()
      .toISOString()
      .slice(0, 10)}.tar.gz`,
    filters: {
      op: "in",
      content: {
        field: "cases.project.project_id",
        value: [projectData.project_id],
      },
    },
    size: projectData.summary?.case_count,
  },
  done: () => setClinicalDownloadActiveTSV(false),
});
--- */
};

const handleClinicalJSONDownload = () => {
/** -- TODO:  Need to add once the API is updated -- **/
/* ---
setClinicalDownloadActiveJSON(true);
download({
  endpoint: "clinical_tar",
  method: "POST",
  dispatch,
  params: {
    format: "json",
    pretty: true,
    filename: `clinical.project-${projectData.project_id}.${new Date()
      .toISOString()
      .slice(0, 10)}.json`,
    filters: {
      op: "in",
      content: {
        field: "cases.project.project_id",
        value: [projectData.project_id],
      },
    },
    size: projectData.summary?.case_count,
  },
  done: () => setClinicalDownloadActiveJSON(false),
});
 */
};

const handleManifestDownload = () => {
/** -- TODO:  Need to add once the API is updated -- **/
/* ---
  setManifestDownloadActive(true);
download({
  endpoint: "files",
  method: "POST",
  dispatch,
  params: {
    filters: {
      op: "in",
      content: {
        field: "cases.project.project_id",
        value: [projectData.project_id],
      },
    },
    return_type: "manifest",
    size: 10000,
    filename: `gdc_manifest.${getFormattedTimestamp({
      includeTimes: true,
    })}.txt`,
  },
  done: () => setManifestDownloadActive(false),
});
--- */
};

return (
<div className="flex gap-2">
  <Tooltip
    label={`Save a new cohort of ${projectData.project_id} cases`}
    withArrow
  >
    <Button
      data-testid="button-save-new-cohort-project-summary"
      color="primary"
      variant="outline"
      className={`bg-base-max border-primary font-medium text-sm ${focusStyles}`}
      onClick={() => setShowSaveCohort(true)}
    >
      Save New Cohort
    </Button>
  </Tooltip>

  <DropdownWithIcon
    customTargetButtonDataTestId="button-biospecimen-project-summary"
    dropdownElements={[
      {
        title: "TSV",
        icon: biospecimenDownloadActiveTSV ? (
          <Loader size={16} />
        ) : (
          <DownloadIcon size={16} aria-label="download" />
        ),
        onClick: handleBiospeciemenTSVDownload,
        isLoading: biospecimenDownloadActiveTSV,
      },
      {
        title: "JSON",
        icon: biospecimenDownloadActiveJSON ? (
          <Loader size={16} />
        ) : (
          <DownloadIcon size={16} aria-label="download" />
        ),
        onClick: handleBiospeciemenJSONDownload,
        isLoading: biospecimenDownloadActiveJSON,
      },
    ]}
    TargetButtonChildren={
      <span className="font-medium text-sm">Biospecimen</span>
    }
    LeftSection={<DownloadIcon size="1rem" aria-label="download" />}
    closeOnItemClick={false}
  />
  <DropdownWithIcon
    customTargetButtonDataTestId="button-clinical-project-summary"
    dropdownElements={[
      {
        title: "TSV",
        icon: clinicalDownloadActiveTSV ? (
          <Loader size={16} />
        ) : (
          <DownloadIcon size={16} aria-label="download" />
        ),
        onClick: handleClinicalTSVDownload,
        isLoading: clinicalDownloadActiveTSV,
      },
      {
        title: "JSON",
        icon: clinicalDownloadActiveJSON ? (
          <Loader size={16} />
        ) : (
          <DownloadIcon size={16} aria-label="download" />
        ),
        onClick: handleClinicalJSONDownload,
        isLoading: clinicalDownloadActiveJSON,
      },
    ]}
    TargetButtonChildren={
      <span className="font-medium text-sm">Clinical</span>
    }
    LeftSection={<DownloadIcon size="1rem" aria-label="download" />}
    closeOnItemClick={false}
  />
  <Tooltip
    w={400}
    label={
      manifestDownloadActive
        ? ADDITIONAL_DOWNLOAD_MESSAGE
        : MANIFEST_DOWNLOAD_MESSAGE
    }
    arrowSize={10}
    position="bottom"
    multiline
    withArrow
  >
    <Button
      data-testid="button-manifest-project-summary"
      variant="outline"
      leftSection={
        manifestDownloadActive ? (
          <Loader size="1rem" />
        ) : (
          <DownloadIcon size="1rem" aria-label="download" />
        )
      }
      className={`text-primary bg-base-max border-primary hover:bg-primary-darkest hover:text-base-max ${focusStyles}`}
      classNames={{ label: "font-medium text-sm" }}
      onClick={handleManifestDownload}
    >
      Manifest
    </Button>
  </Tooltip>
</div>
);
}

export default SummaryHeaderControls;
