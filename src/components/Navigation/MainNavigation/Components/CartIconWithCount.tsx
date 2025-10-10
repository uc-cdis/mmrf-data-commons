import React from 'react';
import { Badge} from "@mantine/core";
import { useRouter } from "next/router";
import { useCoreSelector, selectCartCount} from '@gen3/core';
import { IconButton } from "@gen3/frontend";


const CartIconWithCount = () => {
  const currentCartTotal = useCoreSelector((state) => selectCartCount(state));
  const router = useRouter();

  const styling = {
    root: `flex items-center align-middle px-1 my-2`,
    button:
  'flex flex-nowrap items-center align-middle border-b-2 border-transparent',
    leftIcon: 'text-secondary-contrast-lighter pr-1',
    label: 'font-content text-secondary-contrast-lighter block',
    rightIcon: 'text-secondary-contrast-lighter pl-1',
};

  return (
    <div className="flex flex-nowrap items-center">
      <IconButton
        name="Cart"
        rightIcon="mmrf:cart"
        classNames={styling}
      />
      <Badge
        variant="filled"
        className={`px-1 ml-1 ${
          router.pathname === "/cart"
            ? "bg-white text-secondary"
            : "bg-accent-vivid"
        }`}
        radius="xs"
      >
        {currentCartTotal.toLocaleString() || 0}
      </Badge>
    </div>
  )
}

export default CartIconWithCount;
