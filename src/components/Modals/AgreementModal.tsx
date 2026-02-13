import React from "react";
import { GdcFile } from "@/core";
import { Button, Text } from "@mantine/core";
import { SetStateAction, useEffect, useState } from "react";
import { DownloadButton } from "@/components/DownloadButtons";
import DownloadAccessAgreement from "./DownloadAccessAgreement";
import { ContextModalProps } from '@mantine/modals';

interface AgreementModalProps {
  file: GdcFile;
  dbGapList?: readonly string[];
}

export const AgreementModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<AgreementModalProps>) => {
  const [checked, setChecked] = useState(false);

  const { file, dbGapList} = innerProps;

  return (
    <>
      <div className="border-y border-y-base-darker py-4">
        <DownloadAccessAgreement
          checked={checked}
          setChecked={setChecked}
          dbGapList={dbGapList as string[]}
        />
      </div>
      <div className="flex justify-end mt-2.5 gap-2">
        <Button
          data-testid="button-cancel"
          onClick={() => context.closeModal(id)}
          className="!bg-primary hover:!bg-primary-darker"
        >
          Cancel
        </Button>
        { /* ---- TODO: replace with Presigned URL download button
        <DownloadButton
          data-testid="button-download"
          disabled={!checked}
          filename={file?.file_name}
          extraParams={{
            ids: file?.file_id,
            annotations: true,
            related_files: true,
          }}
          endpoint={`data/${file?.file_id}`}
          buttonLabel="Download"
          method="GET"
          setActive={setActive}
          active={active}
          displayVariant="filled"
          caseIdField="cases.case_id"
        /> ---- */}
      </div>
    </>
  );
};
