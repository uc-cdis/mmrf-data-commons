import React from 'react';
import { NextPage } from "next";
import Cart from "@/features/cart/Cart";
import PageTitle from '@/components/PageTitle';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';
import { ProtectedContent } from '@gen3/frontend';
import { SummaryHeader } from '@/components/Summary/SummaryHeader';

const CartPage: NextPage = () => {
  return (
    <>
      <PageTitle pageName="Cart" />
      <div className="w-full flex-col gap-4 bg-white">
      <div className="w-full fixed z-10 bg-white">
        <MainNavigation />
      <ProtectedContent>
        <div className="flex-col mt-4 z-0">
          <SummaryHeader headerTitleLeft="Cart" headerTitle="" iconPath="mmrf:cart"/>
          <Cart />
        </div>
      </ProtectedContent>
      </div>
      </div>
    </>
  );
};

export default CartPage;
