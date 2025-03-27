import React from 'react';
import { TopBar } from '@gen3/frontend';
import { Navigation } from './navigationInterfaces';
import topBarData from '../../../../config/mmrf/topBar.json';
import navigationJSON from '../../../../config/mmrf/mainNavigation.json';
import MobileView from './Components/MobileView';
import DesktopView from './Components/DesktopView';

const MainNavigation: React.FC = () => {
  const { navigation }: { navigation: Navigation } = navigationJSON;
  return (
    <>
      <div className="bg-mmrf-purple text-[8px] sm:text-sm md:pr-4">
        <TopBar
          loginButtonVisibility={topBarData.loginButtonVisibility as any}
          classNames={topBarData.classNames}
          itemClassnames={topBarData.itemClassnames}
          items={topBarData.items}
        />
      </div>
      <div
        className="flex items-center justify-between p-4 bg-white shadow-md"
        data-testid="mmrf-mainNavigation"
      >
        <DesktopView navigation={navigation} />
        <MobileView navigation={navigation} />
      </div>
    </>
  );
};

export default MainNavigation;
