import React, { useContext, useState, useEffect, useRef } from 'react';
import { Box, Menu, Tooltip, Loader, ActionIcon } from '@mantine/core';
import isNumber from 'lodash/isNumber';
import { useMouse } from '@mantine/hooks';
import saveAs from 'file-saver';
import { SummaryModalContext } from '@/utils/contexts';
import {
  DashboardDownloadContext,
  DownloadProgressContext,
} from '@/components/analysis/context';
import OffscreenWrapper from '@/components/OffscreenWrapper';
import {
  MINIMUM_CASES,
  SurvivalPlotLegend,
  SurvivalPlotProps,
  SurvivalPlotTypes,
} from './types';
import { useSurvival } from './useSurvival';
import {
  buildManyLegend,
  buildOnePlotLegend,
  buildTwoPlotLegend,
  DAYS_IN_MONTH_ROUNDED,
  enoughData,
  enoughDataOnSomeCurves,
} from './utils';
import { handleDownloadPNG, handleDownloadSVG } from '../utils';
import { DAYS_IN_YEAR } from '@/core/constants';
import { DownloadIcon, ResetIcon, SurvivalChartIcon } from '@/utils/icons';
import BarChartTextVersion from '../BarChartTextVersion';

const ExternalDownloadStateSurvivalPlot: React.FC<SurvivalPlotProps> = ({
  data,
  names = [],
  plotType = SurvivalPlotTypes.mutation,
  title = 'Overall Survival Plot',
  showTitleOnlyOnDownload = false,
  hideLegend = false,
  height = 380,
  field,
  downloadFileName = 'survival-plot',
  tableTooltip = false,
  noDataMessage = '',
  isLoading,
}: SurvivalPlotProps) => {
  // handle the current range of the xAxis: set to "undefined" to reset
  const [xDomain, setXDomain] = useState(undefined);
  const [survivalPlotLineTooltipContent, setSurvivalPlotLineTooltipContent] =
    useState(undefined);
  const { ref: mouseRef, x, y } = useMouse(); // for survival plot tooltip
  const downloadRef = useRef<HTMLDivElement | null>(null);

  const pValue = data?.overallStats?.pValue;
  const plotData = data?.survivalData ?? [];

  const hasEnoughData = [
    'gene',
    'mutation',
    'categorical',
    'continuous',
    'cohortComparison',
  ].includes(plotType)
    ? enoughDataOnSomeCurves(plotData)
    : enoughData(plotData);

  const { setEntityMetadata } = useContext(SummaryModalContext);
  const shouldPlot =
    hasEnoughData &&
    plotData
      .map(({ donors }: { donors: any }) => donors)
      .every(({ length }: { length: any }) => length >= MINIMUM_CASES);
  // hook to call renderSurvivalPlot
  const shouldUsePlotData =
    (['gene', 'mutation'].includes(plotType) && shouldPlot) ||
    (['categorical', 'continuous', 'overall', 'cohortComparison'].includes(
      plotType,
    ) &&
      hasEnoughData);
  const dataToUse = shouldUsePlotData ? plotData : [];
  const container = useSurvival(
    dataToUse,
    xDomain,
    setXDomain,
    height,
    setSurvivalPlotLineTooltipContent,
    setEntityMetadata,
  );

  const containerForDownload = useSurvival(
    hasEnoughData ? plotData : [],
    xDomain,
    setXDomain,
    height > 380 ? height : 380,
    setSurvivalPlotLineTooltipContent,
  );

  let legend: SurvivalPlotLegend[];
  switch (plotType) {
    case SurvivalPlotTypes.overall:
      legend = buildOnePlotLegend(plotData, 'Explorer');
      break;
    case SurvivalPlotTypes.gene:
      legend = buildTwoPlotLegend(plotData, names[0], plotType);
      break;
    case SurvivalPlotTypes.mutation:
      legend = buildTwoPlotLegend(plotData, names[0], plotType);
      break;
    case SurvivalPlotTypes.categorical:
      legend = buildManyLegend(plotData, names, field ?? 'not set', plotType);
      break;
    case SurvivalPlotTypes.continuous:
      legend = buildManyLegend(plotData, names, field ?? 'not set', plotType);
      break;
    case SurvivalPlotTypes.cohortComparison:
      legend = buildManyLegend(plotData, names, field ?? 'not set', plotType);
      break;
  }

  const plotDataTextVersionJSON = plotData
    .map((group, index) => {
      const caseIdentifier = index === 0 ? 'S1' : 'S2';
      return group.donors.map((donor) => ({
        case: caseIdentifier,
        time: donor.time,
        survivalEstimate: donor.survivalEstimate,
      }));
    })
    .flat();

  const handleDownloadJSON = async () => {
    const blob = new Blob(
      [
        JSON.stringify(
          plotData.map((element: any, index: any) => ({
            meta: { ...element.meta, label: `S${index + 1}` },
            donors: element.donors.map((donor: any) => ({
              ...donor,
              time: Math.round(donor.time * DAYS_IN_YEAR), // Converting to actual days from API
            })),
          })),
          null,
          2,
        ),
      ],
      { type: 'application/json' },
    );

    saveAs(blob, `${downloadFileName}.json`);
  };

  const handleDownloadTSV = async () => {
    if (plotData.length === 0) {
      return;
    }

    const showLabel = plotType !== SurvivalPlotTypes.overall;

    const header = [
      'id',
      'time (days)',
      'time (months)',
      'time (years)',
      'censored',
      'survivalEstimate',
      'submitter_id',
      'project_id',
    ];

    if (showLabel) {
      header.push('label');
    }

    const body = plotData
      .map((element: any, index: any) =>
        element.donors
          .map((row: any) => {
            const timeDays = Math.round(row.time * DAYS_IN_YEAR); // Converting to actual days from API
            const timeMonths = Math.round(timeDays / DAYS_IN_MONTH_ROUNDED);
            const timeYears = row.time.toFixed(1);

            const rowValues = [
              row.id,
              timeDays,
              timeMonths,
              timeYears,
              row.censored,
              row.survivalEstimate,
              row.submitter_id,
              row.project_id,
            ];

            if (showLabel) {
              rowValues.push(`S${index + 1}`);
            }

            return rowValues.join('\t');
          })
          .join('\n'),
      )
      .join('\n');

    const tsv = [header.join('\t'), body].join('\n');
    const blob = new Blob([tsv], { type: 'text/csv' });

    saveAs(blob, `${downloadFileName}.tsv`);
  };

  const { dispatch } = useContext(DashboardDownloadContext);
  useEffect(() => {
    const charts = [{ filename: downloadFileName, chartRef: downloadRef }];
    if (downloadRef.current !== null) {
      dispatch({
        type: 'add',
        payload: [
          {
            filename: downloadFileName,
            chartRef: downloadRef as React.MutableRefObject<HTMLDivElement>,
          },
        ],
      });
      return () =>
        dispatch({
          type: 'remove',
          payload: [
            {
              filename: downloadFileName,
              chartRef: downloadRef as React.MutableRefObject<HTMLDivElement>,
            },
          ],
        });
    } else {
      return () => {};
    }
  }, [dispatch, downloadFileName]);

  const { downloadInProgress, setDownloadInProgress } = useContext(
    DownloadProgressContext,
  );

  // handle errors
  if (!(dataToUse.length > 0) && !isLoading && noDataMessage) {
    return <div className="py-1">{noDataMessage}</div>;
  }

  return (
    <div className="flex flex-col" data-testid="survival-plot">
      <div className="flex items-center justify-center flex-wrap">
        {!showTitleOnlyOnDownload && (
          <div className="font-heading text-[1rem] font-medium">{title}</div>
        )}
        <div className="flex items-center ml-auto gap-1">
          <Menu
            position="bottom-start"
            offset={1}
            transitionProps={{ duration: 0 }}
          >
            <Menu.Target>
              <Tooltip label="Download Survival Plot data or image">
                <ActionIcon
                  data-testid="button-survival-plot-download"
                  aria-label="Download Survival Plot data or image"
                  variant="outline"
                >
                  {downloadInProgress ? (
                    <Loader size={16} />
                  ) : (
                    <DownloadIcon size="1rem" aria-hidden="true" />
                  )}
                </ActionIcon>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown data-testid="dropdown-menu-options">
              <Menu.Item
                onClick={async () => {
                  if (downloadRef.current !== null) {
                    try {
                      if (setDownloadInProgress) setDownloadInProgress(true);
                      const filename = downloadFileName
                        ? `${downloadFileName}.svg`
                        : 'download.svg';
                      await handleDownloadSVG(
                        downloadRef as React.MutableRefObject<HTMLElement>,
                        `${downloadFileName}.svg`,
                      );
                    } catch (error) {
                      console.error('Error downloading PNG:', error);
                    } finally {
                      if (setDownloadInProgress) setDownloadInProgress(false);
                    }
                  }
                }}
              >
                SVG
              </Menu.Item>
              <Menu.Item
                onClick={async () => {
                  if (downloadRef.current !== null) {
                    try {
                      if (setDownloadInProgress) setDownloadInProgress(true);

                      const filename = downloadFileName
                        ? `${downloadFileName}.png`
                        : 'download.png';

                      await handleDownloadPNG(
                        downloadRef as React.MutableRefObject<HTMLElement>,
                        filename,
                      );
                    } catch (error) {
                      console.error('Error downloading PNG:', error);
                    } finally {
                      if (setDownloadInProgress) setDownloadInProgress(false);
                    }
                  }
                }}
              >
                PNG
              </Menu.Item>
              <Menu.Item onClick={handleDownloadJSON}>JSON</Menu.Item>
              <Menu.Item onClick={handleDownloadTSV}>TSV</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Tooltip label="Reset Survival Plot Zoom">
            <ActionIcon
              variant="outline"
              onClick={() => setXDomain(undefined)}
              data-testid="button-reset-survival-plot"
              aria-label="Reset Survival Plot Zoom"
            >
              <ResetIcon size="1rem" aria-hidden="true" />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
      <div className="flex flex-col font-content-noto">
        {!hideLegend &&
          legend?.map((x, idx) => {
            return (
              <div
                data-testid="text-cases-with-survival-data"
                key={`${x.key}-${idx}`}
                className="text-sm"
              >
                {x.value}
              </div>
            );
          })}

        <div className="mt-2">
          <Tooltip
            label={
              <div>
                Value shows 0.00e+0 because the
                <br />
                P-Value is extremely low and goes beyond
                <br />
                the precision inherent in the code
              </div>
            }
            disabled={pValue !== 0}
          >
            <div className="text-xs font-content">
              {isNumber(pValue) &&
                `Log-Rank Test P-Value = ${pValue.toExponential(2)}`}
            </div>
          </Tooltip>
        </div>
        {tableTooltip && (
          <div className="text-xs font-content">
            Use the Survival buttons{' '}
            <SurvivalChartIcon className="inline-block" /> in the table below to
            change the survival plot
          </div>
        )}
        <div className="flex justify-end text-xs text-primary-content font-content">
          drag to zoom
        </div>
      </div>

      <div ref={mouseRef} className="relative">
        <Box
          className="w-36"
          style={{
            top: y + 20,
            left: x < 150 ? x - 20 : x - 100,
            position: 'absolute',
            zIndex: 200,
          }}
        >
          {survivalPlotLineTooltipContent}
        </Box>
        <div className="survival-plot" ref={container} />
      </div>
      <OffscreenWrapper>
        <div className="w-[700px] m-2" ref={downloadRef}>
          <div className="flex flex-col items-center">
            <div className="font-heading text-[1rem] font-medium">{title}</div>
          </div>
          <div className="flex flex-col font-content-noto">
            {!hideLegend &&
              legend?.map((x, idx) => {
                return (
                  <div key={`${x.key}-${idx}`} className="text-sm">
                    {x.value}
                  </div>
                );
              })}
            <div className="text-xs font-content mt-2">
              {isNumber(pValue) &&
                `Log-Rank Test P-Value = ${pValue.toExponential(2)}`}
            </div>
          </div>
          <div className="survival-plot" ref={containerForDownload} />
        </div>
      </OffscreenWrapper>
      <BarChartTextVersion
        className="mt-[40px]"
        data={plotDataTextVersionJSON}
      />
    </div>
  );
};

const SurvivalPlot = (props: SurvivalPlotProps) => {
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  return (
    <DownloadProgressContext.Provider
      value={{ downloadInProgress, setDownloadInProgress }}
    >
      <ExternalDownloadStateSurvivalPlot {...props} />
    </DownloadProgressContext.Provider>
  );
};

export { ExternalDownloadStateSurvivalPlot };
export default SurvivalPlot;
