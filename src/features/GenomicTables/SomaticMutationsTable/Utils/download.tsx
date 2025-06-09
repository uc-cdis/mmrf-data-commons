import { downloadTSV } from '@/components/Table/utils';
import { getFormattedTimestamp } from '@/utils/date';
import { SomaticMutation } from '../types';
import { ColumnDef } from '@tanstack/react-table';
import saveAs from "file-saver";

const baseFileName = `most-frequent-somatic-mutations-table.${getFormattedTimestamp()}`;
export const handleTSVDownload = (data:SomaticMutation[], columns: ColumnDef<SomaticMutation>[]) => {
  downloadTSV({
    tableData: data as any,
    columns: columns,
    fileName: `${baseFileName}.tsv`,
  });
};

export const handleJSONDownload = (data:SomaticMutation[]) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "text/json",
    });
    saveAs(blob, `${baseFileName}.json`,);
}
