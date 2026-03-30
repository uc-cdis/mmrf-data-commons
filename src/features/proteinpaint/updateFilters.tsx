import { SelectSamplesCallBackArg } from "./sjpp-types";
import { modals } from '@mantine/modals';

export const updateFilters = (arg: SelectSamplesCallBackArg) => {
  const filters = {
    case_centric: {
      mode: 'and',
      root: {
        case_id: {
          field: 'case_id',
          operands: arg.samples,
          operator: 'in',
        },
      },
    },
  };

  modals.openContextModal({
    modal: "saveCohortModalMMRF",
    title: "Save Cohort",
    size: "md",
    zIndex: 1200,
    styles: {
      header: {
        marginLeft: "16px",
      },
    },
    innerProps: {
      filters,
    },
  });
};
