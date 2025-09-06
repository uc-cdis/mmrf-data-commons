import React from 'react';
import { Button } from '@mantine/core';
import { DownloadIcon } from '@/utils/icons';


export const DownloadButton = () => (
  <Button
      variant="outline"
      leftSection={<DownloadIcon  aria-hidden="true" />}
      onClick={()=>alert('click event for Download button')}
      className={`font-medium text-sm text-primary bg-base-max
        hover:bg-mmrf-gunmetal hover:text-primary-contrast-darker`}
  >
    Download
    </Button>
);
