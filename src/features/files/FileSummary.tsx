import React from 'react';
import { FileView } from './FileView';
import { LoadingOverlay } from '@mantine/core';
import { SummaryErrorHeader } from '@/components/Summary/SummaryErrorHeader';
import { useGetFileSummaryQuery } from '../../core/features/files/filesSlice';

export interface FileSummaryProps {
  readonly file_id: string;
  readonly isModal?: boolean;
}

export const FileSummary: React.FC<FileSummaryProps> = ({
  file_id,
  isModal,
}: FileSummaryProps) => {

  const { data: { files } = {}, isFetching } = useGetFileSummaryQuery(file_id);

  return (
    <div>
      {!isFetching ? (
        <>
          {!files?.[0] ? (
            <SummaryErrorHeader label="File Not Found" />
          ) : (
            <FileView file={files[0]} isModal={isModal} />
          )}
        </>
      ) : (
        <LoadingOverlay data-testid="loading-spinner" visible />
      )}
    </div>
  );
};
