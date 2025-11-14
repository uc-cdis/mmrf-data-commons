import React, { useContext } from "react";
import { TopBar } from "@gen3/frontend";
import { Navigation } from "./navigationInterfaces";
import topBarData from "../../../../config/mmrf/topBar.json";
import navigationJSON from "../../../../config/mmrf/mainNavigation.json";
import MobileView from "./Components/MobileView";
import DesktopView from "./Components/DesktopView";
import { SummaryModalContext } from "@/utils/contexts";
import { SummaryModal } from "@/components/Modals/SummaryModal/SummaryModal";
import CartIconWithCount from "./Components/CartIconWithCount";

const MainNavigation: React.FC = () => {
  const { navigation }: { navigation: Navigation } = navigationJSON;
  const { entityMetadata, setEntityMetadata } = useContext(SummaryModalContext);
  const topBarItemsWithIcon = [
    ...topBarData.items.slice(0, -1),
    { ...topBarData.items.at(-1), component: <CartIconWithCount /> },
  ];

  return (
    <div
      id="global-header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        background: "white",
      }}
    >
      <div className="bg-mmrf-purple text-[8px] sm:text-sm md:pr-4">
        <TopBar
          loginButtonVisibility={topBarData.loginButtonVisibility as any}
          classNames={topBarData.classNames}
          itemClassnames={topBarData.itemClassnames}
          items={topBarItemsWithIcon as any}
        />
        {
          <SummaryModal
            opened={entityMetadata.entity_type !== null}
            onClose={() =>
              setEntityMetadata({
                entity_type: null,
                entity_id: null,
              })
            }
            entityMetadata={entityMetadata}
          />
        }
      </div>

      <div
        className="flex items-center justify-between p-4 bg-white shadow-md"
        data-testid="mmrf-mainNavigation"
      >
        <DesktopView navigation={navigation} />
        <MobileView navigation={navigation} />
      </div>
    </div>
  );
};

export default MainNavigation;
