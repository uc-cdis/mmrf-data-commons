import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import footerJSON from '../../../../config/mmrf/footer.json';
import { Anchor, Text } from '@mantine/core';

const { mmrfFooter } = footerJSON;

const Footer: React.FC = () => {
  return (
    <footer
      data-testid="mmrf-footer"
      className="bg-mmrf-gunmetal min-h-[152px] text-white text-xs"
    >
      <div className="container px-4 py-6 md:flex min-w-full">
        {/* Left Section */}
        <div
          className={`flex justify-between w-full sm:w-[40%] items-start md:ml-0 md:mr-4
           `}
          data-testid="mmrf-footer-left-section"
        >
          {mmrfFooter.leftSection.columns.map((col, i) => (
            <div
              className="flex-wrap mr-5 md:mr-12 mb-8 md:mb-0"
              key={i}
              data-testid={`mmrf-footer-left-column-${i}`}
            >
              <div className="mb-2 font-bold uppercase text-sm">
                {col.title}
              </div>
              <ul>
                {col.linkSet.map((link, iterator) => (
                  <li key={iterator}>
                    <Anchor
                      component={Link}
                      data-variant="dark-background"
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.text}
                    </Anchor>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Right Section */}
        <div
          className="w-full md:ml-12 md:flex md:flex-wrap md:items-end md:justify-end md:text-right "
          data-testid="mmrf-footer-right-section"
        >
          <div className="mb-2 w-full">
            {mmrfFooter.rightSection.icons.map((item, i) => (
              <Anchor
                key={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-85"
                data-testid={`mmrf-footer-icon-${i}`}
              >
                <Image
                  src={item.icon}
                  height={item.height}
                  width={item.width}
                  alt={item.alt}
                  className={`border-white ${item.className}`}
                />
              </Anchor>
            ))}
          </div>
          <div className="md:text-right lg:w-[425px]">
            {mmrfFooter.rightSection.description}
          </div>
          <div className="mt-3 w-full">
            {mmrfFooter.rightSection.linkSet.map((item: any, i) => (
              <React.Fragment key={i}>
                <Text className="block md:inline text-xs">
                  <b>{item.text}</b> {item.version}
                </Text>
                {i < mmrfFooter.rightSection.linkSet.length - 1 && (
                  <span className="hidden md:inline">&nbsp;|&nbsp;</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
