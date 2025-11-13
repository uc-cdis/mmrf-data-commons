import { GetServerSideProps } from 'next';
import {
  getNavPageLayoutPropsFromConfig,
  NavPageLayoutProps,
} from '@gen3/frontend';


const WorkspaceNoAccessPageServerSideProps: GetServerSideProps<
  NavPageLayoutProps
> = async () => {
  return {
    props: {
      ...(await getNavPageLayoutPropsFromConfig()),
    },
  };
};

export default WorkspaceNoAccessPageServerSideProps;
