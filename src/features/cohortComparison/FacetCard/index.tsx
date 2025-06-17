import React from "react";
import { Paper } from "@mantine/core";
import saveAs from "file-saver";
import { Bucket, EmptyFilterSet } from "@/core";
import { calculatePercentageAsNumber, humanify } from "@/core/utils";
import BarChart from "../../charts/BarChart";
import FunctionButton from "@/components/FunctionButton";
import PValue from "../PValue";
import CohortCreationButton from "@/components/CohortCreationButton";
import { CohortComparisonType } from "../types";
import { useDeepCompareMemo } from "use-deep-compare";
import { createFilters, formatBucket } from "./utils";

interface FacetCardProps {
  readonly data: { buckets: Bucket[] }[];
  readonly field: string;
  readonly counts: number[];
  readonly cohorts: CohortComparisonType;
}

export const FacetCard: React.FC<FacetCardProps> = ({
  data,
  field,
  counts,
  cohorts,
}: FacetCardProps) => {
  const divId = `cohort_comparison_bar_chart_${field}`;
  const fieldLabel = humanify({ term: field });

  let formattedData = useDeepCompareMemo(
    () =>
      data.map((cohort) => {
        const formattedCohort = cohort.buckets.map((facet : any) => {
          return {
            key: formatBucket(facet.key, field),
            count: facet.doc_count, // TODO change to match Gen3 APIs
            filter: createFilters(field, facet.key),
          };
        });

        return formattedCohort;
      }),
    [data, field],
  );

  const uniqueValues = useDeepCompareMemo(
    () =>
      Array.from(
        new Set(formattedData.flatMap((cohort) => cohort.map((b) => b.key))),
      ),
    [formattedData],
  );

  if (field === "diagnoses.age_at_diagnosis") {
    uniqueValues.sort();
  }

  formattedData = formattedData.map((cohort) =>
    uniqueValues.map((value) => {
      const dataPoint = cohort.find((d) => d.key === value);
      if (dataPoint) {
        return dataPoint;
      }
      return { key: value, count: -1, filter: EmptyFilterSet };
    }),
  );

  const barChartData = formattedData.map((cohort, idx) => ({
    x: cohort.map((facet) => facet.key),
    y: cohort.map((facet) => (facet.count / counts[idx]) * 100),
    customdata: cohort.map((facet) => facet.count),
    hovertemplate: `<b>${
      cohorts[idx === 0 ? "primary_cohort" : "comparison_cohort"]?.name
    }</b><br /> %{y:.0f}% Cases (%{customdata:,})<extra></extra>`,
    marker: {
      color: idx === 0 ? "#1F77B4" : "#BD5800",
    },
  }));

  const downloadTSVFile = () => {
    const header = [
      `${fieldLabel}`,
      "# Cases S1",
      "% Cases S1",
      "# Cases S2",
      "% Cases S2",
    ];

    const body = uniqueValues.map((key, index) =>
      [
        key,
        ...formattedData
          .map((sub, idx) => [
            sub[index].count ?? 0,
            calculatePercentageAsNumber(sub[index].count, counts[idx]),
          ])
          .flat(),
      ].join("\t"),
    );

    const tsv = [header.join("\t"), body.join("\n")].join("\n");

    saveAs(
      new Blob([tsv], {
        type: "text/tsv",
      }),
      `${fieldLabel}-comparison.tsv`,
    );
  };

  return (
    <Paper
      data-testid={`card-${fieldLabel}-cohort-comparison`}
      p="md"
      shadow="xs"
    >
      <div className="flex flex-col">
        <h2 className="font-heading text-lg font-semibold">{fieldLabel}</h2>
        <div className="h-[400px]">
          <BarChart
            data={{
              yAxisTitle: "% Cases",
              datasets: barChartData,
            }}
            divId={divId}
          />
        </div>
        <div className="mb-3 self-end">
          <FunctionButton
            data-testid="button-tsv-cohort-comparison"
            onClick={downloadTSVFile}
            aria-label="Download TSV File"
          >
            TSV
          </FunctionButton>
        </div>
        <table
          data-testid="table-analysis-cohort-comparison"
          className="bg-base-max w-full text-left text-base-contrast-max border-base-light border-1"
        >
          <thead>
            <tr className="bg-base-max border-b-base-light border-b-2 font-heading text-bold">
              <th className="pl-2">{fieldLabel}</th>
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
          <tbody className="font-content text-sm text-semibold">
            {uniqueValues.map((value, idx) => {
              const cohort1Value = formattedData[0][idx].count;
              const cohort2Value = formattedData[1][idx].count;
              return (
                <tr
                  className={idx % 2 ? undefined : "bg-base-lightest"}
                  key={`${field}_${value}`}
                >
                  <td data-testid={`text-analysis-${value}`} className="pl-2">
                    {value}
                  </td>
                  <td>
                    <CohortCreationButton
                      numCases={cohort1Value}
                      label={cohort1Value?.toLocaleString() || "--"}
                    />
                  </td>
                  <td>
                    {(((cohort1Value || 0) / counts[0]) * 100).toFixed(2)} %
                  </td>
                  <td>
                    <CohortCreationButton
                      numCases={cohort2Value}
                      label={cohort2Value?.toLocaleString() || "--"}
                    />
                  </td>
                  <td>
                    {(((cohort2Value || 0) / counts[1]) * 100).toFixed(2)} %
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-2 cursor-default self-end">
          {formattedData.length > 0 && <PValue data={formattedData} />}
        </div>
      </div>
    </Paper>
  );
};

export default FacetCard;
