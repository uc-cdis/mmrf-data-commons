import React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Tooltip } from '@mantine/core';
import { truncate } from 'lodash';
import Link from 'next/link';
import { entityMetadataType } from '../../../../utils/contexts';
import { PopupIconButton } from '@/components/PopupIconButton/PopupIconButton';

const SMTableProteinChange = ({
  proteinChange,
  shouldLink,
  shouldOpenModal,
  setEntityMetadata,
  ariaId,
}: {
  proteinChange: {
    symbol: string;
    aaChange: string;
    geneId: string;
  };
  shouldOpenModal: boolean;
  shouldLink: boolean;
  setEntityMetadata: Dispatch<SetStateAction<entityMetadataType>>;
  ariaId?: string;
}): JSX.Element => {
  const { symbol = '', aaChange = '' } = proteinChange;
  return (
    <div className="font-content flex w-max flex-row justify-start">
      {!symbol && !aaChange ? (
        '--'
      ) : (
        <>
          {shouldOpenModal ? (
            <PopupIconButton
              customStyle="text-utility-link underline mx-0.5 font-content self-center"
              handleClick={() =>
                setEntityMetadata({
                  entity_type: 'genes',
                  entity_id: proteinChange.geneId,
                })
              }
              label={symbol}
              ariaId={ariaId}
            />
          ) : shouldLink ? (
            <Link
              href={`/genes/${proteinChange.geneId}`}
              className="text-utility-link underline"
              id={ariaId}
            >
              {symbol}
            </Link>
          ) : (
            <span className="mx-0.5" id={ariaId}>
              {symbol}
            </span>
          )}
          <Tooltip label={aaChange}>
            <span className={`${aaChange !== '' && 'mx-0.5'}`}>
              {truncate(aaChange == '' ? '--' : aaChange, {
                length: 12,
              })}
            </span>
          </Tooltip>
        </>
      )}
    </div>
  );
};

export default SMTableProteinChange;
