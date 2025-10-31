import React from 'react';
import PageTitle from '@/components/PageTitle';
import { Center } from '@mantine/core';
import {
  useCoreSelector,
  selectGen3AppByName,
  GEN3_COMMONS_NAME,
} from '@gen3/core';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getAppName } from '../../utils/apps';
import {
  NavPageLayoutProps,
  getNavPageLayoutPropsFromConfig,
  ContentSource,
  CohortManager, QueryExpression,
} from '@gen3/frontend';

interface AppConfig extends NavPageLayoutProps {
  config?: object;
}

const AppsPage = ({ config }: AppConfig) => {
  const router = useRouter();
  const appName = getAppName(router);

  const Gen3App = useCoreSelector(
    () => selectGen3AppByName(appName), // TODO update ById to ByName
  ) as React.ElementType;

  if (!Gen3App)
    return (
      <Center>
        <div className="text-utility-warning font-bold m-10 border-base-darkest">
          App: {appName} not found
        </div>
      </Center>
    );

  return (
    <>
      <PageTitle pageName="Analysis Center" />
      <div className="w-full flex-col flex gap-4 z-10 top-0 bg-base-max">
        <CohortManager/>
        <QueryExpression index="cases"/>
        <div className="w-full overflow-y-auto">
          <Gen3App {...config} />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<
  NavPageLayoutProps
> = async (context) => {
  const appName = context.query.appName as string;

  try {
    const config: any = await ContentSource.getContentDatabase().get(
      `${GEN3_COMMONS_NAME}/apps/${appName}.json`,
    );

    return {
      props: {
        ...(await getNavPageLayoutPropsFromConfig()),
        config: config,
      },
    };
  } catch (err) {
    console.error(err);
    return {
      props: {
        ...(await getNavPageLayoutPropsFromConfig()),
        config: undefined,
      },
    };
  }
};

export default AppsPage;
