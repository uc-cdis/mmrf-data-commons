import { GetServerSideProps } from 'next';
import {
  getNavPageLayoutPropsFromConfig,
  type WorkspaceConfig,
  type NavPageLayoutProps,
   ContentSource
} from "@gen3/frontend"
import { GEN3_COMMONS_NAME } from '@gen3/core';
import { WorkspacePageLayoutProps } from './types';

export const WorkspacePageGetServerSideProps: GetServerSideProps<
  WorkspacePageLayoutProps
> = async (_context) => {
  const workspaceProps: WorkspaceConfig =
    await ContentSource.getContentDatabase().get(
      `${GEN3_COMMONS_NAME}/workspace.json`,
    );
  try {
    return {
      props: {
        ...(await getNavPageLayoutPropsFromConfig()),
        workspaceProps,
      },
    };
  } catch (err: unknown) {
    return {
      props: {
        ...(await getNavPageLayoutPropsFromConfig()),
        workspaceProps: {
          launchStepIndicatorConfig: {} as any,
        },
      },
    };
  }
};


export default WorkspacePageGetServerSideProps;
