import { GetServerSideProps } from "next";
import { GEN3_COMMONS_NAME } from "@gen3/core";
import {
  ContentSource,
  getNavPageLayoutPropsFromConfig,
  NavPageLayoutProps,
  QueryProps,
} from "@gen3/frontend";

export const ProfilePageGetServerSideProps: GetServerSideProps<
  NavPageLayoutProps
> = async () => {
  const profileConfig: QueryProps =
    await ContentSource.getContentDatabase().get(
      `${GEN3_COMMONS_NAME}/profile.json`,
    );

  console.log({ profileConfig });
  return {
    props: {
      ...(await getNavPageLayoutPropsFromConfig()),
      ...{ profileConfig: profileConfig },
    },
  };
};
