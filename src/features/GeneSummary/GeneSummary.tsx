import React, { useMemo } from 'react';
import { FilterSet } from '@gen3/core';
import { AnchorLink } from '@/components/AnchorLink';
import { CollapsibleTextArea } from '@/components/CollapsibleTextArea';
import { SummaryCard } from '@/components/Summary/SummaryCard';
import { SummaryHeader } from '@/components/Summary/SummaryHeader';
import { SummaryErrorHeader } from '@/components/Summary/SummaryErrorHeader';
import {
  useGeneSummaryQuery,
  // useCoreSelector,
  // selectCurrentCohortFilters,
} from '@/core';
import { externalLinkNames, externalLinks, humanify } from '../../utils';
import CNVPlot from '../charts/CNVPlot';
import SSMPlot from '../charts/SSMPlot';
import { formatDataForHorizontalTable } from '../files/utils';
import { LoadingOverlay } from '@mantine/core';
import { HeaderTitle } from '@/components/tailwindComponents';
// import { useIsDemoApp } from "@/hooks/useIsDemoApp";
//import { overwritingDemoFilterMutationFrequency } from "../genomic/GenesAndMutationFrequencyAnalysisTool";
import { CollapsibleList } from '@/components/CollapsibleList';
import SMTableContainer from '../GenomicTables/SomaticMutationsTable/SMTableContainer';
import GeneCancerDistributionTable from '../CancerDistributionTable/GeneCancerDistributionTable';
import GenesIcon from 'public/user-flow/icons/summary/genes.svg';
import { StrandMinusIcon, StrandPlusIcon } from '@/utils/icons';
import { WarningBanner } from '@/components/WarningBanner';

interface GeneSummaryData {
  symbol: string;
  name: string;
  synonyms: Array<string>;
  biotype: string;
  gene_chromosome: string;
  gene_start: number;
  gene_end: number;
  gene_strand: number;
  description: string;
  is_cancer_gene_census: boolean;
  civic?: string;
  gene_id: string;
  external_db_ids: {
    entrez_gene: string[];
    uniprotkb_swissprot: string[];
    hgnc: string[];
    omim_gene: string[];
  };
}

interface GeneViewProps {
  data: GeneSummaryData;
  gene_id: string;
  isModal: boolean;
  contextSensitive: boolean;
  contextFilters: FilterSet;
}

export const GeneSummary = ({
  gene_id,
  isModal = false,
  contextSensitive = false,
  contextFilters = undefined,
}: {
  gene_id: string;
  isModal?: boolean;
  contextSensitive?: boolean;
  contextFilters?: any; // FilterSet;
}): JSX.Element => {
  const { data, isFetching } = useGeneSummaryQuery({
    gene_id,
  });
  console.log('THIS IS THE DATA WE WANT TO MOCK', data);

  return (
    <>
      {isFetching ? (
        <LoadingOverlay data-testid="loading-spinner" visible />
      ) : data ? (
        <GeneView
          data={data}
          gene_id={gene_id}
          isModal={isModal}
          contextSensitive={contextSensitive}
          contextFilters={contextFilters}
        />
      ) : (
        <>
          SUMMARY ERROR HEADER
          <SummaryErrorHeader label="Gene Not Found" />
        </>
      )}
    </>
  );
};

const GeneView = ({
  data,
  gene_id,
  isModal,
  contextFilters = undefined as unknown as FilterSet,
  contextSensitive = false,
}: GeneViewProps) => {
  const isDemo = false;
  /*   const currentCohortFilters = useCoreSelector((state: any) =>
    selectCurrentCohortFilters(state),
  ); */

  // Since genomic filter lies in different store, it cannot be accessed using selectors.
  // Hence, passing it via a callback as contextFilters
  const genomicFilters = useMemo(
    () => (contextSensitive ? contextFilters : undefined),
    [contextFilters, contextSensitive],
  );
  const cohortFilters: FilterSet = undefined as unknown as FilterSet;

  if (contextSensitive) {
    // if it's for mutation frequency demo use different filter (TCGA-LGG) than the current cohort filter
    if (isDemo) {
      // We will not be supporting the demo initially
      return;
      // cohortFilters = overwritingDemoFilterMutationFrequency;
    } else {
      // cohortFilters = currentCohortFilters;
      return;
    }
  }

  const formatDataForSummary = () => {
    const {
      symbol,
      name,
      synonyms,
      biotype: type,
      gene_chromosome,
      gene_start,
      gene_end,
      gene_strand,
      description,
      is_cancer_gene_census,
    } = data;

    const location = `chr${gene_chromosome}:${gene_start}-${gene_end} (GRCh38)`;
    const Strand =
      gene_strand && gene_strand === 1 ? (
        <StrandPlusIcon />
      ) : (
        <StrandMinusIcon />
      );
    const annotation = is_cancer_gene_census ? (
      <AnchorLink
        href="https://cancer.sanger.ac.uk/census"
        title="Cancer Gene Census"
      />
    ) : (
      '--'
    );
    const synonymsList = synonyms?.length && (
      <ul>
        {synonyms?.map((s: any) => (
          <li className="list-none" key={s}>
            {s}
          </li>
        ))}
      </ul>
    );

    const desc = <CollapsibleTextArea text={description} />;

    const summaryObj = {
      symbol,
      name,
      synonyms: synonymsList,
      type,
      location,
      Strand,
      description: desc,
      annotation,
    };

    const headersConfig = Object.keys(summaryObj).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));

    return formatDataForHorizontalTable(summaryObj, headersConfig);
  };

  const formatDataForExternalReferences = () => {
    const {
      external_db_ids: { entrez_gene, uniprotkb_swissprot, hgnc, omim_gene },
      gene_id,
      civic,
    } = data;

    const externalLinksObj = {
      entrez_gene,
      uniprotkb_swissprot,
      hgnc,
      omim_gene,
      ensembl: gene_id,
      civic,
    };

    let externalReferenceLinksobj = {};

    Object.keys(externalLinksObj).forEach((link) => {
      const modified = {
        [`${externalLinkNames[link as keyof typeof externalLinkNames] || link.replace(/_/, ' ')}`]:
          (externalLinksObj[link as keyof typeof externalLinkNames]
            ?.length as number) > 0 ? (
            <>
              {Array.isArray(
                externalLinksObj[link as keyof typeof externalLinkNames],
              ) ? (
                <CollapsibleList
                  data={(
                    externalLinksObj[
                      link as keyof typeof externalLinkNames
                    ] as string[]
                  ).map((item) => (
                    <AnchorLink
                      href={externalLinks[link as keyof typeof externalLinks](
                        item,
                      )}
                      title={item}
                      key={item}
                    />
                  ))}
                />
              ) : (
                <AnchorLink
                  href={externalLinks[link as keyof typeof externalLinks](
                    externalLinksObj[
                      link as keyof typeof externalLinkNames
                    ] as string,
                  )}
                  title={
                    externalLinksObj[
                      link as keyof typeof externalLinkNames
                    ] as string
                  }
                  key={
                    externalLinksObj[
                      link as keyof typeof externalLinkNames
                    ] as string
                  }
                />
              )}
            </>
          ) : (
            '--'
          ),
      };

      externalReferenceLinksobj = { ...externalReferenceLinksobj, ...modified };
    });

    const headersConfig = Object.keys(externalReferenceLinksobj).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));

    return formatDataForHorizontalTable(
      externalReferenceLinksobj,
      headersConfig,
    );
  };

  return (
    <div>
      {data && (
        <>
          <SummaryHeader
            iconPath="/icons/genes.svg"
            headerTitleLeft="GENE"
            headerTitle={data.symbol}
            isModal={isModal}
          />

          <div className={`${!isModal ? 'mt-6' : 'mt-4'} mx-4`}>
            {contextSensitive && (
              <div className="my-6 pt-20">
                <WarningBanner
                  text={
                    'Viewing subset of the GDC based on your current cohort and Mutation Frequency filters.'
                  }
                />
              </div>
            )}
            <div className="pt-20 flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <SummaryCard
                  customDataTestID="table-summary-gene-summary"
                  tableData={formatDataForSummary()}
                />
              </div>
              <div className="flex-1">
                <SummaryCard
                  customDataTestID="table-external-references-gene-summary"
                  tableData={formatDataForExternalReferences()}
                  title="External References"
                />
              </div>
            </div>
            <div
              data-testid="table-cancer-distribution-gene-summary"
              className="mt-8"
            >
              <HeaderTitle>Cancer Distribution</HeaderTitle>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <SSMPlot
                  page="gene"
                  gene={gene_id}
                  height={200}
                  genomicFilters={genomicFilters}
                  cohortFilters={cohortFilters}
                />
                <CNVPlot
                  gene={gene_id}
                  height={200}
                  genomicFilters={genomicFilters}
                  cohortFilters={cohortFilters}
                />
              </div>
              <div className="mt-8">
                <GeneCancerDistributionTable
                  gene={gene_id}
                  symbol={data.symbol}
                  genomicFilters={genomicFilters}
                  cohortFilters={cohortFilters}
                />
              </div>

              <div className="mt-8 mb-16">
                <SMTableContainer
                  geneSymbol={data.symbol}
                  gene_id={gene_id}
                  cohortFilters={cohortFilters}
                  genomicFilters={genomicFilters}
                  isModal={isModal}
                  inModal={isModal}
                  tableTitle="Most Frequent Somatic Mutations"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
