import React, { useState } from 'react';
import ProjectsTable from './ProjectsTable';
import { TableXPositionContext } from '@/components/Table/VerticalTable';
const ProjectsCenter = (): JSX.Element => {

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

export default ProjectsCenter;
