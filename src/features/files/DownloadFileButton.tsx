import React, { useState } from 'react';
import { useLazyFetchUserDetailsQuery } from '@gen3/core';
import { useDeepCompareCallback } from 'use-deep-compare';
import { userCanDownloadFile } from '@/utils/userProjectUtils';
import { MMRFFile } from '@/core/features/files/filesSlice';
import { modals } from '@mantine/modals';

interface DownloadFileButtonProps {
  file: MMRFFile;
}

const DownloadFileButton = ({ file } : DownloadFileButtonProps) => {
  const [fetchUserDetails, { isFetching , isSuccess}] = useLazyFetchUserDetailsQuery();
  const [active, setActive] = useState(false);
  const onClick = useDeepCompareCallback(async () => {
    fetchUserDetails()
      .unwrap()
      .then((userInfo) => {
        if (
          userInfo?.data?.username &&
          userCanDownloadFile({ user: userInfo?.data, file })
        ) {
          modals.openContextModal({
            modal: 'agreementModal',
            title: 'Download Agreement',
            size: 'md',
            zIndex: 1200,
            styles: {
              header: {
                marginLeft: '16px',
              },
            },
            innerProps: {
              file: file,
              dbGapList: [],
            },
          });
        } else if (
          userInfo?.data?.username &&
          !userCanDownloadFile({ user: userInfo?.data, file })
        ) {
          modals.openContextModal({
            modal: 'noAccessModal',
            title: 'No Access',
            size: 'md',
            zIndex: 1200,
            styles: {
              header: {
                marginLeft: '16px',
              },
            },
            innerProps: {},
          });
        } else {
          modals.openContextModal({
            modal: 'noAccessModal',
            title: 'No Access',
            size: 'md',
            zIndex: 1200,
            styles: {
              header: {
                marginLeft: '16px',
              },
            },
            innerProps: {},
          });
        }
      });
  }, [fetchUserDetails, file]);

  return <div>Download File</div>;
};
export default DownloadFileButton;
