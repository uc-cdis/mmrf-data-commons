import React, { useState } from 'react';
import { useLazyFetchUserDetailsQuery } from '@gen3/core';
import { useDeepCompareCallback } from 'use-deep-compare';
import { userCanDownloadFile } from '@/utils/userProjectUtils';
import { MMRFFile } from '@/core/features/files/filesSlice';

interface DownloadFileButtonProps {
  file: MMRFFile;
}

const DownloadFileButton = ({ file } : DownloadFileButtonProps) => {
  const [fetchUserDetails] = useLazyFetchUserDetailsQuery();
  const [active, setActive] = useState(false);
  const onClick = useDeepCompareCallback(async () => {
    fetchUserDetails()
      .unwrap()
      .then((userInfo) => {
        if (
          userInfo?.data?.username &&
          userCanDownloadFile({ user: userInfo?.data, file })
        ) {
          dispatch(showModal({ modal: Modals.AgreementModal }));
        } else if (
          userInfo?.data?.username &&
          !userCanDownloadFile({ user: userInfo?.data, file })
        ) {
          dispatch(showModal({ modal: Modals.NoAccessToProjectModal }));
        } else {
          dispatch(showModal({ modal: Modals.NoAccessModal }));
        }
      });
  }, [fetchUserDetails, file]);

  return <div>Download File</div>;
};
export default DownloadFileButton;
