import React from "react";
import CohortImportButton from "./CohortImportButton";
import CohortExportButton from "./CohortExportButton";

export const getCustomCohortButtons = () => [
  <CohortImportButton key="import" />,
  <CohortExportButton key="export" />,
];
