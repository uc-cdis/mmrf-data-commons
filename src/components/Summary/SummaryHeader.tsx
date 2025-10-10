import React, { ReactNode } from 'react';
import { SummaryHeaderTitle } from '@/components/tailwindComponents';
import { Divider } from '@mantine/core';
import Image from 'next/image';
import { Icon } from '@iconify-icon/react';

export interface SummaryHeaderProps {
  iconPath: string;
  headerTitleLeft: string;
  headerTitle: string | number;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  isModal?: boolean;
}
export const SummaryHeader = ({
  iconPath,
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
          <Icon
            className="object-cover m-1"
            icon={iconPath}
            alt=""
            height={28}
            width={28}
            color="primary"
            data-testid="summary-header-icon"
          />
        </span>
        <SummaryHeaderTitle data-testid="summary-header-title" className='uppercase'>
          {headerTitleLeft} <span className="mx-4 text-2xl inline">•</span>{' '}
          {headerTitle}
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
