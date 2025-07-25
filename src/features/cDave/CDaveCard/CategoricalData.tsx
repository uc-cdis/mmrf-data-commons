import React, { useState, useMemo } from "react";
import { useDeepCompareEffect, useDeepCompareMemo } from "use-deep-compare";
import { Bucket } from "@/core/types";
import CDaveHistogram from "./CDaveHistogram";
import CDaveTable from "./CDaveTable";
import ClinicalSurvivalPlot from "./ClinicalSurvivalPlot";
import CardControls from "./CardControls";
import CategoricalBinningModal from "../CategoricalBinningModal";
import {
  CategoricalBins,
  ChartTypes,
  DisplayData,
  SelectedFacet,
  CustomInterval, NamedFromTo,
} from '../types';
import { MISSING_KEY, SURVIVAL_PLOT_MIN_COUNT } from "../constants";
import { flattenBinnedData } from "../utils";

interface CategoricalDataProps {
  initialData: ReadonlyArray<Bucket>;
  readonly field: string;
  readonly fieldName: string;
  readonly chartType: ChartTypes;
  readonly noData: boolean;
}

const CategoricalData: React.FC<CategoricalDataProps> = ({
  initialData,
  field,
  fieldName,
  chartType,
  noData,
}: CategoricalDataProps) => {
  const [customBinnedData, setCustomBinnedData] =
    useState< CategoricalBins |  NamedFromTo[] | CustomInterval | null>(null);
  const [binningModalOpen, setBinningModalOpen] = useState(false);
  const [selectedSurvivalPlots, setSelectedSurvivalPlots] = useState<string[]>(
    [],
  );
  const [selectedFacets, setSelectedFacets] = useState<SelectedFacet[]>([]);
  const [yTotal, setYTotal] = useState(0);

  const resultData = useMemo(
    () =>
      Object.fromEntries(
        (initialData || []).map((d) => [
          d.key === MISSING_KEY ? "missing" : d.key,
          d.count,
        ]),
      ),
    [initialData],
  );

  const displayedData: DisplayData = useDeepCompareMemo(
    () =>
      (customBinnedData !== null
        ? flattenBinnedData(customBinnedData as CategoricalBins)
        : (initialData || []).map(({ key, count }) => ({
            key,
            displayName: key === MISSING_KEY ? "missing" : key,
            count: count,
          }))
      ).sort((a, b) => b.count - a.count),
    [customBinnedData, initialData],
  );

  useDeepCompareEffect(() => {
    setSelectedSurvivalPlots(
      displayedData
        .filter(
          ({ key, count }) =>
            key !== MISSING_KEY && count >= SURVIVAL_PLOT_MIN_COUNT,
        )
        .sort((a, b) => b.count - a.count)
        .map(({ key }) => key)
        .slice(0, 2),
    );

    if (customBinnedData === null) {
      setYTotal(displayedData.reduce((a, b) => a + b.count, 0));
    }

    setSelectedFacets([]);
  }, [customBinnedData, displayedData]);

  return (
    <>
      <div className="flex-grow">
        {chartType === "histogram" ? (
          <CDaveHistogram
            field={field}
            data={displayedData}
            yTotal={yTotal}
            isFetching={false}
            noData={noData}
          />
        ) : (
          <ClinicalSurvivalPlot
            field={field}
            selectedSurvivalPlots={selectedSurvivalPlots}
            continuous={false}
            customBinnedData={customBinnedData}
          />
        )}
      </div>
      <CardControls
        continuous={false}
        field={field}
        fieldName={fieldName}
        displayedData={displayedData}
        yTotal={yTotal}
        setBinningModalOpen={setBinningModalOpen}
        customBinnedData={customBinnedData}
        setCustomBinnedData={setCustomBinnedData}
        selectedFacets={selectedFacets}
      />
      <CDaveTable
        field={field}
        fieldName={fieldName}
        displayedData={displayedData}
        yTotal={yTotal}
        hasCustomBins={customBinnedData !== null}
        survival={chartType === "survival"}
        selectedSurvivalPlots={selectedSurvivalPlots}
        setSelectedSurvivalPlots={setSelectedSurvivalPlots}
        selectedFacets={selectedFacets}
        setSelectedFacets={setSelectedFacets}
      />

      <CategoricalBinningModal
        opened={binningModalOpen}
        setModalOpen={setBinningModalOpen}
        field={fieldName}
        results={resultData}
        updateBins={setCustomBinnedData}
        customBins={customBinnedData as CategoricalBins}
      />
    </>
  );
};

export default CategoricalData;
