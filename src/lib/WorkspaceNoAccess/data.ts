import { GetServerSideProps } from 'next';
import {
  getNavPageLayoutPropsFromConfig,
} from '@gen3/frontend';


const WorkspaceNoAccessPageServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      ...(await getNavPageLayoutPropsFromConfig()),
    },
  };
};

export default WorkspaceNoAccessPageServerSideProps;
