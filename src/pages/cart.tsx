import React from 'react';
import { NextPage } from "next";
import Cart from "@/features/cart/Cart";
import PageTitle from '@/components/PageTitle';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';

const CartPage: NextPage = () => {
  return (
    <>
      <PageTitle pageName="Cart" />
      <div className="w-full flex-col flex gap-4 fixed z-10 bg-white">
        <MainNavigation />
      </div>
      <h1 className="sr-only">Cart</h1>
      <div className="flex">
        <div className="w-full mt-[150px]">
          <Cart />
        </div>
      </div>
    </>
  );
};

export default CartPage;
