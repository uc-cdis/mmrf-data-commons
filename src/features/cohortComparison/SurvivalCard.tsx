import React from "react";
import { Alert, LoadingOverlay, Paper, Tooltip } from "@mantine/core";
import { EmptyFilterSet, FilterSet } from '@gen3/core';
import {
  buildCohortGqlOperator,
} from "@/core/utils";
import { GqlOperation } from "@/core/types";
import { GqlIntersection } from "./types";
import SurvivalPlot from "../charts/SurvivalPlot/SurvivalPlot";
import makeIntersectionFilters from "./makeIntersectionFilters";
import CohortCreationButton from "@/components/CohortCreationButton";
import { SurvivalPlotTypes } from "../charts/SurvivalPlot/types";
import { useDeepCompareEffect } from "use-deep-compare";
import { EmptySurvivalPlot } from "@/core/features/survival/types";
import { useGetComparisonSurvivalPlotQuery } from '@/core/features/survival/survivalApiSlice';
import { CASE_CENTRIC_INDEX, COHORT_FILTER_INDEX } from '@/core';

const survivalDataCompletenessFilters: GqlOperation[] = [
  {
    "or": [
      {
       "and": [
          {
            ">": { field: "demographic.days_to_birth", value: 0}
          },
        ],
      },
      {
        "and": [
          {
            ">" : { field: "diagnoses.days_to_death", value: 0}
          },
        ],
      },
    ],
  },
  // TODO figure out how to have guppy support NOT in filters
  // {
  //   "not" : "demographic.vital_status" ,
  // }
];

export const makeSurvivalCaseFilters = (
  primaryCohortCaseIds: string[],
  comparisonCohortCaseIds: string[],
): GqlIntersection => ({
  and: [
    ...survivalDataCompletenessFilters,
    {
      and: [
        {
          "in" : { "cases.case_id" : primaryCohortCaseIds },
        },
        {
          "excludeifany": { "cases.case_id" : comparisonCohortCaseIds }
        },
      ],
    },
  ],
});

const tooltipLabel = (
  <>
    <p>
      Criteria for including a case from your cohorts in the survival analysis:
    </p>
    <p>- the case is in only one of your cohorts, not both</p>
    <p>- the case has the required data for the analysis</p>
  </>
);

interface SurvivalCardProps {
  readonly counts: number[];
  readonly cohorts?: {
    primary_cohort: {
      filter: FilterSet;
      name: string;
    };
    comparison_cohort: {
      filter: FilterSet;
      name: string;
    };
  };
  readonly setSurvivalPlotSelectable: (selectable: boolean) => void;
  readonly caseSetIds?: [string[], string[]]; // set of case id for primary and comparison cohorts
  readonly isSetsloading: boolean;
}

const SurvivalCard: React.FC<SurvivalCardProps> = ({
  counts,
  cohorts,
  setSurvivalPlotSelectable,
  isSetsloading,
}: SurvivalCardProps) => {
  const filters = makeIntersectionFilters(
    buildCohortGqlOperator(cohorts?.primary_cohort.filter),
    buildCohortGqlOperator(cohorts?.comparison_cohort.filter),

  );
  const { data, isUninitialized, isFetching, isError } =
    useGetComparisonSurvivalPlotQuery({
      filters: [filters.cohort1, filters.cohort2],
      index: CASE_CENTRIC_INDEX,
      field: 'case_id',
    });

  useDeepCompareEffect(() => {
    setSurvivalPlotSelectable(data?.survivalData.length !== 0);
  }, [data, setSurvivalPlotSelectable]);

  const cohort1Count = data?.survivalData[0]
    ? data.survivalData[0].donors?.length
    : 0;
  const cohort2Count = data?.survivalData[1]
    ? data.survivalData[1].donors?.length
    : 0;

  const isLoading = isSetsloading || isFetching || isUninitialized;

  return (
    <Paper data-testid="card-analysis-survival-cohort-comparison" p="md">
      <h2 className="font-heading text-lg font-semibold">Survival Analysis</h2>
      {data?.survivalData.length === 0 ? (
        <div className="p-1">
          No Survival data available for this Cohort Comparison
        </div>
      ) : (
        <>
          {isError ? (
            <Alert>Something`s gone wrong</Alert>
          ) : (
            <div className="relative">
              <LoadingOverlay
                visible={isLoading}
                zIndex={0}
                data-testid="loading-spinner"
              />
              <SurvivalPlot
                plotType={SurvivalPlotTypes.cohortComparison}
                data={isLoading ? EmptySurvivalPlot : data ?? EmptySurvivalPlot}
                noDataMessage="No Survival data available for this Cohort Comparison"
                isLoading={isLoading}
                names={[cohorts?.primary_cohort?.name || '', cohorts?.comparison_cohort?.name || '']}
              />
            </div>
          )}
          <div className="font-heading mt-[1.5rem]">
            <table className="bg-base-max w-full text-left text-base-contrast-max border-base-light border-1">
              <thead>
                <tr className="bg-base-lightest border-b-base-light border-b-2">
                  <th>
                    <Tooltip label={tooltipLabel}>
                      <span className="underline decoration-dashed pl-2">
                        Cases included in Analysis
                      </span>
                    </Tooltip>
                  </th>
                  <th>
                    # Cases S<sub>1</sub>
                  </th>
                  <th>
                    % Cases S<sub>1</sub>
                  </th>
                  <th>
                    # Cases S<sub>2</sub>
                  </th>
                  <th>
                    % Cases S<sub>2</sub>
                  </th>
                </tr>
              </thead>
              <tbody
                data-testid="text-analysis-overall survival analysis"
                className="font-content text-md"
              >
                <tr>
                  <td className="pl-2">Overall Survival Analysis</td>
                  <td>
                    {isLoading ? (
                      "..."
                    ) : (
                      <CohortCreationButton
                        numCases={cohort1Count}
                        label={cohort1Count.toLocaleString()}
                        caseFilter={EmptyFilterSet}
                        filter={EmptyFilterSet}
                       // filtersCallback={generatePrimaryFilters} // TODO: add this back in when we have a way to create a case set from filters
                      />
                    )}
                  </td>
                  <td>
                    {isLoading
                      ? "..."
                      : `${((cohort1Count / counts[0]) * 100).toFixed(0)}%`}
                  </td>
                  <td>
                    {isLoading ? (
                      "..."
                    ) : (
                      <CohortCreationButton
                        numCases={cohort2Count}
                        label={cohort2Count.toLocaleString()}
                        caseFilter={EmptyFilterSet}
                        filter={EmptyFilterSet}
                        //  filtersCallback={generateComparisonFilters} // TODO : add this back in when we have a way to create a case set from filters
                      />
                    )}
                  </td>
                  <td>
                    {isLoading
                      ? "..."
                      : `${((cohort2Count / counts[1]) * 100).toFixed(0)}%`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </Paper>
  );
};

export default SurvivalCard;
