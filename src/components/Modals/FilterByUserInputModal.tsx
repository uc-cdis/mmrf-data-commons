import React, { useCallback, useState } from 'react';
import { ContextModalProps } from '@mantine/modals';
import { Button } from '@mantine/core';
import InputEntityList, { InputEntityListProps } from '@/components/InputEntityList/InputEntityList';
import fieldConfig from '../InputEntityList/fieldConfig';

interface FilterByUserInputModalProps {
  readonly userInputProps: InputEntityListProps;
  readonly type: "genes" | "ssms";
  readonly updateFilters: (facetField: string, outputIds: string[]) => void;
}

export const FilterByUserInputModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<FilterByUserInputModalProps>) => {
  const { userInputProps, updateFilters, type } = innerProps;
  const [outputIds, setOutputIds] = useState<string[]>([]);
  const [shouldReset, setShouldReset] = useState(false);
  const clearShouldReset = useCallback(() => setShouldReset(false), [setShouldReset]);

  const { facetField } = fieldConfig[type];

  return (
    <>
      <InputEntityList
        {...userInputProps}
        setOutputIds={setOutputIds}
        shouldReset={shouldReset}
        clearShouldReset={clearShouldReset}
      />
      <div className="flex justify-end mt-2.5 gap-2">
        <Button
          data-testid="button-cancel"
          onClick={() => context.closeModal(id)}
          className="!bg-primary hover:!bg-primary-darker"
        >
          Cancel
        </Button>
        <Button
          data-testid="button-clear"
          onClick={() => setShouldReset(true)}
          className="!bg-primary hover:!bg-primary-darker"
        >
          Clear
        </Button>
        <Button
          data-testid="button-submit"
          disabled={outputIds.length === 0}
          onClick={() => {
            updateFilters(facetField, outputIds);
            context.closeModal(id)
          }}
          className="!bg-primary hover:!bg-primary-darker"
        >
          Submit
        </Button>
      </div>
    </>
  );
};
