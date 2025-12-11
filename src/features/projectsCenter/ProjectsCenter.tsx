import React, { useEffect, useState } from 'react';
import {
  useCoreSelector,
  selectCurrentCohortId,
  usePrevious,
} from '@gen3/core';
import ProjectsTable from './ProjectsTable';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { TableXPositionContext } from '@/components/Table/VerticalTable';

export const ProjectsCenter = (): JSX.Element => {
  const cohortId = useCoreSelector((state) => selectCurrentCohortId(state));

  const [tableXPosition, setTableXPosition] = useState<number | undefined>(
    undefined,
  );

  return (
    <>
      <TableXPositionContext.Provider
        value={{ xPosition: tableXPosition, setXPosition: setTableXPosition }}
      >
        <div
          className="flex p-4 px-4 pb-16 gap-4 w-full"
          data-testid="table-projects"
        >
          <div className="grow overflow-hidden mt-8">
            <ProjectsTable />
          </div>
        </div>
      </TableXPositionContext.Provider>
    </>
  );
};
