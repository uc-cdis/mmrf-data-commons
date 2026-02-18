import React from 'react';
import { Button } from '@mantine/core';
import { GEN3_FENCE_API } from '@gen3/core';
import { MMRFFile } from '@/core/features/files/filesSlice';

interface DownloadPresignedURLProps {
  file: MMRFFile;
  label: string;
  customDataTestID?: string;
}

const DownloadPresignedURL = ({
  file,
  customDataTestID,
  label,
}: DownloadPresignedURLProps) => {
  return (
    <Button
      test-id={customDataTestID}
      component="a"
      color="primary.4"
      href={`${GEN3_FENCE_API}/data/download/${
        file.file_id ? encodeURIComponent(file.file_id as string) : ''
      }?redirect=true&expires_in=9600`}
    >
      {label}
    </Button>
  );
};

export default DownloadPresignedURL;
