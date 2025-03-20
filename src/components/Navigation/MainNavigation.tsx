import React, { useState } from 'react';

import { Anchor, Input, Burger, Drawer } from '@mantine/core';
import Image from 'next/image';

const MainNavigation = () => {
  // const [opened, setOpened] = useState(false);
  const [opened, setOpened] = useState(true);

  const links = [
    { label: 'Analysis Center', href: '#' },
    { label: 'Projects', href: '#' },
    { label: 'Cohort Build', href: '#' },
    { label: 'Repository', href: '#' },
  ];

  // <Image src="/logo.png" alt="Virtual Lab" width={150} height={50} />

  console.log('opened', opened);

  return (
    <>
      <div className="bg-mmrf-purple text-white p-3 h-[50px]">
        Secondary Navigation
      </div>
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center">
          <Image
            src="/images/logos/VirtualLab-TM-FINAL-CMYK_PLUM.png"
            alt="Virtual Lab"
            width={150}
            height={50}
          />
        </div>

        <div className="hidden md:flex space-x-4">
          {links.map((link) => (
            <Anchor
              key={link.label}
              href={link.href}
              className="text-gray-700 hover:text-blue-500"
            >
              {link.label}
            </Anchor>
          ))}
          <Input placeholder="Search..." className="w-64" />
        </div>

        <div className="md:hidden">
          <Burger opened={opened} onClick={() => setOpened((o) => !o)} />
          <Drawer
            opened={opened}
            onClose={() => setOpened(false)}
            title="Menu"
            padding="md"
            size="md"
          >
            {links.map((link) => (
              <Anchor key={link.label} href={link.href} className="block mb-2">
                {link.label}
              </Anchor>
            ))}
            <Input placeholder="Search..." className="w-full" />
          </Drawer>
        </div>
      </header>
    </>
  );
};

export default MainNavigation;
