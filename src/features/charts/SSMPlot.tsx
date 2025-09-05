import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSsmPlotQuery } from '@/core/features/cancerDistribution';
import ChartTitleBar from './ChartTitleBar';
import { CountSpan } from '@/components/tailwindComponents';
import BarChartTextVersion from './BarChartTextVersion';
import { PlotMouseEvent } from 'plotly.js';
import { FilterSet,  EmptyFilterSet } from '@gen3/core';

const BarChart = dynamic(() => import('./BarChart'), {
  ssr: false,
});

const CHART_NAME = 'cancer-distribution-bar-chart-ssm';

interface SSMPlotProps {
  readonly page: 'gene' | 'ssms';
  readonly gene?: string;
  readonly ssms?: string;
  readonly height?: number;
  readonly genomicFilters?: FilterSet;
  readonly cohortFilters?: FilterSet;
}

const SSMPlot: React.FC<SSMPlotProps> = ({
  page,
  gene,
  ssms,
  height = undefined,
  genomicFilters = EmptyFilterSet,
  cohortFilters = EmptyFilterSet,
}: SSMPlotProps) => {
  const router = useRouter();

  const { data, error, isUninitialized, isFetching, isError } = useSsmPlotQuery(
    {
      gene: gene ?? '',
      ssms: ssms ?? '',
      cohortFilters: cohortFilters ?? EmptyFilterSet,
      genomicFilters: genomicFilters ?? EmptyFilterSet,
    },
  );

  if (isUninitialized) {
    return <div>Initializing chart...</div>;
  }

  if (isFetching) {
    return <div>Fetching chart...</div>;
  }

  if (isError) {
    const message = 'An error occurred';
    return (
      <div>
        Failed to fetch chart:{' '}
        {message}
      </div>
    );
  }

  if (!data || data?.cases?.length < 5) {
    return null;
  }

  interface dataCase {
    ssmCount: number;
    project: string;
    totalCount: number;
    percent?: number;
  }
  const sortedData = data.cases
    .map((d: dataCase) => ({
      ...d,
      percent: (d.ssmCount / d.totalCount) * 100,
    }))
    .sort((a: dataCase, b: dataCase) =>
      (a.percent as number) < (b.percent as number) ? 1 : -1,
    )
    .slice(0, 20);

  const caseCount = (
    <CountSpan>
      {data.cases
        .map((d: dataCase) => d.ssmCount)
        .reduce((a: number, b: number) => a + b, 0)
        .toLocaleString()}
    </CountSpan>
  );

  const ssmCount = <CountSpan>{data.ssmCount.toLocaleString()}</CountSpan>;
  const projectCount = (
    <CountSpan>{data.cases.length.toLocaleString()}</CountSpan>
  );

  const title =
    page === 'gene' ? (
      <span>
        {caseCount} CASES AFFECTED BY {ssmCount} MUTATIONS ACROSS {projectCount}{' '}
        PROJECTS
      </span>
    ) : (
      <span>
        THIS MUTATION AFFECTS {caseCount} CASES ACROSS {projectCount} PROJECTS
      </span>
    );

  const chartData = {
    datasets: [
      {
        x: sortedData.map((d: dataCase) => d.project),
        y: sortedData.map((d: dataCase) => d.percent),
        customdata: sortedData.map((d: dataCase) => [d.ssmCount, d.totalCount]),
        hovertemplate:
          '%{customdata[0]} Cases Affected in <b>%{x}</b><br />%{customdata[0]} / %{customdata[1]} (%{y:.2f}%)  <extra></extra>',
      },
    ],
    yAxisTitle: '% of Cases Affected',
  };

  const chartDivId = `${CHART_NAME}_${Math.floor(Math.random() * 100)}`;

  const onClickHandler = (mouseEvent: PlotMouseEvent) => {
    router.push(`/projects/${mouseEvent.points[0].x}`);
  };
  const jsonData = [
    ...sortedData.map(
      ({
        project: label,
        percent: value,
      }: {
        project: string;
        percent: number;
      }) => {
        return {
          label,
          value,
        };
      },
    ),
  ];

  return (
    <div
      data-testid="graph-cancer-distribution-mutations"
      className="border border-base-lighter p-4"
    >
      <div>
        <ChartTitleBar
          title={title}
          filename="cancer-distribution-bar-chart"
          divId={chartDivId}
          jsonData={jsonData}
        />
      </div>
      <div>
        <BarChart
          divId={chartDivId}
          data={chartData as any} // TODO: fix type
          onClickHandler={onClickHandler}
          height={height}
        />
        <BarChartTextVersion className="mt-[20px]" data={jsonData} />
      </div>
    </div>
  );
};

export default SSMPlot;
