import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { SSMSSummary } from '@/features/mutationSummary/SSMSSummary';
import PageTitle from '@/components/PageTitle';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';

const MutationsPage: NextPage = () => {
  const router = useRouter();
  const ssms = router.asPath.split('/')[2];

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    <>
      <PageTitle pageName="Mutation Summary" />
      <div className="w-full flex-col flex gap-4 fixed z-10 bg-white">
        <MainNavigation />
      </div>
      <h1 className="sr-only">Mutation Summary</h1>
      <div className="flex">
        <div className="w-full mt-[100px]">
          {ready && <SSMSSummary ssm_id={ssms} />}
        </div>
      </div>
    </>
  );
};

export default MutationsPage;
