import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { SSMSSummary } from "@/features/mutationSummary/SSMSSummary";
import PageTitle from "@/components/PageTitle";

const MutationsPage: NextPage = () => {
  const router = useRouter();
  const ssms = router.asPath.split("/")[2];

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    <>
      <PageTitle pageName="Mutation Summary" />
      <h1 className="sr-only">Mutation Summary</h1>
      {ready && <SSMSSummary ssm_id={ssms} />}
    </>
  );
};

export default MutationsPage;
