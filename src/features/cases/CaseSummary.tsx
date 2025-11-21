import React from "react";
import { LoadingOverlay } from "@mantine/core";
import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";
import { CaseView } from "./CaseView";
import { useContext, useEffect, useState } from "react";
import { URLContext } from "src/utils/contexts";
import { useCaseSummaryQuery } from "@/core/features/cases/caseSlice";

export const CaseSummary = ({
  caseId,
  bioId,
  isModal = false,
}: {
  caseId: string;
  bioId?: string;
  isModal?: boolean;
}): JSX.Element => {
  const [shouldScrollToBio, setShouldScrollToBio] = useState(
    bioId !== undefined,
  );
  const { data, isFetching } = useCaseSummaryQuery({ caseId } );


  const prevPathValue = useContext(URLContext);
  useEffect(() => {
    if (
      prevPathValue !== undefined &&
      ["MultipleImageViewerPage", "selectedId"].every((term) =>
        prevPathValue.prevPath?.includes(term),
      )
    ) {
      setShouldScrollToBio(true);
    }
  }, [prevPathValue]);

  return (
    <>
      {isFetching ? (
        <LoadingOverlay visible data-testid="loading-spinner" />
      ) : data && data.hits.length > 0 ? (
        <CaseView
          case_id={caseId}
          bio_id={bioId as string}
          data={data?.hits?.[0]}
          isModal={isModal}
          shouldScrollToBio={shouldScrollToBio}
        />
      ) : (
        <div className="mt-10">
          <SummaryErrorHeader label="Case Not Found" />
        </div>
      )}
    </>
  );
};
