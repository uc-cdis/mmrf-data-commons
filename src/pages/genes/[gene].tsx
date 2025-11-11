import React from "react";
import { useState, useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import PageTitle from "@/components/PageTitle";
import { GeneSummary } from "@/features/GeneSummary/GeneSummary";

const GenesPage: NextPage = () => {
  const router = useRouter();
  const gene = router.asPath.split("/")[2]?.split("?")?.[0];

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    <>
      <PageTitle pageName="Gene Summary" />
      <h1 className="sr-only">Gene Summary</h1>
      {ready && <GeneSummary gene_id={gene} />}
    </>
  );
};

export default GenesPage;
