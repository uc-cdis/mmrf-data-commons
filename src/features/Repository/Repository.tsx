import React from 'react';
import RepositoryPanel from './RepositoryPanel';
import {
  ErrorCard,
  MessagePage,
  validateObjectHasRequiredFields,
} from '@gen3/frontend';
import { RepositoryProps } from './types';

const Repository = ({
  filters,
  guppyConfig,
  table,
  buttons,
  loginForDownload,
  dropdowns,
  fileStatsConfiguration,
  additionalControls = null,
}: RepositoryProps) => {
  if (
    !fileStatsConfiguration ||
    !validateObjectHasRequiredFields(
      fileStatsConfiguration,
      Object.keys(fileStatsConfiguration),
    )
  ) {
    return (
      <MessagePage>
        <ErrorCard message="Invalid repository configuration" />
      </MessagePage>
    );
  }

  return (
    <RepositoryPanel
      guppyConfig={guppyConfig}
      key="Repository-Panel"
      filters={filters}
      table={table}
      dropdowns={dropdowns}
      buttons={buttons}
      loginForDownload={loginForDownload}
      fileStatsConfiguration={fileStatsConfiguration}
      additionalControls={additionalControls}
    />
  );
};

export default Repository;
