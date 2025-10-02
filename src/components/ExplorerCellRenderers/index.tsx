import React from 'react';
import {
  CellRendererFunctionProps,
  ExplorerTableCellRendererFactory,
} from '@gen3/frontend';
import { PopupIconButton } from '@/components/PopupIconButton/PopupIconButton';

export const PopupIconLink = (
  { cell }: CellRendererFunctionProps,
  params: Record<string, any>,
) => {
  const value = cell.getValue() as string;

  return (
    <PopupIconButton
      handleClick={() => {}}
      label={value}
      customStyle="text-utility-link underline font-content text-left"
    />
  );
};

export const registerMMRFTableCellRenderers = () => {
  ExplorerTableCellRendererFactory().registerRenderer("link",
      "modalLink",  PopupIconLink,
  );
};
