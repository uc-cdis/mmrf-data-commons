import React from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import PageTitle from "@/components/PageTitle";
import { useEffect, useState } from "react";
import { CaseSummary } from "@/features/cases/CaseSummary";

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
      <h1 className="sr-only">Case Summary</h1>
      {ready && (
        <CaseSummary caseId={caseId as string} bioId={bioId as string} />
      )}
    </>
  );
};

export default CaseSummaryPage;
