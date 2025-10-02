import React from 'react';
import { DownloadFile } from '../DownloadButtons';
import { GdcFile } from '@/core';

const placeHolderFile = 'placeHolderFile' as unknown as GdcFile;
export const TableActionButtons = (): JSX.Element => {
  return (
    <div className="flex gap-3">
      <DownloadFile
        file={placeHolderFile}
        customDataTestID="button-download-file"
      />
    </div>
  );
};
