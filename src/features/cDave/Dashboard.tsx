import React, { useEffect, useRef } from "react";
import { Grid, Alert, Loader } from "@mantine/core";
import {
  GQLFilter as GqlOperation,
  usePrevious,
} from "@gen3/core";
//import { useGetSurvivalPlotQuery } from "@/core/survival";
import { useGetSurvivalPlotQuery} from './mockedHooks';
import { EmptySurvivalPlot } from "@/core/survival/types";

import {   Buckets,
  Stats} from '@/core/features/api/types'

import { getFormattedTimestamp } from "@/utils/date";
import SurvivalPlot from "../charts/SurvivalPlot/SurvivalPlot";
import CDaveCard from "./CDaveCard/CDaveCard";
import { useDeepCompareMemo } from "use-deep-compare";
import { SurvivalPlotTypes } from "../charts/SurvivalPlot/types";

interface DashboardProps {
  readonly cohortFilters: GqlOperation;
  readonly activeFields: string[];
  readonly results: Record<string, Buckets | Stats>;
  readonly updateFields: (field: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  cohortFilters,
  activeFields,
  results,
  updateFields,
}: DashboardProps) => {
  const initialDashboardRender = useRef(true);
  const lastDashboardRender = usePrevious(initialDashboardRender);
  const filters = useDeepCompareMemo(
    () => cohortFilters && [cohortFilters],
    [cohortFilters],
  );
  const {
    data: survivalData,
    isError,
    isFetching,
    isUninitialized,
  } = useGetSurvivalPlotQuery({
    filters,
  });

  useEffect(() => {
    if (lastDashboardRender) {
      initialDashboardRender.current = false;
    }
  });

  return (
    <Grid gutter={24} overflow="hidden" className="flex-grow">
      <Grid.Col span={{ base: 12, lg: 6 }}>
        <div
          data-testid="overall-survival-plot"
          className="h-full border-1 border-base-lighter p-4"
        >
          {isError ? (
            <Alert>Something&pos;s gone wrong</Alert>
          ) : isFetching || isUninitialized ? (
            <Loader />
          ) : (
            <SurvivalPlot
              data={survivalData ?? EmptySurvivalPlot}
              title="Overall Survival"
              plotType={SurvivalPlotTypes.overall}
              downloadFileName={`overall-survival-plot.${getFormattedTimestamp()}`}
            />
          )}
        </div>
      </Grid.Col>
      {activeFields.map((field) => {
        return (
          <Grid.Col span={{ base: 12, lg: 6 }} key={field}>
            <CDaveCard
              field={field}
              data={results[field]}
              updateFields={updateFields}
              initialDashboardRender={initialDashboardRender.current}
              cohortFilters={cohortFilters}
            />
          </Grid.Col>
        );
      })}
    </Grid>
  );
};

export default Dashboard;
