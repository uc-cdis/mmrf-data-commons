import React from "react";
import { Text } from "@mantine/core";
import { ContextModalProps } from '@mantine/modals';

export const NoAccessModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps) => {
  return (
    <div className="border-y border-y-base p-4">
      <Text size="sm">
        You don&apos;t have access to this file. Please login.
      </Text>
    </div>
  );
};
