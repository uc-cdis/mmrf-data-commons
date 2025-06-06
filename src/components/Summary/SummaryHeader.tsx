import React from 'react';
import { SummaryHeaderTitle } from '@/components/tailwindComponents';
import { Divider } from '@mantine/core';
import { ReactNode } from 'react';
import Image from 'next/image';

export interface SummaryHeaderProps {
  headerTitleLeft: 'Gene' | 'Mutation';
  headerTitle: string | number;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  isModal?: boolean;
}
export const SummaryHeader = ({
  headerTitleLeft,
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
      data-testid="summary-header"
    >
      <div className="flex flex-nowrap items-center gap-4">
        <span
          className="w-9 h-9 uppercase rounded-full text-lg flex justify-center
            items-center leading-[22px] font-bold bg-base-lightest"
        >
          <Image
            className="ml-[8px] mt-[11px]"
            src="/icons/gene-mutation.svg"
            alt=""
            height={40}
            width={40}
            data-testid="summary-header-icon"
          />
        </span>
        <SummaryHeaderTitle
          data-testid="summary-header-title"
          className="uppercase"
        >
          {headerTitleLeft}
          <span className="mx-4 text-2xl inline">•</span> {headerTitle}
        </SummaryHeaderTitle>
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
