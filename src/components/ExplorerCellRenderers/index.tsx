import React from 'react';
import {
  CellRendererFunctionProps,
  ExplorerTableCellRendererFactory,
} from '@gen3/frontend';
import { PopupIconButton } from '@/components/PopupIconButton/PopupIconButton';
import { Image } from '@/components/Image';
import Link from 'next/link';

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

export const OpenLinkInTab = (
  { cell, row }: CellRendererFunctionProps,
  params: Record<string, any>,
) => {
  const value = cell.getValue() as string;
  const { linkField, href } = params;
  const id = row.original?.[linkField]
  const uuid = encodeURIComponent(id?.toString() ?? "")

  return (
    <div className="flex flex-nowrap items-center align-middle gap-2">
      <Image
        src="/icons/OpenModal.svg"
        width={10}
        height={18}
        layout="fixed"
        alt=""
      />
      <Link
        href={`${href ?? '/'}${uuid?.toString()}`}
        target="_blank" rel="noopener noreferrer"
        className="text-utility-link underline font-content text-left"
      >
        {value?.toString() || ''}
      </Link>
    </div>
  );
};

export const registerMMRFTableCellRenderers = () => {
  ExplorerTableCellRendererFactory().registerRenderer("link",
      "modalLink",  PopupIconLink,
  );
  ExplorerTableCellRendererFactory().registerRenderer("link",
    "openLinkInTab",  OpenLinkInTab,
  );
};
