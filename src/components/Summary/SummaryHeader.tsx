import React from 'react';
import { SummaryHeaderTitle } from '@/components/tailwindComponents';
import { Divider } from '@mantine/core';
import { ReactNode } from 'react';
import MutationsIcon from '../../../public/icons/gene-mutation.svg';
import Image from 'next/image';

export interface SummaryHeaderProps {
  headerTitle: string | number;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  isModal?: boolean;
}
export const SummaryHeader = ({
  headerTitle,
  leftElement,
  rightElement,
  isModal = false,
}: SummaryHeaderProps): JSX.Element => {
  return (
    <header
      className={`bg-mmrf-purple py-4 px-4 w-full flex flex-col shadow-lg gap-4 ${
        isModal ? 'sticky top-0 rounded-t-sm z-20' : 'fixed z-10'
      }`}
    >
      <div className="flex flex-nowrap items-center gap-4">
        <SummaryHeaderIcon />
        <SummaryHeaderTitle>{headerTitle}</SummaryHeaderTitle>
      </div>
      {(leftElement || rightElement) && (
        <>
          <Divider size="md" color="white" opacity={0.4} />
          <div className="flex justify-between">
            <>{leftElement && leftElement}</>
            <>{rightElement && rightElement}</>
          </div>
        </>
      )}
    </header>
  );
};

export const SummaryHeaderIcon = (): JSX.Element => (
  <span
    className="w-9 h-9 uppercase
      rounded-full text-lg flex justify-center items-center leading-[22px]
      font-bold bg-base-lightest"
  >
    <Image
      className="ml-[6px] mt-[9px]"
      src={MutationsIcon}
      alt=""
      height={40}
      width={40}
    />
  </span>
);
