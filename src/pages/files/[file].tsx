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

  let file_id = ""
  if (file)
    file_id = decodeURIComponent(file)

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    <>
      <PageTitle pageName="File Summary" />
      <div className="w-full flex-col flex gap-4 fixed z-10 bg-white">
        <MainNavigation />
      </div>
      <h1 className="sr-only">Gene Summary</h1>
      <div className="flex">
        <div className="w-full mt-[100px]">
          {ready && <FileSummary file_id={file_id} />}
        </div>
      </div>
    </>
  );
};

export default GenesPage;
