import React from 'react';
import { NextPage } from "next";
import Cart from "@/features/cart/Cart";
import PageTitle from '@/components/PageTitle';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';
import { ProtectedContent } from '@gen3/frontend';

const CartPage: NextPage = () => {
  return (
    <>
      <PageTitle pageName="Cart" />
      <ProtectedContent>
      <h1 className="sr-only">Cart</h1>
      <div className="flex">
        <div className="w-full mt-[150px]">
          <Cart />
        </div>
      </div>
      </ProtectedContent>
    </>
  );
};

export default CartPage;
