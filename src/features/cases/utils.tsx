import React from 'react';
import { calculatePercentageAsNumber, sortByPropertyAsc } from '@/utils/index';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { PercentageLabel } from '@/components/PercentageLabel';
import { downloadTSV } from '@/components/Table/utils';
import saveAs from 'file-saver';

export const getSlideCountFromCaseSummary = (
  experimental_strategies: Array<{
    experimental_strategy: string;
    file_count: number;
  }>,
): number => {
  const slideTypes = ['Diagnostic Slide', 'Tissue Slide'];
  return (experimental_strategies || []).reduce(
    (slideCount, { file_count, experimental_strategy }) =>
      slideTypes.includes(experimental_strategy)
        ? slideCount + file_count
        : slideCount,
    0,
  );
};

export const formatDataForDataCategoryTable = (
  data_categories: {
    readonly data_category: string;
    readonly file_count: number;
  }[],
  filesCountTotal: number,
): {
  data: {
    readonly data_category: string;
    readonly file_count: number;
  }[];
  columns: ColumnDef<
    {
      readonly data_category: string;
      readonly file_count: number;
    },
    unknown
  >[];
} => {
  const sortedDataCategories = data_categories ? sortByPropertyAsc(
    data_categories,
    'data_category',
  ) : [];

  const dataCategoryTableColumnHelper =
    createColumnHelper<(typeof sortedDataCategories)[0]>();

  const dataCategoryTableColumns = [
    dataCategoryTableColumnHelper.display({
      id: 'data_category',
      header: () => <div className="text-sm leading-[18px]">Data Category</div>,
      cell: ({ row }) => row.original.data_category,
    }),
    dataCategoryTableColumnHelper.display({
      id: 'file_count',
      header: () => (
        <div className="flex">
          <div className="basis-1/3 text-right font-bold text-sm leading-[18px]">
            Files
          </div>
          <div className="basis-2/3 pl-1 font-normal text-sm leading-[18px]">
            (n={filesCountTotal.toLocaleString()})
          </div>
        </div>
      ),
      cell: ({ row }) => {
        const fileCountPercentage = calculatePercentageAsNumber(
          row.original.file_count,
          filesCountTotal,
        );
        return (
          <PercentageLabel
            count={row.original.file_count}
            countPercentage={fileCountPercentage}
          />
        );
      },
    }),
  ];

  return { data: sortedDataCategories, columns: dataCategoryTableColumns };
};

export const formatDataForExpCategoryTable = (
  experimental_strategies: {
    readonly experimental_strategy: string;
    readonly file_count: number;
  }[],
  filesCountTotal: number,
): {
  data: {
    readonly experimental_strategy: string;
    readonly file_count: number;
  }[];
  columns: ColumnDef<
    {
      readonly experimental_strategy: string;
      readonly file_count: number;
    },
    unknown
  >[];
} => {
  const sortedExpCategories = sortByPropertyAsc(
    experimental_strategies,
    'experimental_strategy',
  );

  const expCategoryTableColumnHelper =
    createColumnHelper<(typeof sortedExpCategories)[0]>();

  const expCategoryTableColumns = [
    expCategoryTableColumnHelper.display({
      id: 'data_category',
      header: () => (
        <div className="text-sm leading-[18px]">Experimental Strategy</div>
      ),
      cell: ({ row }) => row.original.experimental_strategy,
    }),
    expCategoryTableColumnHelper.display({
      id: 'file_count',
      header: () => (
        <div className="flex">
          <div className="basis-1/3 text-right font-bold text-sm leading-[18px]">
            Files
          </div>
          <div className="basis-2/3 pl-1 font-normal text-sm leading-[18px]">
            (n={filesCountTotal.toLocaleString()})
          </div>
        </div>
      ),
      cell: ({ row }) => {
        const fileCountPercentage = calculatePercentageAsNumber(
          row.original.file_count,
          filesCountTotal,
        );
        return (
          <PercentageLabel
            count={row.original.file_count}
            countPercentage={fileCountPercentage}
          />
        );
      },
    }),
  ];

  return { data: sortedExpCategories, columns: expCategoryTableColumns };
};

export const handleTSVDownload = (
  baseFileName: string,
  data: any[],
  columns: any[],
) => {
  downloadTSV({
    tableData: data as any,
    columns: columns,
    fileName: `${baseFileName}.tsv`,
  });
};

export const handleJSONDownload = (baseFileName: string, data: any[]) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'text/json',
  });
  saveAs(blob, `${baseFileName}.json`);
};

export const ITEMS_PER_COLUMN = 4;
