import React from "react";
import { LoadingOverlay } from "@mantine/core";
import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";
import { caseSummaryFields } from "./utils";
import { CaseView } from "./CaseView";
import { useContext, useEffect, useState } from "react";
import { URLContext } from "src/utils/contexts";
import { useGetCasesQuery } from "@/core/features/cases/casesSlice";
import { EndpointRequestProps } from "@/core/features/api";

export const CaseSummary = ({
  case_id,
  bio_id,
  isModal = false,
}: {
  case_id: string;
  bio_id?: string;
  isModal?: boolean;
}): JSX.Element => {
  const [shouldScrollToBio, setShouldScrollToBio] = useState(
    bio_id !== undefined,
  );
  const { data, isFetching } = useGetCasesQuery({
    request: {
      filters: {
        content: {
          field: "case_id",
          value: case_id as string,
        },
        op: "=",
      },
      fields: caseSummaryFields,
    },
  } as unknown as EndpointRequestProps);

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
    <div>
      {isFetching ? (
        <LoadingOverlay visible data-testid="loading-spinner" />
      ) : data && data.hits.length > 0 ? (
        <CaseView
          case_id={case_id}
          bio_id={bio_id as string}
          data={data?.hits?.[0]}
          isModal={isModal}
          shouldScrollToBio={shouldScrollToBio}
        />
      ) : (
        <div className="mt-10">
          <SummaryErrorHeader label="Case Not Found" />
        </div>
      )}
    </div>
  );
};
