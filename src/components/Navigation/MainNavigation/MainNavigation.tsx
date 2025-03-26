import React from 'react';
import { TopBar } from '@gen3/frontend';
import topBarData from '../../../../config/mmrf/topBar.json';
import navigationJSON from '../../../../config/mmrf/mainNavigation.json';
import MobileView from './MobileView';
import DesktopView from './DesktopView';

const MainNavigation = () => {
  const { navigation } = navigationJSON;
  return (
    <>
      <div className="text-sm pr-4 hidden md:block">
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
