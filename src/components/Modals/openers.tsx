import { modals, openContextModal } from '@mantine/modals';
import { Text } from '@mantine/core';
import React from 'react';
import { LoginButton } from '@/components/LoginButton';
import { v4 as uuidv4 } from 'uuid';

export const openModal = () =>
  modals.openContextModal({
    modal: 'baseContextModal',
    title: (
      <Text size="lg" className="font-medium">
        Access Alert
      </Text>
    ),
    innerProps: {
      buttons: [
        {
          title: 'Close',
          dataTestId: 'button-no-access-modal-access-alert-close',
        },
        <LoginButton fromSession key={uuidv4()} />,
      ],
      contents: (
        <div className="border-y border-y-base p-4">
          <Text size="sm">
            You don&apos;t have access to this file. Please login.
          </Text>
        </div>
      ),
    },
  });
