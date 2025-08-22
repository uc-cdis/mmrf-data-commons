import React from 'react';
import { DownloadButton } from './DownloadButton';


interface DownloadFileProps {
  customDataTestID?: string;
}

export const DownloadFile: React.FC<DownloadFileProps> = ({
  customDataTestID,
}: DownloadFileProps) => {
  return (
    <DownloadButton
      data-testid={customDataTestID}
    />
  );
};
