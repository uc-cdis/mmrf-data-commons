import React from "react";
import { Grid } from "@mantine/core";
import {
  // useCartSummaryQuery,
  useCoreSelector,
  ////  selectCart,
  useFetchUserDetailsQuery,
  UserProfile,
  CoreState,
  AuthzMapping,
  selectCart,
} from '@gen3/core';
import FilesTable from "./FilesTable";
import ProjectTable from "./ProjectTable";
import CartHeader from "./CartHeader";
import AuthorizationTable from "./AuthorizationTable";
import { groupByAccess } from "./utils";
import { HeaderTitle } from "@/components/tailwindComponents";
import DownloadInfo from "./DownloadInfo";
import { CartIcon } from "@/utils/icons";
import {useCartSummaryQuery  } from "@/core";

const Cart: React.FC = () => {
   const cart = useCoreSelector((state:CoreState) => selectCart(state));

  const { data: summaryData } = useCartSummaryQuery(cart.map((f) => f.file_id));

  const { data: userDetails, isFetching: userDetailsFetching } =
    useFetchUserDetailsQuery();

  console.log("userDetails", userDetails);
 //  const filesByCanAccess = groupByAccess(cart, userDetails?.data ? userDetails.data : {} as unknown as AuthzMapping);
   const filesByCanAccess: any = {};
  const dbGapList = Array.from(
    new Set(
      (filesByCanAccess?.true || [])
        .reduce((acc: any, f: any) => acc.concat(f.acl), [])
        .filter((f :any) => f !== "open"),
    ),
  );

  return cart.length === 0 ? (
    <Grid justify="center" className="bg-base-lightest flex-grow">
      <Grid.Col span={4} className="my-20 flex flex-col items-center">
        <div className="h-40 w-40 rounded-[50%] bg-emptyIconLighterColor flex justify-center items-center">
          <CartIcon size={80} className="text-primary-darkest" />
        </div>
        <p className="uppercase text-primary-darkest text-2xl font-montserrat mt-4">
          Your cart is empty.
        </p>
      </Grid.Col>
    </Grid>
  ) : (
    <>
      <CartHeader
        summaryData={summaryData}
        cart={cart}
        filesByCanAccess={filesByCanAccess}
        dbGapList={dbGapList as string[]}
      />
      <div className="mt-4 mx-4 mb-16">
        <DownloadInfo />
        <div className="flex flex-col xl:flex-row gap-8 mt-4">
          <div className="flex-1">
            <HeaderTitle>File counts by authorization level</HeaderTitle>
            <AuthorizationTable
              customDataTestID="table-file-counts-by-authorization-level"
              filesByCanAccess={filesByCanAccess}
              loading={userDetailsFetching}
            />
          </div>
          <div className="flex-1">
            <HeaderTitle>File counts by project</HeaderTitle>
            <ProjectTable
              customDataTestID="table-file-counts-by-project"
              projectData={summaryData?.byProject ?? []}
            />
          </div>
        </div>
        <div className="mt-6">
          <HeaderTitle>Cart Items</HeaderTitle>
          <FilesTable
            customDataTestID="table-cart-items"
            filesByCanAccess={filesByCanAccess}
          />
        </div>
      </div>
    </>
  );
};

export default Cart;
