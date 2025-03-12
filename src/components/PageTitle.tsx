import React from 'react';
import Head from 'next/head';

interface PageTitleProps {
  pageName: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ pageName }) => {
  return (
    <Head>
      <title>{`${pageName} | Multiple Myeloma Research Foundation`}</title>
    </Head>
  );
};

export default PageTitle;
