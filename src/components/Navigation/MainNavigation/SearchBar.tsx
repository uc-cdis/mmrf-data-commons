import React from 'react';
import { Input } from '@mantine/core';
import Image from 'next/image';

interface SearchBarProps {
  iconSrc: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ iconSrc }) => (
  <Input
    leftSection={<Image src={iconSrc} alt="" width={18} height={18} />}
    placeholder="Search..."
    className="w-64"
  />
);

export default SearchBar;
