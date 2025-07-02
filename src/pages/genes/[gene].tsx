import React from 'react';
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import PageTitle from '@/components/PageTitle';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';
import { GeneSummary } from '@/features/GeneSummary/GeneSummary';
// import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
// import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";

const GenesPage: NextPage = () => {
  const router = useRouter();
  const gene = router.asPath.split('/')[2]?.split('?')?.[0];

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    <>
      <PageTitle pageName="Gene Summary" />
      <div className="w-full flex-col flex gap-4 fixed z-10 bg-white">
        <MainNavigation />
      </div>
      <h1 className="sr-only">Gene Summary</h1>
      <div className="flex">
        <div className="w-full mt-[100px]">
          {ready && <GeneSummary gene_id={gene} />}
        </div>
      </div>
    </>
  );
};

export default GenesPage;
