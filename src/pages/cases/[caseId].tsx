import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import PageTitle from '@/components/PageTitle';
import { useEffect, useState } from 'react';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';
import { CaseSummary } from '@/features/cases/CaseSummary';

const CaseSummaryPage: NextPage = () => {
  const router = useRouter();
  const {
    query: { caseId, bioId },
  } = router;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    <>
      <PageTitle pageName="Case Summary" />
      <div className="w-full flex-col flex gap-4 fixed z-10 bg-white">
        <MainNavigation />
      </div>
      <h1 className="sr-only">Case Summary</h1>
      <div className="flex">
        <div className="w-full mt-[100px]">
          {ready && (
            <CaseSummary case_id={caseId as string} bio_id={bioId as string} />
          )}
        </div>
      </div>
    </>
  );
};

export default CaseSummaryPage;
