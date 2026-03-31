import React, { useCallback } from 'react';
import { Button, Tooltip } from '@mantine/core';
import { saveAs } from 'file-saver';
import { COHORT_FILTER_INDEX } from '@/core';
import { useLazyCohortCaseIdQuery } from '@/core/features/cases/caseSlice';
import {
  selectCurrentCohortFilters,
  selectCurrentCohortName,
  useCoreSelector,
} from '@gen3/core';
import { DownloadIcon, UploadIcon } from '@/utils/icons';

const CohortExportButton: React.FC = () => {
  const [fetchCaseIds, { isFetching }] = useLazyCohortCaseIdQuery();
  const filters = useCoreSelector((state) => selectCurrentCohortFilters(state));
  const cohortName = useCoreSelector((state) => selectCurrentCohortName(state));
  const handleExport = useCallback(async () => {
    try {
      const caseIds = await fetchCaseIds({
        filter: filters[COHORT_FILTER_INDEX],
        additionalFields: ['submitter_id'],
      }).unwrap();

      const header = 'case_id\tsubmitter_id\n';
      const rows = (caseIds ?? []).map((x) => x.replace(',','\t')).join('\n');
      const tsv = [header, rows].join('\n');

      const blob = new Blob([tsv], { type: 'text/tab-separated-values' });
      saveAs(blob, `${cohortName}.tsv`);
    } catch (error) {
      console.error('Failed to export case IDs:', error);
    }
  }, [fetchCaseIds, filters]);

  return (
    <Tooltip label="Export Cohort" position="bottom" withArrow>
      <Button onClick={handleExport} loading={isFetching}>
        <DownloadIcon size="1.715em" aria-hidden="true" />
      </Button>
    </Tooltip>
  );
};

export default CohortExportButton;
