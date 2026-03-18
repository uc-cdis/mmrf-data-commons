import React, { ReactNode } from 'react';
import { Icon } from '@iconify-icon/react';
import Link from 'next/link';
import {
  ExplorerTableCellRendererFactory,
  type CellRendererFunctionProps,
} from '@gen3/frontend';
import { ActionIcon, Text } from '@mantine/core';
import { FaExternalLinkAlt } from 'react-icons/fa';


const RenderDicomLink = ({ cell }: CellRendererFunctionProps) => {
  if (!cell?.getValue() || cell?.getValue() === '') {
    return <span></span>;
  } else
    return (
      <a href={`${cell.getValue()}`} target="_blank" rel="noreferrer">
        <ActionIcon color="accent.5" size="md" variant="filled">
          <FaExternalLinkAlt />
        </ActionIcon>
      </a>
    );
};

const JoinFields = (
  { cell, row }: CellRendererFunctionProps,
  ...args: Array<Record<string, unknown>>
) => {
  if (!cell?.getValue() || cell?.getValue() === '') {
    return <span></span>;
  } else {
    if (
      typeof args[0] === 'object' &&
      Object.keys(args[0]).includes('otherFields')
    ) {
      const otherFields = args[0].otherFields as Array<string>;
      const labels = otherFields.map((field) => {
        return row.getValue(field);
      });
      return <Text fw={600}> {labels.join(' ')}</Text>;
    }
  }
  return <span>Not configured</span>;
};

const RenderLinkCell = ({ cell }: CellRendererFunctionProps) => {
  return (
    <a href={`${cell.getValue()}`} target="_blank" rel="noreferrer">
      <Text c="blue" td="underline" fw={700}>
        {' '}
        {cell.getValue() as ReactNode}{' '}
      </Text>
    </a>
  );
};

interface RenderNextLinkCellWithIconParams {
  baseURL?: string;
  icon?: string;
  size?: string;
  iconHeight?: string;
  linkField?: string; // field to use for link instead of cell value
  classNames?: {
    icon?: string;
    text?: string;
  };
}
const isRenderNextLinkCellWithIconParams = (
  value: unknown,
): value is RenderNextLinkCellWithIconParams => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    (obj.baseURL === undefined || typeof obj.baseURL === 'string') &&
    (obj.icon === undefined || typeof obj.icon === 'string') &&
    (obj.size === undefined || typeof obj.size === 'string') &&
    (obj.linkField === undefined || typeof obj.linkField === 'string')
  );
};

const RenderRepositoryFilenameWithLink = (
  { cell }: CellRendererFunctionProps,
  ...args: Array<Record<string, any>>
) => {
  let baseURL = '';
  let icon: string | null = null;
  let size = 'sm';
  let iconHeight = '1em';
  let linkField: string | undefined = undefined;
  let classNames: Partial<{
    icon: string;
    text: string;
  }> = {
    icon: '',
    text: '',
  };

  const params = args[0];
  if (isRenderNextLinkCellWithIconParams(params)) {
    baseURL = params.baseURL ?? baseURL;
    if (params.icon) {
      icon = params.icon;
    }
    size = params.size ?? size;
    iconHeight = params.iconHeight ?? iconHeight;
    linkField = params.linkField ?? undefined;
    classNames = params?.classNames ?? {
      icon: '',
      text: '',
    };
  }

  let linkURL = `${baseURL}${cell.getValue()}`;
  if (linkField) {
    const value = cell.row.original[linkField];
    if (typeof value === 'string') {
      linkURL = `${baseURL}${value}`;
    }
  }

  return (
    <Link href={linkURL} target="_blank" rel="noreferrer">
      <div className="flex items-center gap-1">
        {icon && <Icon height={iconHeight} icon={icon} />}
        <Text fw={700} size={size} classNames={{ root: classNames?.text }}>
          {cell.getValue() as string ?? ''}
        </Text>
      </div>
    </Link>
  );
};


export const registerCohortTableCustomCellRenderers = () => {
  ExplorerTableCellRendererFactory().registerRenderer(
    'link',
    'DicomLink',
    RenderDicomLink,
  );
  ExplorerTableCellRendererFactory().registerRenderer(
    'string',
    'JoinFields',
    JoinFields,
  );
  ExplorerTableCellRendererFactory().registerRenderer(
    'link',
    'linkURL',
    RenderLinkCell,
  );
  ExplorerTableCellRendererFactory().registerRenderer(
    'link',
    'filenameWithLink',
    RenderRepositoryFilenameWithLink,
  );
};
