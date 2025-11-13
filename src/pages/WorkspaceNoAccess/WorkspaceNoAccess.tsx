import React from 'react';
import { CardContainer } from '@gen3/frontend';

const  supportEmail = "VirtualLab@themmrf.org";

const WorkspaceNoAccessPage = (): JSX.Element => {
  return (

      <CardContainer>
        <h1>Error opening workspace...</h1>
        <p>
          Workspace access requires authorization. Please contact{' '}
          <a href={`mailto:${supportEmail}`}>{supportEmail}</a> for more
          information.
        </p>
      </CardContainer>
  );
};

export default WorkspaceNoAccessPage;
