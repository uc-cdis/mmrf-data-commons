import React from "react";
import { Button, Tooltip } from "@mantine/core";
import { modals } from "@mantine/modals";
import { UploadIcon } from "@/utils/icons";

const CohortImportButton: React.FC = () => {
  const updateFilters = (facetField: string, outputIds: string[]) => {
    modals.openContextModal({
      modal: "saveCohortModal",
      title: "Save Cohort",
      size: "md",
      zIndex: 1200,
      styles: {
        header: {
          marginLeft: "16px",
        },
      },
      innerProps: {
        facetField,
        outputIds,
      },
    });
  };

  const handleImport = () => {
    modals.openContextModal({
      modal: "filterByUserInputModal",
      title: "Import a New Cohort",
      size: "xl",
      zIndex: 1200,
      styles: {
        header: {
          marginLeft: "16px",
        },
      },
      innerProps: {
        userInputProps: {
          inputInstructions:
            "Enter one or more case identifiers in the field below or upload a file to import a new cohort.",
          textInputPlaceholder:
            "e.g. TCGA-DD-AAVP, TCGA-DD-AAVP-10A-01D-A40U-10, 0004d251-3f70-4395-b175-c94c2f5b1b81",
          entityType: "cases",
          entityLabel: "case",
          identifierToolTip: (
            <div>
              <p>
                - Case identifiers accepted: Case UUID, Case ID, Sample UUID,
                Sample ID, Portion UUID, Portion ID,
                <p>
                  Slide UUID, Slide ID, Analyte UUID, Analyte ID, Aliquot UUID,
                  Aliquot ID
                </p>
              </p>
              <p>
                - Delimiters between case identifiers: comma, space, tab or 1
                case identifier per line
              </p>
              <p>- File formats accepted: .txt, .csv, .tsv</p>
            </div>
          ),
        },
        updateFilters,
        type: "cases",
      },
    });
  };

  return (
    <Tooltip label="Import Cohort" position="bottom" withArrow>
      <Button
        size="compact-md"
        data-testid="uploadButton"
        aria-label="Upload cohort"
        variant="action"
        onClick={handleImport}
      >
        <UploadIcon size="1.5em" aria-hidden="true" />
      </Button>
    </Tooltip>
  );
};

export default CohortImportButton;
