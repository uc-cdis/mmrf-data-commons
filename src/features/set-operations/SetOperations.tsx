import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { SetOperationsProps } from './types';
import { SetOperationsSummaryTable } from './SetOperationsSummaryTable';
import { SetOperationTable } from './SetOperationTable';
import { useDeepCompareCallback, useDeepCompareMemo } from 'use-deep-compare';

const VennDiagram = dynamic(() => import('../charts/VennDiagram'), {
  ssr: false,
});

export const SetOperations: React.FC<SetOperationsProps> = ({
  entities,
  data,
}: SetOperationsProps) => {
  const [selectedSets, setSelectedSets] = useState(
    Object.fromEntries(data.map((set) => [set.key, false])),
  );

  const chartData = useDeepCompareMemo(
    () =>
      data.map((set) => ({
        key: set.key,
        value: set.value,
        highlighted: selectedSets[set.key],
      })),
    [data, selectedSets],
  );

  const onClickHandler = useDeepCompareCallback(
    (clickedKey: string) => {
      setSelectedSets({
        ...selectedSets,
        [clickedKey]: !selectedSets[clickedKey],
      });
    },
    [selectedSets],
  );

  return (
    <div className="flex flex-col p-4 w-full">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-4">
        <div className="relative my-auto lg:basis-1/3 max-w-[400px] 2xl:max-w-[600px] w-full mx-auto">
          <VennDiagram
            labels={['S₁', 'S₂', 'S₃']}
            ariaLabel="The Venn diagram displays the intersections, unions, or differences in the cohorts or sets. Additional information can be found in the Summary Table and the Overlap Table."
            chartData={chartData}
            onClickHandler={onClickHandler}
          />
        </div>
        <div className="relative lg:basis-2/3">
          <SetOperationsSummaryTable entities={entities} />
          <div className="m-8" />
          <SetOperationTable
            data={data}
            selectedSets={selectedSets}
            setSelectedSets={setSelectedSets}
          />
        </div>
      </div>
    </div>
  );
};
