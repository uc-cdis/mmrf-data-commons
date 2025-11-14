import React from 'react';
import { Workspace } from "@gen3/frontend";
import { WorkspacePageLayoutProps } from '../../lib/Workspace/types';
import { useRouter } from 'next/router';
import { NextRouter } from 'next/dist/client/router';

const getWorkspaceId = (router: NextRouter): string | undefined => {
  const { workspace } = router.query;
  if (typeof workspace === 'string') return workspace;
  else if (typeof workspace === 'object') return workspace[0];

  return undefined;
};

const WorkspacePage = ({
  workspaceProps,
}: WorkspacePageLayoutProps): JSX.Element => {
  const router = useRouter();

  const id = getWorkspaceId(router);

  return (
      <Workspace config={workspaceProps} workspaceToRunId={id} />
  );
};

export default WorkspacePage;
