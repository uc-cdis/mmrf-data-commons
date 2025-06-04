import { downloadTSV } from '@/components/Table/utils';
import { getFormattedTimestamp } from '@/utils/date';
import { SomaticMutation } from '../types';
import { ColumnDef } from '@tanstack/react-table';

export const handleTSVDownload = (data:SomaticMutation[], columns: ColumnDef<SomaticMutation>[]) => {
  console.log('data in download.tsx', data);
  console.log('columns in download.tsx', columns);

  downloadTSV({
    // tableData: data,
    tableData: data as any,
    columns: columns,
    // columns: columns,
    fileName: `most-frequent-somatic-mutations-table.${getFormattedTimestamp()}.tsv`,
  });
};
