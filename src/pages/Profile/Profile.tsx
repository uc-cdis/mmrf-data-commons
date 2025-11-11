import { NavPageLayoutProps, Profile, ProfileConfig } from "@gen3/frontend";
import React from "react";

interface Props extends NavPageLayoutProps {
  profileConfig: ProfileConfig;
}

const ProfilePage = ({ profileConfig }: Props) => {
  return <Profile profileConfig={profileConfig} />;
};

export default ProfilePage;
