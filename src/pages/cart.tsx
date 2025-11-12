import React from "react";
import { NextPage } from "next";
import Cart from "@/features/cart/Cart";
import PageTitle from "@/components/PageTitle";
import { ProtectedContent } from "@gen3/frontend";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";

const CartPage: NextPage = () => {
  return (
    <>
      <PageTitle pageName="Cart" />
      <ProtectedContent>
      <h1 className="sr-only">Cart</h1>
      <SummaryHeader
        headerTitleLeft="Cart"
        headerTitle=""
        iconPath="mmrf:cart"
      />
      <Cart />
      </ProtectedContent>
    </>
  );
};

export default CartPage;
