import React from 'react';
import {
CohortManager, QueryExpression
} from '@gen3/frontend';
import PageTitle from '@/components/PageTitle';
import MainNavigation from '@/components/Navigation/MainNavigation/MainNavigation';

import GenesAndMutationFrequencyAnalysisTool from '@/features/genomic/GenesAndMutationFrequencyAnalysisTool';




// export interface TabbedCohortBuilderPageProps extends NavPageLayoutProps {
//   configuration: TabbedCohortBuilderConfiguration;
// }

const MutatationFrequencyPage = () => {
  return (
    <>
      <PageTitle pageName="Gene Summary" />
      <div className="w-full flex-col flex gap-4 fixed z-10 bg-white">
        <MainNavigation />
        <CohortManager />
          <QueryExpression index="case"/>
      </div>
      <div className="flex">
        <div className="w-full mt-72 mr-4">
          <GenesAndMutationFrequencyAnalysisTool/>
        </div>
      </div>
    </>
  );
};

export default MutatationFrequencyPage;
