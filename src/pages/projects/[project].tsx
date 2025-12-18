import React from 'react';
import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import PageTitle from '@/components/PageTitle';
import { ProjectSummary } from '@/features/projects/ProjectSummary';

const ProjectSummaryPage: NextPage = () => {
  const router = useRouter();
  const project = router.asPath.split('/')[2]?.split('?')?.[0];

  let projectId = '';
  if (project) projectId = decodeURIComponent(project);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      setReady(true);
    }
  }, [router]);

  return (
    <>
      <PageTitle pageName="Project Summary" />
      <h1 className="sr-only">Project Summary</h1>
      {ready && <ProjectSummary projectId={projectId} />}
    </>
  );
};

export default ProjectSummaryPage;
