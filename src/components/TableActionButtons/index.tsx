import React from 'react';
import { MMRFFile } from '@/core/features/files/filesSlice';
import DownloadPresignedURLWithIcon from '@/components/DownloadButtons/DownloadPresignedURLWithIcon';

export const TableActionButtons = ({ fileId }: { fileId: string }): JSX.Element => {

  return (
    <div className="flex gap-3">
      <DownloadPresignedURLWithIcon
        file={{ id: fileId, file_id: fileId } as MMRFFile}
        label="Download"
        customDataTestID="button-download-file"
      />
    </div>
  );
};
