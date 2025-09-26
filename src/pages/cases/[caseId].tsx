import React from 'react';
import { NextPage } from 'next';
// import { datadogRum } from "@datadog/browser-rum";
// import { headerElements } from "@/features/user-flow/workflow/navigation-utils";
import { useRouter } from 'next/router';
// import { UserFlowVariedPages } from "@/features/layout/UserFlowVariedPages";
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

  /*   datadogRum.startView({
    name: "Case Summary",
  }); */

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    /*     <UserFlowVariedPages headerElements={headerElements}>
      {ready && (
        <CaseSummary case_id={caseId as string} bio_id={bioId as string} />
      )}
    </UserFlowVariedPages>
 */

    <>
      <PageTitle pageName="Gene Summary" />
      <div className="w-full flex-col flex gap-4 fixed z-10 bg-white">
        <MainNavigation />
      </div>
      <h1 className="sr-only">Gene Summary</h1>
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
