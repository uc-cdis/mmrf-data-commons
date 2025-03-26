import React, { useState } from 'react';
import { Anchor, Input, Burger, Drawer } from '@mantine/core';
import Image from 'next/image';
import { TopBar } from '@gen3/frontend';
import topBarData from '../../../config/mmrf/topBar.json';
import navigationJSON from '../../../config/mmrf/mainNavigation.json';

const MainNavigation = () => {
  const [opened, setOpened] = useState(false);
  const { navigation } = navigationJSON;
  const navLogo = (
    <Image
      src={navigation.logo.src}
      alt={navigation.logo.alt}
      width={navigation.logo.width}
      height={navigation.logo.height}
    />
  );

  return (
    <>
      <div className="bg-mmrf-purple text-white pr-4 hidden md:block">
        <TopBar
          loginButtonVisibility={topBarData.loginButtonVisibility as any}
          classNames={topBarData.classNames}
          itemClassnames={topBarData.itemClassnames}
          items={topBarData.items}
        />
      </div>
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        {/* Desktop view */}
        <div className="hidden lg:flex items-center">{navLogo}</div>
        <div className="hidden lg:flex space-x-4 ml-4 items-center">
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
                className="inline ml-4 mr-2"
              />
              {link.name}
            </Anchor>
          ))}
          <Input placeholder="Search..." className="w-64" />
        </div>
        {/* Mobile view */}
        <div className="lg:hidden">
          <Burger
            opened={opened}
            onClick={() => setOpened((isOpen) => !isOpen)}
          />
          <Drawer
            opened={opened}
            onClose={() => setOpened(false)}
            title={navLogo}
            padding="md"
            size="md"
          >
            {navigation.items.map((link, i) => (
              <Anchor
                key={i}
                href={link.href}
                className="block my-2 whitespace-nowrap"
              >
                <Image
                  src={link.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="inline  mr-2"
                />
                {link.name}
              </Anchor>
            ))}
            <Input placeholder="Search..." className="w-full mt-6  " />
          </Drawer>
        </div>
        <div className="lg:hidden items-center">{navLogo}</div>
      </header>
    </>
  );
};

export default MainNavigation;
