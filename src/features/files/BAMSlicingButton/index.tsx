import React from 'react';
import { CutIcon } from '@/utils/icons';
import { Button } from '@mantine/core';


export const BAMSlicingButton = ({
  isActive,
}: {
  isActive: boolean;
}): JSX.Element => {
  return <Button className={`font-medium text-sm text-primary
    bg-base-max hover:bg-mmrf-gunmetal hover:text-primary-contrast-darker`}
      leftSection={<CutIcon aria-hidden="true" />}
      loading={isActive}
      variant="outline"
      onClick={()=>alert('click event for BAM Slicing button')}
      data-testid="button-bam-slicing">BAM Slicing</Button>;
};
