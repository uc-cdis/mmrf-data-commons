import React from "react";
import { Anchor, Checkbox, Text } from "@mantine/core";

interface DownloadAccessAgreementProps {
  readonly checked: boolean;
  readonly setChecked: (checked: boolean) => void;
  readonly dbGapList: readonly string[];
}

const DownloadAccessAgreement: React.FC<DownloadAccessAgreementProps> = ({
  checked,
  setChecked,
  dbGapList,
}: DownloadAccessAgreementProps) => {
  const dbGapLink =
    dbGapList.length === 1
      ? "https://www.ncbi.nlm.nih.gov/projects/gap/cgi-bin/study.cgi?study_id=" +
        dbGapList[0]
      : "https://www.ncbi.nlm.nih.gov/gap/?term=" +
        encodeURIComponent(
          dbGapList.reduce(
            (acc, d, idx) =>
              acc +
              "(" +
              d +
              `[Study])${idx < dbGapList.length - 1 ? " OR " : ""}`,
            "",
          ),
        );

  return (
    <>
      <Text className="text-[15px] mb-3">
        You are attempting to download files that are controlled access:
      </Text>
      <Checkbox
        data-testid="checkbox-download-agreement"
        label={
          <Text className="text-[15px]">
            I agree to abide by the{" "}
            <Anchor
              data-testid="link-gdc-data-use-agreement"
              size="sm"
              href="https://gdc.cancer.gov/about-data/data-analysis-policies"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              GDC Data Use Agreement
            </Anchor>{" "}
            and the study-specific Data Use Certification Agreement available in{" "}
            <Anchor
              data-testid="link-dbgap"
              size="sm"
              href={dbGapLink}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              dbGaP
            </Anchor>
            . This means:{" "}
          </Text>
        }
        className="mb-2"
        checked={checked}
        onChange={(event) => setChecked(event.currentTarget.checked)}
      />
      <ul className="text-[15px] pl-12 list-disc">
        <li>
          I agree not to attempt to reidentify any individual participant in any
          study represented by GDC data, for any purpose whatsoever.
        </li>
        <li>
          I agree to have read and understand study-specific Data Use Agreements
          and to comply with any additional restrictions therein.
        </li>
        <li>
          I agree to abide by the{" "}
          <a
            data-testid="link-mmrf-genomic-data-sharing-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-utility-link underline"
          >
            MMRF Data Sharing Policy
          </a>
          .
        </li>
      </ul>
    </>
  );
};

export default DownloadAccessAgreement;
