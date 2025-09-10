import React from "react";
import { CartAggregation } from "@/core";
import { filesize}  from 'filesize';
import { ScrollableTableWithFixedHeader } from "@/components/ScrollableTableWithFixedHeader/ScrollableTableWithFixedHeader";

const columnListOrder = ["Project", "Cases", "Files", "File Size"];

interface ProjectTableProps {
  readonly projectData: CartAggregation[];
  readonly customDataTestID: string;
}

const ProjectTable: React.FC<ProjectTableProps> = ({
  projectData,
  customDataTestID,
}: ProjectTableProps) => {
  const sortedProjectData = [...(projectData || [])].sort((a, b) => {
    return b.case_count - a.case_count;
  });

  const tableData = sortedProjectData.map((project) => ({
    key: project.key,
    case_count: project.case_count?.toLocaleString(),
    doc_count: project.doc_count?.toLocaleString(),
    file_size: filesize(project.file_size),
  }));

  return (
    <ScrollableTableWithFixedHeader
      customDataTestID={customDataTestID}
      tableData={{
        headers: columnListOrder,
        tableRows: tableData,
      }}
      maxRowsBeforeScroll={5}
    />
  );
};

export default ProjectTable;
