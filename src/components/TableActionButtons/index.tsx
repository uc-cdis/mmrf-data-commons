import React from 'react';
import { addToCart, removeFromCart } from '@/features/cart/updateCart';
import { CartIcon } from '@/utils/icons';
import { CartFile, GdcFile } from '@/core';
import { Button } from '@mantine/core';
import { DownloadFile } from '../DownloadButtons';
import { useCoreDispatch, useCoreSelector } from '@gen3/core';

export const TableActionButtons = ({
  isOutputFileInCart,
  file,
  downloadFile,
  setFileToDownload,
}: {
  isOutputFileInCart: boolean;
  file: CartFile[];
  downloadFile: GdcFile;
  setFileToDownload: React.Dispatch<React.SetStateAction<GdcFile>>;
}): JSX.Element => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();

  return (
    <div className="flex gap-3">
      <Button
        className={`${
          isOutputFileInCart
            ? 'bg-primary text-base-max'
            : 'bg-base-max text-primary'
        } border border-primary rounded px-2 h-6 w-8
         hover:bg-primary hover:text-base-lightest`}
        onClick={() => {
          if (isOutputFileInCart) {
            removeFromCart(file, currentCart, dispatch);
          } else {
            addToCart(file, currentCart, dispatch);
          }
        }}
        data-testid="button-add-remove-cart"
      >
        <CartIcon title="Add to Cart" size={16} />
      </Button>
      <DownloadFile
        customDataTestID="button-download-file"
        file={downloadFile}
        setfileToDownload={setFileToDownload}
        displayVariant="icon"
      />
    </div>
  );
};
