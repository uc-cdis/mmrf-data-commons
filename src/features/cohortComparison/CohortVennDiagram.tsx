import React from "react";
import dynamic from "next/dynamic";
import {
  FilterSet,
} from "@gen3/core";
import makeIntersectionFilters from "./makeIntersectionFilters";
import { LoadingOverlay } from "@mantine/core";
import { useDeepCompareMemo } from "use-deep-compare";
import { buildCohortGqlOperator } from "@/core/utils";
import { useVennDiagramQuery } from '@/core/features/cohortComparison';

const VennDiagram = dynamic(() => import("@/features/charts/VennDiagram"), {
  ssr: false,
});

interface CohortVennDiagramProps {
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
  readonly caseSetIds?: string[];
  readonly isLoading: boolean;
}

const DEFAULT_CHART_DATA = [
  { key: "S1_minus_S2", value: "...", highlighted: false },
  { key: "S2_minus_S1", value: "...", highlighted: false },
  { key: "S1_intersect_S2", value: "...", highlighted: false },
];

export const LABELS = ["S₁", "S₂"];

const CohortVennDiagram: React.FC<CohortVennDiagramProps> = ({
  cohorts,
  caseSetIds,
  isLoading: externalLoading,
}: CohortVennDiagramProps) => {
  const filters = useDeepCompareMemo(
    () =>
      makeIntersectionFilters(
        buildCohortGqlOperator(cohorts?.primary_cohort.filter),
        buildCohortGqlOperator(cohorts?.comparison_cohort.filter),

      ),
    [cohorts, caseSetIds],
  );

  const { data, isLoading: dataLoading } = useVennDiagramQuery({
    set1Filters: filters.cohort1,
    set2Filters: filters.cohort2,
    index: "case_centric"
  });

  const isLoading = externalLoading || dataLoading;

  const chartData = useDeepCompareMemo(() => {
    if (isLoading || !data) return DEFAULT_CHART_DATA;

    return [
      {
        key: "S1_minus_S2",
        value: data.set1 || 0,
        highlighted: false,
      },
      {
        key: "S2_minus_S1",
        value: data.set2 || 0,
        highlighted: false,
      },
      {
        key: "S1_intersect_S2",
        value: data.intersection || 0,
        highlighted: false,
      },
    ];
  }, [isLoading, data]);

  return (
    <div className="relative max-w-[400px] 2xl:max-w-[600px] w-full mx-auto">
      <LoadingOverlay visible={isLoading} zIndex={1} />
      <VennDiagram
        chartData={chartData}
        labels={LABELS}
        ariaLabel="The Venn diagram displays the number of cases shared between the cohorts."
        interactable={false}
      />
    </div>
  );
};

export default CohortVennDiagram;
