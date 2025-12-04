import React from 'react';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { pick } from "lodash";
import { addToCart, removeFromCart } from '@/features/cart/updateCart';
import {
  FilterSet,
  CartItem,
  useCoreSelector,
  selectCart,
  useCoreDispatch,
} from '@gen3/core';
import { SummaryCard } from '@/components/Summary/SummaryCard';
import { SummaryHeader } from '@/components/Summary/SummaryHeader';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { useScrollIntoView, useViewportSize } from '@mantine/hooks';
import { Biospecimen } from '../biospecimen/Biospecimen';
import { formatDataForHorizontalTable } from '../files/utils';
import {
  allFilesInCart,
  focusStyles,
  humanify,
  LG_BREAKPOINT,
} from 'src/utils';
import CategoryTableSummary from '@/components/Summary/CategoryTableSummary';
import { ClinicalSummary } from './ClinicalSummary/ClinicalSummary';
import {
  formatDataForDataCategoryTable,
  formatDataForExpCategoryTable,
  getSlideCountFromCaseSummary,
  ITEMS_PER_COLUMN,
} from './utils';
import SMTableContainer from '../GenomicTables/SomaticMutationsTable/SMTableContainer';
import { CartIcon, FileIcon } from '@/utils/icons';
import FilesTableContainer from './FilesTable/FilesTableContainer';
import { useAdvancedSmmTableDataQuery } from '@/core';
import { MMRFFile } from '@/core/features/files/filesSlice';
import { file } from '@babel/types';

export interface CaseViewProps {
  readonly data: any;
  readonly isModal: boolean;
  readonly bio_id: string;
  readonly case_id: string;
  readonly shouldScrollToBio: boolean;
}

export const mapGdcFileToCartFile = (
  files: MMRFFile[],
): CartItem[] => {
  return files?.map((file: MMRFFile) => ({
    id: file.file_id,
      access: file.access,
      acl: file.acl,
      file_id: file.file_id,
      file_size: file.file_size,
      state: file.state,
      project_id: file.project_id,
      file_name: file.file_name
      })
  );
}

export const CaseView: React.FC<CaseViewProps> = ({
  data,
  isModal,
  bio_id,
  case_id,
  shouldScrollToBio,
}: CaseViewProps) => {
  const filesCountTotal = data?.files?.length ?? 0;
  const headerTitle = `${data?.project?.project_id} / ${data?.submitter_id}`;
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });
  const isAllFilesInCart = data?.files
    ? allFilesInCart(currentCart, mapGdcFileToCartFile(data?.files ?? []))
    : false;
  const { width } = useViewportSize();
  const leftSummaryTableRef = useRef<HTMLTableElement>(null);
  const rightSummaryTableRef = useRef<HTMLTableElement>(null);
  const {
    diagnoses = [],
    demographic = {} as any,
    family_histories = [],
    follow_ups = [],
    exposures = [],
  } = data || {};

  useEffect(() => {
    if (shouldScrollToBio) {
      scrollIntoView();
    }
  }, [scrollIntoView, shouldScrollToBio]);

  const formatDataForCaseSummary = () => {
    const {
      case_id,
      submitter_id,
      project: {
        project_id,
        name: project_name,
        program: { name: program_name },
      },
      disease_type,
      primary_site,
      files,
      summary: { experimental_strategies },
    } = data;

    const slideCount =experimental_strategies?.experimental_strategy ? getSlideCountFromCaseSummary(experimental_strategies) : 0;

    const imageFiles: CartItem[] = files?.filter(
      (file: any) => file.data_type === 'Slide Image',
    );

    // TODO: type it properly
    let caseSummaryObject: Record<string, any> = {
      case_uuid: case_id,
      case_id: submitter_id,
      project: (
        <Link
          href={`/projects/${project_id}`}
          className="underline text-utility-link"
        >
          {project_id}
        </Link>
      ),
      project_name,
      disease_type,
      program: program_name,
      primary_site,
    };

    /* -- MMRF does not have image files ---- */
    const isAllImagesFilesInCart = allFilesInCart(
      currentCart,
      mapGdcFileToCartFile([]),
    );

    if (!!slideCount && imageFiles.length > 0) {
      const images = (
        <div className="flex items-center gap-2">


          <Tooltip
            label={!isAllImagesFilesInCart ? 'Add to Cart' : 'Remove from Cart'}
            withinPortal={true}
            withArrow
          >
            <ActionIcon
              data-testid="button-add-remove-files-case-summary"
              variant="outline"
              size="sm"
              className={`hover:bg-primary hover:text-base-max border-primary ${
                isAllImagesFilesInCart
                  ? 'bg-primary text-base-max'
                  : 'text-primary bg-base-max'
              }`}
              onClick={() => {
                if (isAllImagesFilesInCart) {
                  console.log('placeholder for removeFromCart');
                } else {
                  console.log('placeholder for addToCart');
                }
              }}
            >
              <CartIcon size={12} aria-label="Cart" />
            </ActionIcon>
          </Tooltip>
        </div>
      );

      caseSummaryObject = {
        ...caseSummaryObject,
        images,
      };
    }
    const headersConfig = Object.keys(caseSummaryObject).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));

    return formatDataForHorizontalTable(caseSummaryObject, headersConfig);
  };

  const Files = (
    <span className="flex items-center gap-1">
      <FileIcon />
      {filesCountTotal > 0 ? (
        <a
          data-testid="text-file-count-case-summary"
          href="#files"
          className="underline font-bold"
        >
          {filesCountTotal.toLocaleString()}
        </a>
      ) : (
        <span className="font-bold">{filesCountTotal.toLocaleString()}</span>
      )}
      {filesCountTotal > 1 ? 'Files' : 'File'}
    </span>
  );

  const projectFilter: FilterSet = {
    mode: 'and',
    root: {
      'project.project_id': {
        operator: 'includes',
        field: 'project.project_id',
        operands: [data.project.project_id],
      },
      'case_id': {
        operator: 'includes',
        field: 'case_id',
        operands: [case_id],
      },
    },
  };

  const summaryData = formatDataForCaseSummary();
  const [leftColumnData, rightColumnData] = [
    summaryData.slice(0, ITEMS_PER_COLUMN),
    summaryData.slice(ITEMS_PER_COLUMN),
  ];

  return (
    <>
      <SummaryHeader
        iconPath="/icons/user.svg"
        headerTitleLeft="Case"
        headerTitle={headerTitle}
        leftElement={
          <Tooltip
            label="No files to add to Cart"
            disabled={filesCountTotal !== 0}
          >
            <Button
              data-testid="button-add-all-remove-all-files-case-summary"
              leftSection={<CartIcon />}
              className={`${
                isAllFilesInCart
                  ? 'bg-nci-red-darker text-base-max hover:bg-removeButtonHover'
                  : `text-primary bg-base-max hover:bg-primary-darkest
                  hover:text-base-max`
              } ${focusStyles} data-disabled:opacity-50 data-disabled:bg-base-max
               data-disabled:text-primary `}
              onClick={() =>
                isAllFilesInCart
                  ? removeFromCart(
                    mapGdcFileToCartFile(data.files),
                    currentCart,
                    dispatch,
                  )
                  : addToCart(
                    mapGdcFileToCartFile(data.files),
                    currentCart,
                    dispatch,
                  )
              }
              disabled={filesCountTotal === 0}
              classNames={{ label: 'font-medium text-sm' }}
            >
              {!isAllFilesInCart
                ? 'Add all files to the cart'
                : 'Remove all files from the cart'}
            </Button>
          </Tooltip>
        }
        rightElement={
          <div
            className={`flex items-center gap-4 text-xl text-base-lightest
          font-medium leading-6 font-montserrat uppercase`}
          >
            Total of {Files}
          </div>
        }
        isModal={isModal}
      />

      <div className={`${!isModal ? 'mt-6' : 'mt-4'} mx-4`}>
        <div data-testid="table-summary-case-summary" className="flex">
          <div className="basis-full lg:basis-1/2">
            <SummaryCard
              tableData={width >= LG_BREAKPOINT ? leftColumnData : summaryData}
              ref={leftSummaryTableRef}
              enableSync={true}
            />
          </div>
          {width >= LG_BREAKPOINT && (
            <div className="basis-1/2 h-full">
              <SummaryCard
                tableData={rightColumnData}
                title=""
                ref={rightSummaryTableRef}
                enableSync={true}
              />
            </div>
          )}
        </div>

        {(data.summary.data_categories ||
          data.summary.experimental_strategies?.experimental_strategy) && (
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            {data.summary.data_categories && (
              <div className="basis-1/2">
                <CategoryTableSummary
                  customDataTestID="table-data-category-case-summary"
                  title="File Counts by Data Category"
                  {...formatDataForDataCategoryTable(
                    data.summary.data_categories,
                    filesCountTotal,
                  )}
                  tooltip={
                    'A detailed list of the files is located in the Files section of this page.'
                  }
                />
              </div>
            )}
            {data.summary.experimental_strategies?.experimental_strategy && (
              <div className="basis-1/2">
                <CategoryTableSummary
                  customDataTestID="table-experimental-strategy-case-summary"
                  title="File Counts by Experimental Strategy"
                  {...formatDataForExpCategoryTable(
                    data.summary.experimental_strategies,
                    filesCountTotal,
                  )}
                  tooltip={
                    'A detailed list of the files is located in the Files section of this page.'
                  }
                />
              </div>
            )}
          </div>
        )}

        <div data-testid="table-clinical-case-summary" className="mt-8">
          <ClinicalSummary
            diagnoses={diagnoses}
            follow_ups={follow_ups}
            demographic={demographic}
            family_histories={family_histories}
            exposures={exposures}
            case_id={case_id}
            submitter_id={data?.submitter_id}
            project_id={data?.project?.project_id}
          />
        </div>

        <div
          data-testid="table-biospecimen-case-summary"
          ref={targetRef}
          id="biospecimen"
          className="mt-8"
        >
          <Biospecimen
            caseId={case_id}
            bioId={bio_id}
            isModal={isModal}
            submitter_id={data?.submitter_id}
            project_id={data?.project?.project_id}
          />
        </div>
        <div
          className={`mt-8 ${isModal ? 'scroll-mt-36' : 'scroll-mt-72'}`}
          id="files"
        >
          <FilesTableContainer caseId={case_id} />
        </div>

        <div className={`mt-8 mb-16`}>
          <SMTableContainer
            projectId={data.project.project_id}
            cohortFilters={projectFilter}
            tableTitle="Most Frequent Somatic Mutations"
            inModal={isModal}
            dataHook={useAdvancedSmmTableDataQuery}
          />
        </div>
      </div>
    </>
  );
};
