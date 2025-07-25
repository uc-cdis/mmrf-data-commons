import React, { useEffect, useRef, useContext } from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import saveAs from "file-saver";
import tw from "tailwind-styled-components";
import { Menu, Tooltip, ActionIcon, Button } from "@mantine/core";
import { useResizeObserver } from "@mantine/hooks";
import {
  FilterSet,
  useCoreSelector,
  convertFilterSetToGqlFilter as buildCohortGqlOperator,

} from '@gen3/core';
import { useGetCaseSsmsQuery } from "@/core/features/api"
import {   ClinicalContinuousStatsData } from '@/core/features/clinicalDataAnalysis';
import tailwindConfig from "tailwind.config";
import OffscreenWrapper from "@/components/OffscreenWrapper";
import { handleDownloadPNG, handleDownloadSVG } from "@/features/charts/utils";
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { DashboardDownloadContext } from "@/components/analysis";
import { joinFilters, selectCurrentCohortCaseFilters as selectCurrentCohortFilters } from "@/core/utils";
import { getFormattedTimestamp } from "@/utils/date";
import { COLOR_MAP, DEMO_COHORT_FILTERS, DATA_DIMENSIONS } from "../constants";
import {
  parseNestedQQResponseData,
  qnorm,
  roundContinuousValue,
  convertDataDimension,
} from "../utils";
import QQPlot from "./QQPlot";
import BoxPlot from "./BoxPlot";
import { DataDimension } from "../types";
import { DownloadIcon } from "@/utils/icons";

const LightTableRow = tw.tr`text-content text-sm font-content bg-base-max text-base-contrast-max`;
const DarkTableRow = tw.tr`text-content text-sm font-content bg-base-lightest text-base-contrast-lightest`;

interface BoxQQPlotProps {
  readonly field: string;
  readonly displayName: string;
  readonly data: ClinicalContinuousStatsData;
  readonly hasCustomBins: boolean;
  readonly dataDimension?: DataDimension;
}

const BoxQQSection: React.FC<BoxQQPlotProps> = ({
  field,
  displayName,
  data,
  hasCustomBins,
  dataDimension,
}: BoxQQPlotProps) => {
  // Field examples: diagnoses.age_at_diagnosis, diagnoses.treatments.days_to_treatment_start
  const [clinicalType, clinicalField, clinicalNestedField] = field.split(".");
  const [boxPlotRef, boundingRectBox] = useResizeObserver();
  const [qqPlotRef, boundingRectQQ] = useResizeObserver();

  const { dispatch } = useContext(DashboardDownloadContext);
  const boxDownloadChartRef = useRef<HTMLElement>(null!);
  const qqDownloadChartRef = useRef<HTMLElement>(null!);
  const fieldName = clinicalNestedField ?? clinicalField;
  const date = getFormattedTimestamp();
  const boxPlotDownloadName = `${fieldName}-box-plot-${date}`;
  const qqPlotDownloadName = `${fieldName}-qq-plot-${date}`;

  const field_type = clinicalNestedField ? clinicalField : clinicalType;
  const variant =
    field_type === "other_clinical_attributes" ? "darker" : "DEFAULT";
  const color =
    tailwindConfig.theme.extend.colors[COLOR_MAP[field_type]]?.[variant];

  const originalDataDimension = DATA_DIMENSIONS[field]?.unit;

  const formattedData = {
    min: roundContinuousValue(
      convertDataDimension(data.min, originalDataDimension, dataDimension),
      field,
      hasCustomBins,
    ),
    max: roundContinuousValue(
      convertDataDimension(data.max, originalDataDimension, dataDimension),
      field,
      hasCustomBins,
    ),
    mean: roundContinuousValue(
      convertDataDimension(data.mean, originalDataDimension, dataDimension),
      field,
      hasCustomBins,
    ),
    median: roundContinuousValue(
      convertDataDimension(data.median, originalDataDimension, dataDimension),
      field,
      hasCustomBins,
    ),
    q1: roundContinuousValue(
      convertDataDimension(data.q1, originalDataDimension, dataDimension),
      field,
      hasCustomBins,
    ),
    q3: roundContinuousValue(
      convertDataDimension(data.q3, originalDataDimension, dataDimension),
      field,
      hasCustomBins,
    ),
    std_dev: roundContinuousValue(
      convertDataDimension(data.std_dev, originalDataDimension, dataDimension),
      field,
      hasCustomBins,
    ),
    iqr: roundContinuousValue(
      convertDataDimension(data.iqr, originalDataDimension, dataDimension),
      field,
      hasCustomBins,
    ),
  };

  const missingFilter: FilterSet = {
    root: {
      [`cases.${field}`]: {
        field: `cases.${field}`,
        operator: "exists",
        operand: "cases.${field}"
      },
    },
    mode: "and",
  };

  const isDemoMode = useIsDemoApp();
  const cohortFilters = useCoreSelector((state) =>
    isDemoMode ? DEMO_COHORT_FILTERS : selectCurrentCohortFilters(state),
  );

  const {
    data: qqData,
    isLoading,
    isSuccess,
  } = useGetCaseSsmsQuery({
    request: {
      fields: [field],
      filters: buildCohortGqlOperator(
        joinFilters(missingFilter, cohortFilters),
      ),
      size: 10000,
    },
  });

  const parsedQQValues = useDeepCompareMemo(
    () => (isSuccess ? parseNestedQQResponseData(qqData?.hits, field) : []),
    [qqData, isSuccess, field],
  );
  const formattedQQValues = useDeepCompareMemo(
    () =>
      parsedQQValues.map((caseEntry, i) => ({
        id: caseEntry.id,
        x: qnorm((i + 1 - 0.5) / parsedQQValues.length),
        y: convertDataDimension(
          caseEntry.value,
          originalDataDimension,
          dataDimension,
        ),
      })),
    [parsedQQValues, dataDimension, originalDataDimension],
  );
  const downloadData = formattedQQValues.map((caseEntry) => ({
    id: caseEntry.id,
    "Sample Quantile": caseEntry.y,
    "Theoretical Normal Quantile": caseEntry.x,
  }));

  const downloadTSVFile = () => {
    const header = ["id", "Sample Quantile", "Theoretical Normal Quantile"];
    const body = formattedQQValues.map((d) => [d.id, d.x, d.y].join("\t"));
    const tsv = [header.join("\t"), body.join("\n")].join("\n");

    saveAs(
      new Blob([tsv], {
        type: "text/tsv",
      }),
      `${qqPlotDownloadName}.tsv`,
    );
  };

  const downloadTableTSVFile = () => {
    const header = ["Statistics", dataDimension || "Quantities"];
    const body = [
      ["Minimum", formattedData.min].join("\t"),
      ["Maximum", formattedData.max].join("\t"),
      ["Mean", formattedData.mean].join("\t"),
      ["Median", formattedData.median].join("\t"),
      ["Q1", formattedData.q1].join("\t"),
      ["Q3", formattedData.q3].join("\t"),
      ["Standard Deviation", formattedData.std_dev].join("\t"),
      ["IQR", formattedData.iqr].join("\t"),
    ];
    const tsv = [header.join("\t"), body.join("\n")].join("\n");

    saveAs(
      new Blob([tsv], {
        type: "text/tsv",
      }),
      `${fieldName}-statistics-${date}.tsv`,
    );
  };

  useEffect(() => {
    const charts = [
      { filename: boxPlotDownloadName, chartRef: boxDownloadChartRef },
      { filename: qqPlotDownloadName, chartRef: qqDownloadChartRef },
    ];
    dispatch({ type: "add", payload: charts });
    return () => dispatch({ type: "remove", payload: charts });
  }, [
    boxDownloadChartRef,
    qqDownloadChartRef,
    boxPlotDownloadName,
    qqPlotDownloadName,
    dispatch,
  ]);

  return (
    <>
      <div className="flex justify-end">
        <Menu closeOnItemClick={false}>
          <Menu.Target>
            <Tooltip
              label="Download image or data"
              withArrow
              withinPortal
              position={"left"}
            >
              <ActionIcon
                data-testid="button-qq-box-download"
                variant="outline"
                className="bg-base-max border-primary disabled:border-base-contrast-lightest disabled:bg-base-light"
                aria-label="Download image or data"
                disabled={isLoading}
              >
                <DownloadIcon
                  className={
                    isLoading ? "text-base-contrast-lightest" : "text-primary"
                  }
                />
              </ActionIcon>
            </Tooltip>
          </Menu.Target>

          <Menu.Dropdown data-testid="dropdown-menu-options">
            <Menu.Item
              onClick={async () => {
                Promise.all([
                  handleDownloadSVG(
                    boxDownloadChartRef,
                    `${boxPlotDownloadName}.svg`,
                  ),
                  handleDownloadSVG(
                    qqDownloadChartRef,
                    `${qqPlotDownloadName}.svg`,
                  ),
                ]);
              }}
            >
              SVG
            </Menu.Item>
            <Menu.Item
              onClick={async () => {
                Promise.all([
                  handleDownloadPNG(
                    boxDownloadChartRef,
                    `${boxPlotDownloadName}.png`,
                  ),
                  handleDownloadPNG(
                    qqDownloadChartRef,
                    `${qqPlotDownloadName}.png`,
                  ),
                ]);
              }}
            >
              PNG
            </Menu.Item>
            <Menu.Item
              component="a"
              href={`data:text/json;charset=utf-8, ${encodeURIComponent(
                JSON.stringify(downloadData, null, 2),
              )}`}
              download={`${qqPlotDownloadName}.json`}
            >
              QQ JSON
            </Menu.Item>
            <Menu.Item onClick={downloadTSVFile}>QQ TSV</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <div className="flex flex-row">
        <div className="w-full h-72 basis-1/3" ref={boxPlotRef}>
          <BoxPlot
            data={formattedData}
            field={displayName}
            color={color}
            width={boundingRectBox.width}
            height={boundingRectBox.height}
          />
        </div>
        <div className="w-full h-72 basis-2/3 overflow-hidden" ref={qqPlotRef}>
          <QQPlot
            chartValues={formattedQQValues}
            field={displayName}
            isLoading={isLoading}
            color={color}
            width={boundingRectQQ.width}
            height={boundingRectQQ.height}
          />
        </div>
        <OffscreenWrapper>
          <BoxPlot
            data={formattedData}
            field={displayName}
            color={color}
            width={boundingRectBox.width}
            height={boundingRectBox.height}
            chartRef={boxDownloadChartRef}
            label={[displayName, "Box Plot"]}
            chartPadding={{ left: 60, right: 60, bottom: 40, top: 50 }}
          />
        </OffscreenWrapper>
        <OffscreenWrapper>
          <QQPlot
            chartValues={formattedQQValues}
            field={displayName}
            isLoading={isLoading}
            color={color}
            chartRef={qqDownloadChartRef}
            label={`${displayName} QQ Plot`}
            width={boundingRectQQ.width}
            height={boundingRectQQ.height}
          />
        </OffscreenWrapper>
      </div>
      <Button
        data-testid="button-tsv-cdave-card"
        className="bg-base-max text-primary border-primary mb-2 w-fit"
        onClick={downloadTableTSVFile}
      >
        TSV
      </Button>
      <div className="min-h-44 block overflow-auto w-full relative border-base-light border-1">
        <table
          data-testid="table-card"
          className="border-separate border-spacing-0 w-full text-left text-base-contrast-min mb-2 table-auto"
        >
          <thead className="bg-base-max font-heading text-sm text-base-contrast-max z-10">
            <tr>
              <th className="bg-base-max sticky top-0 border-b-4 border-max z-10 border-t-1 pl-1">
                Statistics
              </th>
              <th className="bg-base-max sticky top-0 border-b-4 border-max z-10 border-t-1">
                {dataDimension || "Quantities"}
              </th>
            </tr>
          </thead>
          <tbody>
            <LightTableRow>
              <td className="pl-1">Minimum</td>
              <td>{formattedData.min.toLocaleString()}</td>
            </LightTableRow>
            <DarkTableRow>
              <td className="pl-1">Maximum</td>
              <td>{formattedData.max.toLocaleString()}</td>
            </DarkTableRow>
            <LightTableRow>
              <td className="pl-1">Mean</td>
              <td>{formattedData.mean.toLocaleString()}</td>
            </LightTableRow>
            <DarkTableRow>
              <td className="pl-1">Median</td>
              <td>{formattedData.median.toLocaleString()}</td>
            </DarkTableRow>
            <LightTableRow>
              <td className="pl-1">Q1</td>
              <td>{formattedData.q1.toLocaleString()}</td>
            </LightTableRow>
            <DarkTableRow>
              <td className="pl-1">Q3</td>
              <td>{formattedData.q3.toLocaleString()}</td>
            </DarkTableRow>
            <LightTableRow>
              <td className="pl-1">Standard Deviation</td>
              <td>{formattedData.std_dev.toLocaleString()}</td>
            </LightTableRow>
            <DarkTableRow>
              <td className="pl-1">IQR</td>
              <td>{formattedData.iqr.toLocaleString()}</td>
            </DarkTableRow>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BoxQQSection;
