import React from 'react';
import { Button } from '@mantine/core';
import saveAs from 'file-saver';
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
  const handleDownload = async () => {
    const url = `${GEN3_FENCE_API}/data/download/${
      file.file_id ? encodeURIComponent(file.file_id as string) : ''
    }?redirect=true&expires_in=9600`;

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const blob = await response.blob();
    saveAs(blob, file.file_name, { autoBom: false });
  };

  return (
    <Button
      test-id={customDataTestID}
      component="button"
      onClick={handleDownload}
      color="primary.4"
    >
      {label}
    </Button>
  );
};

export default DownloadPresignedURL;
