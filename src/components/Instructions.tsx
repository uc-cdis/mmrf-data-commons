import React from 'react';
import { Text } from '@mantine/core';


interface InstructionsProps {
  readonly message: string;
}

const Instructions: React.FC<InstructionsProps> = ({ message }) => (
  <div className="flex m-2">
    <Text size="md">{message}</Text>
  </div>
);

export default Instructions;
