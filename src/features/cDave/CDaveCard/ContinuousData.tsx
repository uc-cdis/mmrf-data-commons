import React, { useRef, useState } from 'react';
import { useDeepCompareEffect, useDeepCompareMemo } from 'use-deep-compare';
import { GQLFilter as GqlOperation } from '@gen3/core';
import { useRangeFacet } from '../../facets/hooks';
import CDaveHistogram from './CDaveHistogram';
import CDaveTable from './CDaveTable';
import ClinicalSurvivalPlot from './ClinicalSurvivalPlot';
import CardControls from './CardControls';
import { isArray } from 'lodash';
import { Statistics } from '@/core/features/api/types';
import { useGetContinuousDataStatsQuery } from '@/core/features/clinicalDataAnalysis';
import {
  CustomInterval,
  NamedFromTo,
  ChartTypes,
  SelectedFacet,
  DataDimension,
  DisplayData,
} from '../types';
import {
  SURVIVAL_PLOT_MIN_COUNT,
  DATA_DIMENSIONS,
  MISSING_KEY,
} from '../constants';
import {
  isInterval,
  createBuckets,
  parseContinuousBucket,
  convertDataDimension,
  roundContinuousValue,
} from '../utils';
import ContinuousBinningModal from '../ContinuousBinningModal/ContinuousBinningModal';
import BoxQQSection from './BoxQQSection';

const EmptyContinuousStats = {
  min: 0,
  max: 0,
  mean: 0,
  median: 0,
  stddev: 0,
  std_dev: 0,
  iqrL: 0,
  q1L: 0,
  q3: 0,
  q1: 0,
  iqr: 0,
};
const processContinuousResultData = (
  data: Record<string, number>,
  customBinnedData: NamedFromTo[] | CustomInterval | null,
  field: string,
  dataDimension: DataDimension,
): DisplayData => {
  if (customBinnedData && !isInterval(customBinnedData) && customBinnedData?.length > 0) {
    return Object.values(data).map((v, idx) => ({
      displayName: customBinnedData[idx]?.name,
      key: customBinnedData[idx]?.name,
      count: v,
    }));
  }

  return Object.entries(data).map(([k, v]) => ({
    displayName: toBucketDisplayName(
      k,
      field,
      dataDimension,
      customBinnedData !== null,
    ),
    key: k,
    count: v,
  }));
};

const toBucketDisplayName = (
  bucket: string,
  field: string,
  dataDimension: DataDimension,
  hasCustomBins: boolean,
): string => {
  const [fromValue, toValue] = parseContinuousBucket(bucket);
  const originalDataDimension = DATA_DIMENSIONS[field]?.unit;
  return `${roundContinuousValue(
    convertDataDimension(
      Number(fromValue),
      originalDataDimension,
      dataDimension,
    ),
    field,
    hasCustomBins,
  )?.toLocaleString()} to <${roundContinuousValue(
    convertDataDimension(Number(toValue), originalDataDimension, dataDimension),
    field,
    hasCustomBins,
  )?.toLocaleString()}`;
};

interface ContinuousDataProps {
  readonly initialData: Statistics;
  readonly field: string;
  readonly fieldName: string;
  readonly chartType: ChartTypes;
  readonly noData: boolean;
  readonly cohortFilters: GqlOperation;
  readonly dataDimension: DataDimension;
}

const ContinuousData: React.FC<ContinuousDataProps> = ({
  initialData,
  field,
  fieldName,
  chartType,
  noData,
  cohortFilters,
  dataDimension,
}: ContinuousDataProps) => {
  const [customBinnedData, setCustomBinnedData] = useState<
    CustomInterval | NamedFromTo[] | null
  >([]);
  const [binningModalOpen, setBinningModalOpen] = useState(false);
  const [selectedSurvivalPlots, setSelectedSurvivalPlots] = useState<string[]>(
    [],
  );
  const [selectedFacets, setSelectedFacets] = useState<SelectedFacet[]>([]);
  const [yTotal, setYTotal] = useState(0);
  const dataDimensionRef = useRef(dataDimension);
  const hasCustomBins = customBinnedData !== null;

  const ranges = useDeepCompareMemo(
    () =>
      isInterval(customBinnedData)
        ? createBuckets(
            customBinnedData.min,
            customBinnedData.max,
            customBinnedData.interval,
          )
        : isArray(customBinnedData) && customBinnedData?.length > 0
          ? customBinnedData.map((d) => ({
              to: d.to,
              from: d.from,
            }))
          : createBuckets(initialData?.min ?? 0, initialData?.max ?? 100),
    [customBinnedData, initialData],
  );

  const { data, isFetching, isSuccess } = useRangeFacet(
    field,
    ranges,
    { indexType: 'cases' },
    cohortFilters,
  );
  const { data: statsData } = useGetContinuousDataStatsQuery({
    field: field.replaceAll('.', '__'),
    queryFilters: cohortFilters,
    rangeFilters: {
      range: {
        [field]: ranges as any, // TODO:fix this typing
      },
    },
  });

  const displayedData = useDeepCompareMemo(
    () =>
      processContinuousResultData(
        isSuccess ? data : {},
        customBinnedData,
        field,
        dataDimension,
      ),
    [isSuccess, data, customBinnedData, field, dataDimension],
  );

  useDeepCompareEffect(() => {
    if (dataDimensionRef.current !== dataDimension) {
      dataDimensionRef.current = dataDimension;
    } else {
      setSelectedSurvivalPlots(
        displayedData
          .filter(
            ({ count, key }) =>
              key !== MISSING_KEY && count >= SURVIVAL_PLOT_MIN_COUNT,
          )
          .sort((a, b) => b.count - a.count)
          .map(({ key }) => key)
          .slice(0, 2),
      );
    }

    if (customBinnedData === null) {
      setYTotal(displayedData.reduce((a, b) => a + b.count, 0));
    }

    setSelectedFacets([]);
  }, [dataDimension, displayedData, customBinnedData]);

  return (
    <>
      {chartType === 'boxqq' ? (
        <BoxQQSection
          field={field}
          displayName={fieldName}
          data={statsData ?? EmptyContinuousStats}
          dataDimension={dataDimension}
          hasCustomBins={hasCustomBins}
        />
      ) : (
        <>
          <div className="flex-grow">
            {chartType === 'histogram' ? (
              <CDaveHistogram
                field={field}
                data={displayedData}
                yTotal={yTotal}
                isFetching={isFetching}
                hideYTicks={displayedData.every((val) => val.count === 0)}
                noData={noData}
              />
            ) : (
              <ClinicalSurvivalPlot
                field={field}
                selectedSurvivalPlots={selectedSurvivalPlots}
                continuous={true}
                customBinnedData={customBinnedData}
              />
            )}
          </div>
          <CardControls
            continuous={true}
            field={field}
            fieldName={fieldName}
            displayedData={displayedData}
            yTotal={yTotal}
            setBinningModalOpen={setBinningModalOpen}
            customBinnedData={customBinnedData}
            setCustomBinnedData={setCustomBinnedData}
            selectedFacets={selectedFacets}
            dataDimension={dataDimension}
          />
          <CDaveTable
            field={field}
            fieldName={fieldName}
            yTotal={yTotal}
            displayedData={displayedData}
            hasCustomBins={customBinnedData !== null}
            survival={chartType === 'survival'}
            selectedSurvivalPlots={selectedSurvivalPlots}
            setSelectedSurvivalPlots={setSelectedSurvivalPlots}
            selectedFacets={selectedFacets}
            setSelectedFacets={setSelectedFacets}
            dataDimension={dataDimension}
          />
        </>
      )}

      <ContinuousBinningModal
        opened={binningModalOpen}
        setModalOpen={setBinningModalOpen}
        field={field}
        stats={initialData}
        updateBins={setCustomBinnedData}
        customBins={customBinnedData}
        dataDimension={dataDimension}
      />
    </>
  );
};

export default ContinuousData;
