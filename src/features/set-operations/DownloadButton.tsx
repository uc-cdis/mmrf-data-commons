import React, { useEffect, useState } from "react";
import { ActionIcon, Loader, Tooltip, Modal } from "@mantine/core";
import { SetOperationEntityType } from "@/features/set-operations/types";
import {
  GQLFilter,
  useCoreDispatch,
} from "@gen3/core";
import { getFormattedTimestamp } from "@/utils/date";
import ModalButtonContainer from "@/components/StyledComponents/ModalButtonContainer";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";
import { DownloadIcon } from "@/utils/icons";

const ENTITY_TYPE_TO_TAR = {
  cohort: "case",
};

interface DownloadButtonProps {
  readonly entityType: SetOperationEntityType;
  readonly filters: GQLFilter;
  readonly setKey: string;
  readonly disabled: boolean;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  entityType,
  filters,
  setKey,
  disabled,
}: DownloadButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const dispatch = useCoreDispatch();
  // TODO: complete when download endpoint is finished
  const response = { isLoading: false, isSuccess: false, isError: false, data: ""  };

  useEffect(() => {
    if (response.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [response.isLoading]);

  return (
    <>
      <Modal
        opened={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Export Set Error"
      >
        <p className="py-2 px-4">There was a problem exporting the set.</p>
        <ModalButtonContainer data-testid="modal-button-container">
          <DarkFunctionButton onClick={() => setShowErrorModal(false)}>
            OK
          </DarkFunctionButton>
        </ModalButtonContainer>
      </Modal>
      <Tooltip
        label={disabled ? "No items to export" : "Export as TSV"}
        withArrow
      >
        <div className="w-fit">
          <ActionIcon
            data-testid="button-download-tsv-set-operations"
            onClick={() => {}
              // TODO: complete when download endpoint is finished
              // createSet({ filters, set_type: "instant", intent: "portal" })
            }
            color="primary"
            variant="outline"
            className={`${
              disabled
                ? "bg-base-lighter"
                : "bg-base-max hover:bg-primary hover:text-base-max"
            }`}
            disabled={disabled}
            aria-label="download TSV"
          >
            {loading ? (
              <Loader size={14} />
            ) : (
              <DownloadIcon aria-hidden="true" />
            )}
          </ActionIcon>
        </div>
      </Tooltip>
    </>
  );
};

export default DownloadButton;
