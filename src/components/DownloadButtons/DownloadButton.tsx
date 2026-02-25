
import React, { Dispatch, SetStateAction, forwardRef, useCallback } from "react";
import { ButtonProps } from "@mantine/core";
import {
  downloadWithArgs,
} from '../../utils/downloads';
import { FilterSet, EmptyFilterSet } from "@gen3/core";
import { useGuppyActionButton } from '@gen3/frontend';
import FunctionButton, {
  FunctionButtonVariants,
} from "@/components/FunctionButton";
import { ADDITIONAL_DOWNLOAD_MESSAGE } from "@/utils/constants";

/**
 * Properties for the DownloadButton component.
 * @category Buttons
 * @property endpoint - The endpoint to download from.
 * @property disabled - Whether the button is disabled.
 * @property buttonTitle - The text to display when the button is inactive.
 * @property filename - The name of the file to download.
 * @property size - The size of the download.
 * @property format - The format of the download.
 * @property fields - The fields to download.
 * @property caseFilters - The case filters to download.
 * @property filters - The filters to download.
 * @property extraParams - Any extra parameters to download.
 * @property method - The method to use for the download.
 * @property customStyle - Any custom styles to apply to the button.
 * @property preventClickEvent - Whether to prevent the default click event.
 * @property onClick - The function to call when the button is clicked.
 * @property setActive - The function to call when the button is set active.
 * @property active - Whether the button is active.
 * @property Modal403 - The modal to display when a 403 error occurs.
 * @property Modal400 - The modal to display when a 400 error occurs.
 * @property toolTip - The tooltip to display.
 */
interface DownloadButtonProps {
  endpoint: string;
  caseIdField: string;
  disabled?: boolean;
  buttonLabel: string;
  filename?: string;
  downloadSize?: number;
  format?: string;
  fields?: Array<string>;
  caseFilters?: FilterSet;
  filters?: FilterSet;
  extraParams?: Record<string, any>;
  method?: string;
  customStyle?: string;
  preventClickEvent?: boolean;
  onClick?: () => void;
  setActive?: Dispatch<SetStateAction<boolean>>;
  active?: boolean;
  toolTip?: string;
  multilineTooltip?: boolean;
  displayVariant?: FunctionButtonVariants;
  disableResponsiveIcon?: boolean;
}

/**
 * A Button component that downloads data from a given endpoint.
 * The component will handle all download logic including fetching
 * the data, creating the file, and downloading the file.
 * @param endpoint - The endpoint to download from.
 * @param disabled - Whether the button is disabled.
 * @param buttonLabel - button's label.
 * @param filename - The name of the file to download.
 * @param downloadSize - The size of the download.
 * @param format - The format of the download.
 * @param fields - The fields to download.
 * @param caseFilters - The case filters to download.
 * @param filters - The filters to download.
 * @param extraParams - Any extra parameters to download.
 * @param method - The method to use for the download.
 * @param customStyle - Any custom styles to apply to the button.
 * @param preventClickEvent - Whether to prevent the default click event.
 * @param onClick - The function to call when the button is clicked.
 * @param setActive - The function to call when the button is set active.
 * @param active - Whether the button is active.
 * @param Modal403 - The modal to display when a 403 error occurs.
 * @param Modal400 - The modal to display when a 400 error occurs.
 * @param toolTip - The tooltip to display.
 * @param multilineTooltip - The tooltip will be displayed in multiple lines
 * @category Buttons
 */
export const DownloadButton = forwardRef<
  HTMLButtonElement,
  DownloadButtonProps & ButtonProps
>(
  (
    {
      endpoint,
      caseIdField,
      disabled = false,
      filename,
      downloadSize = 10000,
      format = "json",
      fields = [],
      caseFilters = EmptyFilterSet,
      filters = EmptyFilterSet,
      buttonLabel,
      extraParams,
      method = "POST",
      setActive,
      onClick,
      preventClickEvent = false,
      active,
      toolTip = "",
      multilineTooltip = false,
      displayVariant,
      disableResponsiveIcon = false,
      ...buttonProps
    }: DownloadButtonProps,
    ref,
  ) => {

    const { handleClick, active: downloadActive, cancel }  = useGuppyActionButton(
      {
        actionFunction: downloadWithArgs, actionArgs: {
          format: format,
          fields: fields,
          index: endpoint,
          caseIdField,
          cohortFilters: caseFilters,
          filters,
          filename: filename ?? "download.json",
          ...extraParams
        }
      }
    )

    const clickHandler = useCallback(() => {
      if (disabled) return;
      if (!downloadActive) handleClick();
      else cancel();
    }, [downloadActive, disabled, handleClick, cancel]);

    const tooltipContent = downloadActive ? ADDITIONAL_DOWNLOAD_MESSAGE : toolTip;

    return (
      <FunctionButton
        $variant={displayVariant}
        ref={ref}
        isActive={downloadActive}
        isDownload
        disableResponsiveIcon={disableResponsiveIcon}
        showDownloadIcon
        tooltip={tooltipContent}
        multilineTooltip={multilineTooltip}
        disabled={disabled}
        variant="outline"
        onClick={clickHandler}
        {...buttonProps}
      >
        {downloadActive ? "Cancel" : buttonLabel}
      </FunctionButton>
    );
  },
);

DownloadButton.displayName = "DownloadButton";
