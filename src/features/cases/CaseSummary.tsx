import React from 'react';
// import { useGetCasesQuery, useGetAnnotationsQuery } from '@gff/core';
import { LoadingOverlay } from '@mantine/core';
import { SummaryErrorHeader } from '@/components/Summary/SummaryErrorHeader';
import { caseSummaryFields } from './utils';
import { CaseView } from './CaseView';
import { useContext, useEffect, useState } from 'react';
import { URLContext } from 'src/utils/contexts';

const useGetCasesQuery = (request: any) => ({
  data: { hits: [1] },
  isFetching: false,
});
const useGetAnnotationsQuery = (request: any) => ({
  annotationCountData: 1,
  isAnnotationCallFetching: false,
});

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
          field: 'case_id',
          value: case_id,
        },
        op: '=',
      },
      fields: caseSummaryFields,
    },
  });

  const { data: annotationCountData, isFetching: isAnnotationCallFetching } =
    useGetAnnotationsQuery({
      request: {
        filters: {
          op: '=',
          content: {
            field: 'annotations.case_id',
            value: case_id,
          },
        },
      },
    });

  const prevPathValue = useContext(URLContext);
  useEffect(() => {
    if (
      prevPathValue !== undefined &&
      ['MultipleImageViewerPage', 'selectedId'].every((term) =>
        prevPathValue.prevPath?.includes(term),
      )
    ) {
      setShouldScrollToBio(true);
    }
  }, [prevPathValue]);

  return (
    <>
      {isFetching || isAnnotationCallFetching ? (
        <LoadingOverlay visible data-testid="loading-spinner" />
      ) : data && data.hits.length > 0 && annotationCountData !== undefined ? (
        <CaseView
          case_id={case_id}
          bio_id={bio_id as string}
          data={data?.hits?.[0]}
          annotationCountData={annotationCountData?.pagination.total}
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
