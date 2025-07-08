import React, { useContext } from "react";
import { handleDownloadPNG, handleDownloadSVG } from "@/features/charts/utils";
import { DropdownWithIcon } from "@gen3/frontend";
import { DashboardDownloadContext } from "@/components/analysis";
import { DownloadIcon } from "@/utils/icons";

const DownloadAllButton: React.FC = () => {
  const { state } = useContext(DashboardDownloadContext);
  const downloadAllSvg = () => {
    state.map((download) => {
      handleDownloadSVG(download.chartRef, `${download.filename}.svg`);
    });
  };

  const downloadAllPng = () => {
    state.map((download) => {
      handleDownloadPNG(download.chartRef, `${download.filename}.png`);
    });
  };

  return (
    <DropdownWithIcon
      dropdownElements={[
        { title: "SVG", onClick: downloadAllSvg },
        { title: "PNG", onClick: downloadAllPng },
      ]}
      TargetButtonChildren={"Download All Images"}
      LeftSection={<DownloadIcon aria-hidden="true" size="1rem" />}
      closeOnItemClick={false}
    />
  );
};

export default DownloadAllButton;
