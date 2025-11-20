import React from 'react';
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import PageTitle from '@/components/PageTitle';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';
import { FileSummary } from '@/features/files/FileSummary';

const GenesPage: NextPage = () => {
  const router = useRouter();
  const file = router.asPath.split('/')[2]?.split('?')?.[0];

  let file_id = '';
  if (file) file_id = decodeURIComponent(file);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    <>
      <PageTitle pageName="File Summary" />
      <h1 className="sr-only">File Summary</h1>
      {ready && <FileSummary file_id={file_id} />}
    </>
  );
};

export default GenesPage;
