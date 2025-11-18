import React, { useState } from 'react';
import { ContextModalProps } from '@mantine/modals';
import { Button, TextInput, Loader } from '@mantine/core';
import { useForm } from '@mantine/form';
import ErrorMessage from '../ErrorMessage';
import { useCoreDispatch, createNewCohort } from '@gen3/core';
import { COHORT_FILTER_INDEX } from '@/core';

interface SaveCohortModalProps {
  readonly initialName?: string;
  readonly disallowedNames?: string[];
  readonly facetField: string;
  readonly outputIds: string[];
  readonly validate? : boolean;
  readonly setAsCurrentCohort?: boolean;
}

export const SaveCohortModal = ({
  context,
  id,
  innerProps,
}: ContextModalProps<SaveCohortModalProps>) => {
  const {
    initialName = '',
    disallowedNames = [],
    facetField,
    outputIds,
    validate = true,
    setAsCurrentCohort = true
  } = innerProps;
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useCoreDispatch();

  const form = useForm({
    initialValues: {
      name: initialName,
    },
    validate: {
      name: (value) => {
        if (!validate) return null;
        if (value.length === 0) {
          return 'Please fill out this field.';
        } else if (disallowedNames.includes(value.trim().toLowerCase())) {
          return `${value} is not a valid name for a saved cohort. Please try another name.`;
        }
        return null;
      },
    },
  });

  const { error: _, ...inputProps } = form.getInputProps('name');
  const validationError = form.errors.name;
  const error = validationError && (
    <ErrorMessage message={validationError as string} />
  );

  const handleSave = async () => {
    if (form.validate().hasErrors || isSaving) return;

    setIsSaving(true);
    try {
      dispatch(
        createNewCohort({
          name: form.values.name,
          filters: {
            [COHORT_FILTER_INDEX]: {
              mode: 'and',
              root: {
                [facetField]: {
                  field: 'case_id',
                  operands: outputIds,
                  operator: 'in',
                },
              },
            },
          },
          setAsCurrent: setAsCurrentCohort
        }),
      );
      context.closeModal(id);
    } catch (error) {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="font-content mt-1 mr-6 mb-5 ml-3">
        <p className="mb-2 text-sm font-content">
          Provide a name to save the cohort.
        </p>
        <TextInput
          withAsterisk
          label="Name"
          placeholder="New Cohort Name"
          description={<span>Maximum 100 characters</span>}
          classNames={{
            description: 'mt-1',
            input:
              'font-content data-[invalid=true]:text-utility-error data-[invalid=true]:border-utility-error',
            error: 'text-utility-error',
          }}
          data-autofocus
          maxLength={100}
          error={error}
          inputWrapperOrder={['label', 'input', 'error', 'description']}
          {...inputProps}
          aria-required
          data-testid="textbox-name-input-field"
        />
      </div>
      <div className="bg-base-lightest p-4">
        <div className="flex justify-end gap-3">
          <Button
            data-testid="button-cancel-save"
            variant="outline"
            classNames={{ root: 'bg-base-max' }}
            color="secondary"
            onClick={() => context.closeModal(id)}
          >
            Cancel
          </Button>
          <Button
            variant="filled"
            color="secondary"
            onClick={handleSave}
            data-testid="button-save-cohort"
            leftSection={
              isSaving ? <Loader size={15} color="white" /> : undefined
            }
          >
            Save
          </Button>
        </div>
      </div>
    </>
  );
};
