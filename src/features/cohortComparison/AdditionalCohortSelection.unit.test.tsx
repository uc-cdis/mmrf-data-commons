import React from 'react';
import { render } from 'test-utils';
import userEvent from '@testing-library/user-event';
import AdditionalCohortSelection from './AdditionalCohortSelection';
import { selectCurrentCohort } from '@gen3/core';

jest.mock('@gen3/core', () => ({
  ...jest.requireActual('@gen3/core'),
  selectAvailableCohorts: jest.fn().mockImplementation(
    () =>
      [
        { id: '1', name: 'Lung', counts: { caseCount: 100 } },
        { id: '2', name: 'Brain', counts: { caseCount: 0 } },
        { id: '3', name: 'Lung', counts: { caseCount: 100 } },
        { id: '4', name: 'Skin', counts: { caseCount: 1000 } },
      ] as any,
  ),
  selectCurrentCohort: jest.fn(),
}));

describe('<AdditionalCohortSelection />', () => {
  it('Correctly excludes current cohort from list', () => {
    jest
      .mocked(selectCurrentCohort)
      .mockImplementation(() => ({ id: '3', name: 'Lung' }) as any);

    const { getByLabelText } = render(
      <AdditionalCohortSelection
        setActiveApp={(id) => {
          return id;
        }}
        index={'0'}
        app={''}
        setOpen={jest.fn()}
        setComparisonCohort={jest.fn()}
      />,
    );

    // We are including the correct cohort with the name "Lung"
    expect(getByLabelText('Lung').getAttribute('id')).toEqual('1');
    expect(getByLabelText('Brain')).toBeInTheDocument();
    expect(getByLabelText('Skin')).toBeInTheDocument();
  });

  it('Correctly selects cohort when multiple of the same name', async () => {
    jest
      .mocked(selectCurrentCohort)
      .mockImplementation(() => ({ id: '2', name: 'Brain' }) as any);

    const { getAllByLabelText } = render(
      <AdditionalCohortSelection
        setActiveApp={(id) => {
          return id;
        }}
        index={'0'}
        app={''}
        setOpen={jest.fn()}
        setComparisonCohort={jest.fn()}
      />,
    );

    await userEvent.click(getAllByLabelText('Lung')[0]);
    expect(getAllByLabelText('Lung')[0]).toBeChecked();
    expect(getAllByLabelText('Lung')[1]).not.toBeChecked();
  });

  it('Disables 0 count cohort input', () => {
    jest
      .mocked(selectCurrentCohort)
      .mockImplementation(() => ({ id: '3', name: 'Lung' }) as any);

    const { getByLabelText } = render(
      <AdditionalCohortSelection
        setActiveApp={(id) => {
          return id;
        }}
        index={'0'}
        app={''}
        setOpen={jest.fn()}
        setComparisonCohort={jest.fn()}
      />,
    );

    expect(getByLabelText('Brain')).toBeDisabled();
  });
});
