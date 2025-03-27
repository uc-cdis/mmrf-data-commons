import React from 'react';
import { Anchor } from '@mantine/core';
import { Navigation } from '../navigationInterfaces';
import Image from 'next/image';
import NavLogo from './NavLogo';
import SearchBar from './SearchBar';

interface DesktopViewProps {
  navigation: Navigation;
}

const DesktopView: React.FC<DesktopViewProps> = ({ navigation }) => (
  <>
    <div
      className="hidden lg:flex items-center mt-[-4px]"
      data-testid="mmrf-mainNavigation-logo"
    >
      <NavLogo navigation={navigation} />
    </div>
    <div
      className="hidden lg:flex space-x-4 ml-4 items-center"
      data-testid="mmrf-mainNavigation-links"
    >
      {navigation.items.map((link, i) => (
        <Anchor
          key={i}
          href={link.href}
          className="text-mmrf-gunmetal whitespace-nowrap"
        >
          <Image
            src={link.icon}
            alt=""
            width={24}
            height={24}
            className="inline ml-4 mr-2 mt-[-3px]"
          />
          {link.name}
        </Anchor>
      ))}
      <div className="pl-3" data-testid="mmrf-mainNavigation-search">
        <SearchBar
          iconSrc={navigation.Search.icon}
          placeholderText={navigation.Search.placeholderText}
        />
      </div>
    </div>
  </>
);

export default DesktopView;
