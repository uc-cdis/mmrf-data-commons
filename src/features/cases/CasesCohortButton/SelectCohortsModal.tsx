import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import useStandardPagination from "@/hooks/useStandardPagination";
import { Modal, Radio, Text, Loader } from "@mantine/core";
import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import VerticalTable from "@/components/Table/VerticalTable";
import {
  selectAvailableCohorts,
  useCoreSelector,
  selectCohortFilters,
} from "@gen3/core";
import { HandleChangeInput } from "@/components/Table/types";

export type WithOrWithoutCohortType = "with" | "without" | undefined;

export const SelectCohortsModal = ({
  opened,
  onClose,
  withOrWithoutCohort,
  pickedCases,
  currentFilters,
  onSaveCohort,
}: {
  opened: boolean;
  onClose: () => void;
  withOrWithoutCohort: WithOrWithoutCohortType;
  pickedCases: readonly string[];
  currentFilters: any;
  onSaveCohort: (combinedFilters: any) => void;
}): JSX.Element => {
  const cohorts = useCoreSelector((state) => selectAvailableCohorts(state));
  const [checkedValue, setCheckedValue] = useState("");
  const cohortFilter = useCoreSelector((state) => selectCohortFilters(state));
  const [loading, setLoading] = useState(false);

  const isWithCohort = withOrWithoutCohort === "with";

  console.log({ cohorts });
  const cohortListData = useMemo(
    () =>
      cohorts
        ?.sort((a, b) => a.name.localeCompare(b.name))
        .map((cohort) => ({
          cohort_id: cohort?.id,
          name: cohort?.name,
          num_cases: cohort?.counts?.case_centric?.toLocaleString(),
        })),
    [cohorts],
  );

  console.log({ cohortListData });
  const cohortListTableColumnHelper =
    createColumnHelper<(typeof cohortListData)[0]>();

  const cohortListTableColumn = useMemo(
    () => [
      cohortListTableColumnHelper.display({
        id: "select",
        header: "Select",
        cell: ({ row }) => (
          <Radio
            data-testid={`radio-${row.original.name}`}
            value={row.original.cohort_id}
            checked={checkedValue === row.original.cohort_id}
            onChange={(event) => {
              setCheckedValue(event.currentTarget.value);
            }}
          />
        ),
      }),
      cohortListTableColumnHelper.accessor("name", {
        id: "name",
        header: "Name",
        cell: ({ getValue, row }) => (
          <span data-testid={`text-${row.original.name}-cohort-name`}>
            {getValue()}
          </span>
        ),
      }),
      cohortListTableColumnHelper.accessor("num_cases", {
        id: "num_cases",
        header: "# Cases",
        cell: ({ getValue, row }) => (
          <span data-testid={`text-${row.original.name}-cohort-count`}>
            {getValue()}
          </span>
        ),
      }),
    ],
    [cohortListTableColumnHelper, checkedValue],
  );

  const {
    handlePageChange,
    handlePageSizeChange,
    page,
    pages,
    size,
    from,
    total,
    displayedData,
  } = useStandardPagination(cohortListData);

  const handleSubmit = async () => {
    if (loading || !checkedValue || !cohortFilter) return;

    setLoading(true);
  };

  const handleChange = (obj: HandleChangeInput) => {
    switch (Object.keys(obj)?.[0]) {
      case "newPageNumber":
        handlePageChange(obj.newPageNumber as number); // probably need to double check this
        break;
      case "newPageSize":
        handlePageSizeChange(obj.newPageSize as string); // probably need to double check this
        break;
    }
  };

  const title = `save new cohort: existing cohort ${
    isWithCohort ? "with" : "without"
  } selected cases`;

  const description = `Select an existing cohort, then click Submit. This will save a new
    cohort that contains all the cases from your selected cohort ${
      isWithCohort ? "and" : "except"
    } the cases previously selected.`;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton
      title={title}
      classNames={{
        content: "p-0 drop-shadow-lg",
        body: "flex flex-col justify-between min-h-[300px]",
      }}
      size="xl"
      zIndex={400}
    >
      <div className="px-4">
        <Text className="text-sm mb-4 block font-content">{description}</Text>

        <VerticalTable
          customDataTestID="table-select-cohort"
          data={displayedData}
          columns={cohortListTableColumn}
          status="fulfilled"
          pagination={{
            page,
            pages,
            size,
            from,
            total,
            label: "cohort",
          }}
          handleChange={handleChange}
        />
      </div>
      <div
        data-testid="modal-button-container"
        className="bg-base-lightest flex p-4 gap-4 justify-end mt-4 rounded-b-lg sticky"
      >
        <FunctionButton data-testid="button-cancel" onClick={onClose}>
          Cancel
        </FunctionButton>
        <DarkFunctionButton
          data-testid="button-submit"
          disabled={!checkedValue}
          loading={loading}
          leftSection={loading ? <Loader size={15} color="white" /> : undefined}
          onClick={handleSubmit}
        >
          Submit
        </DarkFunctionButton>
      </div>
    </Modal>
  );
};
