import React from 'react';
// import { useCallback } from 'react';
import { CutIcon } from '@/utils/icons';
//import { showModal, Modals, GdcFile } from '@/core';
//import { useFetchUserDetailsQuery, useCoreDispatch } from '@gen3/core';
import { Button } from '@mantine/core';
// import { userCanDownloadFile } from 'src/utils/userProjectUtils';

export const BAMSlicingButton = ({
  isActive,
  file,
}: {
  isActive: boolean;
  // file: GdcFile;
  file: any;
}): JSX.Element => {
  return <Button className="font-medium text-sm text-primary bg-base-max hover:bg-mmrf-gunmetal hover:text-primary-contrast-darker"
      leftSection={<CutIcon aria-hidden="true" />}
      loading={isActive}
      variant="outline"
      onClick={()=>alert('click event for BAM Slicing button')}
      data-testid="button-bam-slicing">BAM Slicing</Button>;

  /*
  const dispatch = useCoreDispatch();
  const { data: userInfo } = useFetchUserDetailsQuery();
  const { username } = userInfo?.data || {};

  const onClick = useCallback(() => {
    if (username && userCanDownloadFile({ user: userInfo?.data, file })) {
      dispatch(showModal({ modal: Modals.BAMSlicingModal }));
    } else if (
      username &&
      !userCanDownloadFile({ user: userInfo?.data: userInfo, file })
    ) {
      dispatch(showModal({ modal: Modals.NoAccessToProjectModal }));
    } else {
      dispatch(showModal({ modal: Modals.NoAccessModal }));
    }
  }, [dispatch, file, userInfo?.data, username]);

  return (
    <Button
      className="font-medium text-sm text-primary bg-base-max hover:bg-primary-darkest hover:text-primary-contrast-darker"
      leftSection={<CutIcon aria-hidden="true" />}
      loading={isActive}
      variant="outline"
      onClick={onClick}
      data-testid="button-bam-slicing"
    >
      {isActive ? 'Slicing' : 'BAM Slicing'}
    </Button>
  );
  */
};
