import React from 'react';
import { Button } from '@mantine/core';
import { GEN3_FENCE_API } from '@gen3/core';
import { MMRFFile } from '@/core/features/files/filesSlice';
import { DownloadIcon } from '@/utils/icons';

interface DownloadPresignedURLProps {
  file: MMRFFile;
  label: string;
  customDataTestID?: string;
}

const DownloadPresignedURLWithIcon = ({
  file,
  customDataTestID,
  label,
}: DownloadPresignedURLProps) => {
  return (
    <Button
      test-id={customDataTestID}
      component="a"
      color="primary.4"
      variant="outline"
      leftSection={
        <DownloadIcon
          size={23}
          aria-label="download"
        />
      }
      href={`${GEN3_FENCE_API}/data/download/${
        file.file_id ? encodeURIComponent(file.file_id as string) : ''
      }?redirect=true&expires_in=9600`}
    >
      {label}
    </Button>
  );
};

export default DownloadPresignedURLWithIcon;
