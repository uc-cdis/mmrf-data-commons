import React from 'react';
import Image from 'next/image';
import footerJSON from '../../../config/mmrf/footer.json';
import { Anchor } from '@mantine/core';

const { mmrfFooter } = footerJSON;

const HealFooter: React.FC = () => {
  return (
    <footer
      data-testid="heal-footer"
      className="bg-mmrf-gunmetal min-h-[212px] text-white "
    >
      <div className="container mx-auto px-6 py-12 flex justify-between">
        {/* Left Section */}
        <div className="block md:flex justify-between max-w-[283px] ml-8 md:ml-0 md:mr-8">
          {mmrfFooter.leftSection.columns.map((col, i) => (
            <div className="flex-wrap mr-14 mb-8 md:mb-0" key={i}>
              <div className="mb-3 font-bold uppercase">{col.title}</div>
              <ul className="text-sm">
                {col.linkSet.map((link, iterator) => (
                  <li key={iterator}>
                    <Anchor
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
        <div className="flex flex-wrap max-w-[500px] text-sm text-right">
          <div className="mb-3">
            {mmrfFooter.rightSection.icons.map((item, i) => (
              <Anchor
                key={i}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-85"
              >
                <Image
                  src={item.icon}
                  height={item.height}
                  width={item.width}
                  alt={item.alt}
                  className={`border-heal-blue_accent
                    ${item.className}`}
                />
              </Anchor>
            ))}
          </div>
          <div>{mmrfFooter.rightSection.description}</div>
          <div className="mt-3 w-full">
            {mmrfFooter.rightSection.linkSet.map((item, i) => (
              <React.Fragment key={i}>
                <Anchor
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-variant="dark-background"
                  className="block md:inline"
                >
                  <b>{item.text}</b> {item.version}
                </Anchor>
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

export default HealFooter;
