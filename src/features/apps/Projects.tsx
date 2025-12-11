import React from "react";
import { DemoUtil } from '@/features/apps/DemoUtil';
import { useIsDemoApp } from '@/hooks/useIsDemoApp';
import { ProjectsCenter } from '@/features/projectsCenter';


const ProjectsApp = () => {
  const isDemoMode = useIsDemoApp();
  return (
    <>
      {isDemoMode ? (
          <DemoUtil text="Demo mode is not available for this app" />
        ) : (
        <div className="flex flex-col">
          <ProjectsCenter />
        </div>)}
    </>
  );
};

export default ProjectsApp;
