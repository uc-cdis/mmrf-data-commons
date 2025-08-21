import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
// import { registerGenesAndMutationFrequencyAnalysisTool } from '@/features/genomic/registerApp';
import Gen3GDCCompatabilityProvider from '@/utils/providers';
import { Gen3Provider } from '@gen3/frontend';
// import { ComparativeSurvival } from './types';
import { FileView } from './FileView';
import { GdcFile } from '@/core';
import { useGetFilesQuery } from './mockedHooks';
import { FilterSet } from '@gen3/core';

const meta = {
  component: FileView,
  title: 'features/FileView',
  parameters: {
    deepControls: { enabled: true },
  },
} satisfies Meta<typeof FileView>;

export default meta;

type Story = StoryObj<typeof meta>;

const exampleGdcFile: GdcFile = {
  submitterId: 'submitter456',
  access: 'open', // Assuming "open" is a valid value from accessTypes
  acl: ['read', 'write'],
  createdDatetime: '2025-01-01T12:00:00Z',
  updatedDatetime: '2025-01-10T12:00:00Z',
  data_category: 'genomic',
  data_format: 'FASTQ',
  data_type: 'sequence',
  file_id: 'file789',
  file_name: 'sample_data.fastq',
  file_size: 2048000, // Size in bytes
  md5sum: '123',
  state: 'available',
};

const exampleGdcFile0 = useGetFilesQuery({
  filters: {} as FilterSet,
  fields: [],
  index: 0,
});
const exampleGdcFile1 = useGetFilesQuery({
  filters: {} as FilterSet,
  fields: [],
  index: 1,
});
const exampleGdcFile2 = useGetFilesQuery({
  filters: {} as FilterSet,
  fields: [],
  index: 2,
});
/*
export const Default: Story = {
  args: {
    file: exampleGdcFile0.data[0],
    isModal: false,
  },
  render: (args) => (
    <div style={{ padding: '20px' }}>
      <Gen3Provider
        icons={[]}
        sessionConfig={{
          updateSessionTime: 5,
          inactiveTimeLimit: 20,
          logoutInactiveUsers: false,
          monitorWorkspace: false,
        }}
        modalsConfig={{
          systemUseModal: {
            title: '',
            content: {
              text: [''],
            },
            expireDays: 0,
            showOnlyOnLogin: true,
          },
        }}
      >
        <Gen3GDCCompatabilityProvider>
          <FileView {...args} />
        </Gen3GDCCompatabilityProvider>
      </Gen3Provider>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const testIds = ['genes-panel'];
    await new Promise((resolve) => setTimeout(resolve, 1000));
    testIds.forEach((id) => {
      const currEle = canvas.getByTestId(id);
      expect(currEle).toBeInTheDocument();
    });
  },
}; */

/**** NEW VERSION */

// Wrapper component for the story
const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: '20px' }}>
    <Gen3Provider
      icons={[]}
      sessionConfig={{
        updateSessionTime: 5,
        inactiveTimeLimit: 20,
        logoutInactiveUsers: false,
        monitorWorkspace: false,
      }}
      modalsConfig={{
        systemUseModal: {
          title: '',
          content: {
            text: [''],
          },
          expireDays: 0,
          showOnlyOnLogin: true,
        },
      }}
    >
      <Gen3GDCCompatabilityProvider>{children}</Gen3GDCCompatabilityProvider>
    </Gen3Provider>
  </div>
);

// Default story
export const Default: Story = {
  args: {
    file: exampleGdcFile,
    isModal: false,
  },
  render: (args) => (
    <Wrapper>
      <FileView {...args} />
    </Wrapper>
  ),
};

export const ExampleGdcFile0: Story = {
  args: {
    file: exampleGdcFile0.data[0],
    isModal: false,
  },
  render: (args) => (
    <Wrapper>
      <FileView {...args} />
    </Wrapper>
  ),
};

export const ExampleGdcFile1: Story = {
  args: {
    file: exampleGdcFile1.data[0],
    isModal: false,
  },
  render: (args) => (
    <Wrapper>
      <FileView {...args} />
    </Wrapper>
  ),
};

export const ExampleGdcFile2: Story = {
  args: {
    file: exampleGdcFile2.data[0],
    isModal: false,
  },
  render: (args) => (
    <Wrapper>
      <FileView {...args} />
    </Wrapper>
  ),
};

/*
// Another story for a different file type
export const ImageFile: Story = {
  render: (args) => (
    <Wrapper>
      <FileView {...args} />
    </Wrapper>
  ),
  args: {
    fileName: 'Picture.png',
    fileType: 'Image',
  },
};

// Story for a text file
export const TextFile: Story = {
  render: (args) => (
    <Wrapper>
      <FileView {...args} />
    </Wrapper>
  ),
  args: {
    fileName: 'Notes.txt',
    fileType: 'Text',
  },
};
*/
