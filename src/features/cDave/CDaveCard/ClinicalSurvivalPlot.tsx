import React, { useState, useEffect } from "react";
import { Alert, LoadingOverlay } from "@mantine/core";
import {
  useCoreSelector,
  selectCurrentCohortFilters,
  convertFilterSetToGqlFilter as buildCohortGqlOperator,
  GQLFilter as GqlOperation,
} from "@gen3/core";
import {, useGetSurvivalPlotQuery } from '@/core/survival';
import { useIsDemoApp } from "@/hooks/useIsDemoApp";
import { SurvivalPlotTypes } from "@/features/charts/SurvivalPlot/types";
import { getFormattedTimestamp } from "@/utils/date";
import { isInterval, parseContinuousBucket } from "../utils";
import { CategoricalBins, CustomInterval, NamedFromTo } from "../types";
import { DEMO_COHORT_FILTERS } from "../constants";
import { ExternalDownloadStateSurvivalPlot } from "@/features/charts/SurvivalPlot/SurvivalPlot";
import { toDisplayName } from "../utils";



interface ClinicalSurvivalPlotProps {
  readonly field: string;
  readonly selectedSurvivalPlots: string[];
  readonly customBinnedData: CategoricalBins | NamedFromTo[] | CustomInterval;
  readonly continuous: boolean;
}

const ClinicalSurvivalPlot: React.FC<ClinicalSurvivalPlotProps> = ({
  field,
  selectedSurvivalPlots,
  customBinnedData,
  continuous,
}: ClinicalSurvivalPlotProps) => {
  const isDemoMode = useIsDemoApp();
  const [plotType, setPlotType] = useState<SurvivalPlotTypes | undefined>(undefined);
  const cohortFilters = useCoreSelector((state) =>
    buildCohortGqlOperator(
      isDemoMode ? DEMO_COHORT_FILTERS : selectCurrentCohortFilters(state),
    ),
  );

  useEffect(() => {
    if (selectedSurvivalPlots.length === 0) {
      setPlotType(SurvivalPlotTypes.overall);
    } else {
      if (continuous) {
        setPlotType(SurvivalPlotTypes.continuous);
      } else {
        setPlotType(SurvivalPlotTypes.categorical);
      }
    }
  }, [selectedSurvivalPlots, continuous]);

  const filters =
    selectedSurvivalPlots.length === 0
      ? cohortFilters && [cohortFilters]
      : selectedSurvivalPlots.map((value) => {
          const content = [];
          if (cohortFilters) {
            content.push(cohortFilters);
          }

          if (continuous) {
            if (
              customBinnedData !== null &&
              !isInterval(customBinnedData as NamedFromTo[] | CustomInterval)
            ) {
              const dataPoint = (customBinnedData as NamedFromTo[]).find(
                (bin) => bin.name === value,
              );

              if (dataPoint !== undefined) {
                content.push({
                  op: ">=",
                  content: { field, value: [dataPoint.from] },
                });

                content.push({
                  op: "<",
                  content: { field, value: [dataPoint.to] },
                });
              }
            } else {
              const [fromValue, toValue] = parseContinuousBucket(value);

              content.push({
                op: ">=",
                content: { field, value: [fromValue] },
              });

              content.push({
                op: "<",
                content: { field, value: [toValue] },
              });
            }
          } else {
            if (typeof customBinnedData?.[value as keyof typeof customBinnedData] === "object") {
              content.push({
                "=": { [field]: Object.keys(customBinnedData[value as keyof typeof customBinnedData]) }
              });
            } else {
              content.push({
                "=": { [field]: value },
              });
            }
          }

          return {
            "and" : content,
          } as GqlOperation;
        });

  const { data, isError, isFetching } = useGetSurvivalPlotQuery({
    filters,
  });

  return isError ? (
    <div className="h-64">
      <Alert color="red">Something&apos;s gone wrong</Alert>
    </div>
  ) : (
    <div className="relative">
      <LoadingOverlay data-testid="loading-spinner" visible={isFetching} />
      <ExternalDownloadStateSurvivalPlot
        data={data?? EmptySurivalPlot}
        height={150}
        title={toDisplayName(field)}
        showTitleOnlyOnDownload
        field={field}
        names={selectedSurvivalPlots}
        plotType={plotType}
        downloadFileName={`${field
          .split(".")
          .at(-1)}-survival-plot.${getFormattedTimestamp()}`}
        tableTooltip
      />
    </div>
  );
};

export default ClinicalSurvivalPlot;
