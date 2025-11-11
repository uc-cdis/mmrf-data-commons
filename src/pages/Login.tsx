import React from 'react';
import {
  LoginPanel,
  LoginConfig,
  LoginPageGetServerSideProps as getServerSideProps,
} from '@gen3/frontend';
import PageTitle from '@/components/PageTitle';

export const LoginPage = ({ loginConfig }: { loginConfig: LoginConfig }) => {
  return (
    <>
      <PageTitle pageName="Login Page" />
        <LoginPanel {...loginConfig} />
    </>
  );
};

export default LoginPage;

export { getServerSideProps };
