import React from "react";
import { useProjectSummaryQuery } from '@/core/features/projects/projectsSlice';
import { LoadingOverlay } from "@mantine/core";
import { SummaryErrorHeader } from "@/components/Summary/SummaryErrorHeader";
import { ProjectView } from "./ProjectView";
import { ProjectDefaults } from '@/core';

export interface ContextualProjectViewProps {
  readonly projectId: string;
  readonly isModal?: boolean;
}

export const ProjectSummary: React.FC<ContextualProjectViewProps> = ({
                                                                       projectId,
                                                                       isModal = false,
                                                                     }: ContextualProjectViewProps) => {
  const { data: projectsData, isFetching: isProjectFetching } =
    useProjectSummaryQuery(projectId);

  const projectData : ProjectDefaults = projectsData ?? {
    dbgap_accession_number: "",
    name: "",
    disease_type: [],
    primary_site: [],
    project_id: "",
    program: {
      name: "",
      program_id: "",
      dbgap_accession_number: "",
    },
    access: { controlled: 0, open: 0 },
  };
  const hasControlledAccess = projectData?.access?.controlled ? projectData?.access?.controlled > 0 : false;
  const projectWithAnnotation = {
    ...projectData,
    hasControlledAccess,
    isModal,
  };

  return (
    <>
      {isProjectFetching ? (
        <LoadingOverlay visible data-testid="loading-spinner" />
      ) : projectData && Object.keys(projectData).length > 0 ? (
        <ProjectView {...projectWithAnnotation} />
      ) : (
        <SummaryErrorHeader label="Project Not Found" />
      )}
    </>
  );
};
