import React from 'react';
import { DownloadFile } from '../DownloadButtons';

export const TableActionButtons = (): JSX.Element => {

  return (
    <div className="flex gap-3">
      <DownloadFile
        customDataTestID="button-download-file"
      />
    </div>
  );
};
