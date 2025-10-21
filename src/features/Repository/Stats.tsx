import React from 'react';
import { PersonIcon, SaveIcon } from '@/utils/icons';
import { filesize } from 'filesize';
import { Loader } from '@mantine/core';

interface FileStatsProps {
  totalCaseCount: number;
  totalFileSize: number;
  totalFileCount: number;
  isFetching: boolean;
}

const Stats = ({
  totalCaseCount,
  totalFileSize,
  totalFileCount,
  isFetching,
}: FileStatsProps) => (
  <div className="flex gap-1 text-xl items-center uppercase flex-wrap">
    <div>
      Total of{' '}
      <strong>{!isFetching ? totalFileCount.toLocaleString() :  <Loader size={18}/>}</strong>{' '}
      {totalFileCount !== 1 ? 'Files' : 'File'}
    </div>
    <div>
      <PersonIcon className="ml-2 mr-1 mb-1 inline-block" aria-hidden="true" />
      <strong className="mr-1">
        {!isFetching ? totalCaseCount.toLocaleString() :  <Loader size={18}/>}
      </strong>
      {totalCaseCount !== 1 ? 'Cases' : 'Case'}
    </div>
    <div>
      <SaveIcon className="ml-2 mr-1 mb-1 inline-block" aria-hidden="true" />
      {!isFetching ? filesize(totalFileSize) : <Loader size={18}/>}
    </div>
  </div>
);

export default Stats;
