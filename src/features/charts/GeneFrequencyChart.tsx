import React, { useState, useTransition } from 'react';
import { LoadingOverlay } from '@mantine/core';
import dynamic from 'next/dynamic';
import { FilterSet } from '@/core';
import ChartTitleBar from './ChartTitleBar';
import { BarChartData } from './BarChart';
import { useDeepCompareEffect, useDeepCompareMemo } from 'use-deep-compare';
import BarChartTextVersion from './BarChartTextVersion';
import { GenesFrequencyChart} from '@/core/genomic/genesFrequencyChartSlice';

interface GeneFrequencyEntry {
  readonly gene_id: string;
  readonly numCases: number;
  readonly symbol: string;
}

const CHART_NAME = 'most-frequently-mutated-genes-bar-chart';

const BarChart = dynamic(() => import('./BarChart'), {
  ssr: false,
});

const hovertemplate =
  '<b>%{x}</b> <br />%{customdata[0]} Cases Affected in Cohort<br />%{customdata[0]} / %{customdata[1]} (%{y:.2f}%)<extra></extra>';

const processChartData = (
  chartData: GenesFrequencyChart,
  title = 'Distribution of Most Frequently Mutated Genes',
  showXLabels = true,
): BarChartData => {
  if (!chartData)
    return {
      datasets: [],
    };

  const xindex = chartData.genes.map((_i, index) => index);
  const xvals = chartData.genes.map((i) => i.symbol);

  return {
    datasets: [
      {
        x: xindex,
        y: chartData.genes.map(
          (x) => (x.numCases / chartData.filteredCases) * 100,
        ),
        marker: {
          color: '#319fbe',
        },
        hovertemplate: hovertemplate,
        customdata: chartData.genes.map((d) => [
          d.numCases?.toLocaleString(),
          chartData.filteredCases?.toLocaleString(),
        ]),
      },
    ],
    tickvals: showXLabels ? xindex : [],
    ticktext: showXLabels ? xvals : [],
    label_text: xvals,
    title: title,
    filename: title,
    yAxisTitle: '% of Cases Affected',
  };
};

interface GeneFrequencyChartProps {
  readonly genomicFilters?: FilterSet;
  readonly height?: number;
  readonly marginBottom?: number;
  readonly showXLabels?: boolean;
  readonly title?: string;
  readonly maxBins?: number;
  readonly orientation?: string;
  readonly cohortFilters?: FilterSet;
  readonly chartData?: GenesFrequencyChart;
  readonly isFetching: boolean;
  readonly isError: boolean;
}


export const GeneFrequencyChart: React.FC<GeneFrequencyChartProps> = ({
  genomicFilters = undefined,
  height = undefined,
  marginBottom = 100,
  title = 'Distribution of Most Frequently Mutated Genes',
  maxBins = 20,
  orientation = 'v',
  cohortFilters = undefined,
  chartData = {
    genes: [],
    filteredCases: 0,
    genesTotal: 0,
  },
  isFetching,
  isError
}: GeneFrequencyChartProps) => {
  const [isPending, startTransition] = useTransition();
  const [isChartRendering, setIsChartRendering] = useState(true);

// extract geneFilters from genomicFilters
//   const geneFilters = {
//     mode: 'and',
//     root: Object.fromEntries(
//       Object.entries(genomicFilters?.root || {}).filter(([key]) =>
//         GENE_FILTERS.includes(key),
//       ),
//     ),
//   };
//
//   const ssmFilters = {
//     mode: 'and',
//     root: Object.fromEntries(
//       Object.entries(genomicFilters?.root || {}).filter(
//         ([key]) => !GENE_FILTERS.includes(key),
//       ),
//     ),
//   };


  // const queryParams = useDeepCompareMemo(
  //   () => ({
  //     pageSize: maxBins,
  //     offset: 0,
  //     geneFilters,
  //     ssmFilters,
  //     cohortFilters,
  //   }),
  //   [maxBins, genomicFilters, cohortFilters],
  // );

  // const { data, isFetching, isLoading } = useGeneFrequencyChartQuery(
  //   queryParams as any,
  // );


  const processedData = useDeepCompareMemo(
    () => processChartData(chartData ?? {
      geneCounts: [],
      filteredCases: 0,
      genesTotal: 0,
    }),
    [chartData],
  );

  useDeepCompareEffect(() => {
    if (chartData) {
      startTransition(() => {
        setIsChartRendering(true);
      });
    }
  }, [chartData]);

  const handlePlotlyAfterPlot = () => {
    setIsChartRendering(false);
  };

  const jsonData = chartData?.genes?.map((gene) => ({
    label: gene.symbol,
    value: (gene.numCases / chartData.filteredCases) * 100,
  }));

  return (
    <div className="relative pr-2">
      {title ? (
        <ChartTitleBar
          title={title}
          divId={CHART_NAME}
          filename={CHART_NAME}
          jsonData={jsonData}
        />
      ) : null}
      <div className="w-100 h-100 relative mt-10">
        <LoadingOverlay
          data-testid="loading-spinner"
          visible={isFetching || isPending || isChartRendering}
          zIndex={1}
        />
        <BarChart
          data={processedData}
          marginBottom={marginBottom}
          marginTop={0}
          height={height}
          orientation={orientation}
          divId={CHART_NAME}
          onAfterPlot={handlePlotlyAfterPlot}
        />
      </div>
      <BarChartTextVersion className="mt-[20px]" data={jsonData ?? []} />
    </div>
  );
};
