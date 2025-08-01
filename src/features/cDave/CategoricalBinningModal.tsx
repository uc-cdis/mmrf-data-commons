import React, { useEffect, useState } from "react";
import { pickBy, mapKeys, isEqual, isEmpty } from "lodash";
import { Button, Group, Modal, Text, TextInput } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { createKeyboardAccessibleFunction } from "src/utils";
import { CategoricalBins, CustomBinData } from './types';
import FunctionButton from "@/components/FunctionButton";
import {
  AlertIcon,
  GroupIcon,
  HideIcon,
  PencilIcon,
  ReplayIcon,
  ShowIcon,
  UngroupIcon,
} from "@/utils/icons";

const DEFAULT_GROUP_NAME_PREFIX = "selected value ";

const filterOutSelected = (
  values: CategoricalBins,
  selectedValues: Record<string, number>,
) => {
  const newValues : Record<string, number | Record<string, number>  > = {};

  Object.entries(values).forEach(([key, value]) => {
    if (Number.isInteger(value) && !selectedValues?.[key]) {
      newValues[key] = value;
    } else {
      const groupValues = pickBy(
        value as Record<string, number>,
        (_, k) => !selectedValues?.[k],
      );
      if (Object.keys(groupValues).length > 0) {
        newValues[key] = groupValues;
      }
    }
  });

  return newValues;
};

const getHiddenValues = (
  results: CategoricalBins,
  customBins: CategoricalBins,
) => {
  const flattenedKeys : any[] = [];
  Object.entries(customBins).forEach(([key, value]) => {
    if (Number.isInteger(value)) {
      flattenedKeys.push(key);
    } else {
      flattenedKeys.push(...Object.keys(value));
    }
  });

  return pickBy(
    results,
    (v, k) => Number.isInteger(v) && !flattenedKeys.includes(k),
  ) as Record<string, number>;
};

const sortBins = (
  a: number | Record<string, number>,
  b: number | Record<string, number>,
) => {
  const compA = a instanceof Object ? Object.values(a) : [a];
  const compB = b instanceof Object ? Object.values(b) : [b];

  return Math.max(...compB) - Math.max(...compA);
};

interface CategoricalBinningModalProps {
  readonly setModalOpen: (open: boolean) => void;
  readonly field: string;
  readonly results: Record<string, number>;
  readonly customBins: CategoricalBins;
  readonly updateBins: (bin:CustomBinData ) => void ;
  readonly opened: boolean;
}

const CategoricalBinningModal: React.FC<CategoricalBinningModalProps> = ({
  setModalOpen,
  field,
  results,
  customBins,
  updateBins,
  opened,
}: CategoricalBinningModalProps) => {
  const [values, setValues] = useState<CategoricalBins>(
    customBins !== null ? customBins : results,
  );
  const [selectedValues, setSelectedValues] = useState<Record<string, number>>(
    {},
  );
  const [hiddenValues, setHiddenValues] = useState<Record<string, number>>(
    customBins !== null ? getHiddenValues(results, customBins) : {},
  );
  const [selectedHiddenValues, setSelectedHiddenValues] = useState<
    Record<string, number>
  >({});
  const [editField, setEditField] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState("");

  const group = () => {
    setEditField(undefined);

    const existingGroups = Object.entries(values).filter(
      ([, v]) =>
        v instanceof Object &&
        Object.keys(v).every((subKey) => selectedValues?.[subKey]),
    );

    if (existingGroups.length === 1) {
      setValues({
        ...filterOutSelected(values, selectedValues),
        [existingGroups[0][0]]: {
          ...(existingGroups[0][1] as Record<string, number>),
          ...selectedValues,
        },
      });
    } else {
      const valueCount = Object.keys(values).length;
      let index = 1;

      for (; index <= valueCount; index++) {
        if (!values[DEFAULT_GROUP_NAME_PREFIX + index]) {
          break;
        }
      }

      const newGroupName = DEFAULT_GROUP_NAME_PREFIX + index;

      setValues({
        ...filterOutSelected(values, selectedValues),
        [newGroupName]: selectedValues,
      });

      setEditField(newGroupName);
    }
    setSelectedValues({});
    setErrorMessage("");
  };

  const updateGroupName = (oldName: string, newName: string) => {
    setValues(mapKeys(values, (_, key) => (key === oldName ? newName : key)));
    setErrorMessage("");
  };

  const hideValues = () => {
    const restValues = filterOutSelected(values, selectedValues);

    if (isEmpty(restValues)) {
      setErrorMessage("At least one bin must be displayed.");
      return;
    }

    setErrorMessage("");
    setEditField(undefined);
    setHiddenValues({
      ...hiddenValues,
      ...selectedValues,
    });

    setValues(restValues);

    setSelectedValues({});
  };

  const sortedValues = Object.entries(values).sort((a, b) =>
    sortBins(a[1], b[1]),
  );

  return (
    <Modal
      opened={opened}
      onClose={() => setModalOpen(false)}
      size={800}
      zIndex={400}
      title={`Create Custom Bins: ${field}`}
      classNames={{
        header: "text-xl !m-0 !px-0",
        content: "p-4",
      }}
    >
      <p className="font-content">
        Organize values into groups of your choosing. Click <b>Save Bins</b> to
        update the analysis plots.
      </p>
      <div
        data-testid="cat-bin-modal-values"
        className="border-base-lightest border-solid border-1 mt-2"
      >
        <div className="flex justify-between bg-base-lightest p-2">
          <h3 className="font-bold my-auto">Values</h3>
          <div className="gap-1 flex">
            <FunctionButton
              data-testid="button-custom-bins-reset-group"
              onClick={() => {
                setEditField(undefined);
                setHiddenValues({});
                setValues(results);
                setSelectedValues({});
                setErrorMessage("");
              }}
              disabled={isEqual(results, values)}
              aria-label="reset groups"
            >
              <ReplayIcon size={20} />
            </FunctionButton>
            <FunctionButton
              data-testid="button-custom-bins-group-values"
              onClick={group}
              disabled={
                Object.entries(values).filter(([k, v]) =>
                  v instanceof Object
                    ? Object.keys(v).some((k) => selectedValues?.[k])
                    : selectedValues?.[k],
                ).length < 2
              }
              leftSection={<GroupIcon aria-hidden="true" />}
            >
              Group
            </FunctionButton>
            <FunctionButton
              data-testid="button-custom-bins-ungroup-values"
              onClick={() => {
                setEditField(undefined);
                setValues({
                  ...filterOutSelected(values, selectedValues),
                  ...selectedValues,
                });
                setSelectedValues({});
              }}
              disabled={
                !Object.entries(values).some(
                  ([, v]) =>
                    v instanceof Object &&
                    Object.keys(v).some(
                      (groupedValue) => selectedValues?.[groupedValue],
                    ),
                )
              }
              leftSection={<UngroupIcon aria-hidden="true" />}
            >
              Ungroup
            </FunctionButton>
            <FunctionButton
              data-testid="button-custom-bins-hide-values"
              onClick={hideValues}
              disabled={Object.keys(selectedValues).length === 0}
              leftSection={<HideIcon aria-hidden="true" />}
            >
              Hide
            </FunctionButton>
          </div>
        </div>
        <ul className="p-2">
          {sortedValues
            .sort((a, b) => sortBins(a[1], b[1]))
            .map(([k, value], idx) =>
              value instanceof Object ? (
                <GroupInput
                  groupName={k}
                  groupValues={value}
                  otherGroups={sortedValues
                    .map((v) => v[0])
                    .filter((_, i) => idx !== i)}
                  updateGroupName={updateGroupName}
                  selectedValues={selectedValues}
                  setSelectedValues={setSelectedValues}
                  clearOtherValues={() => setSelectedHiddenValues({})}
                  editing={k === editField}
                  setEditField={setEditField}
                  key={k}
                />
              ) : (
                <ListValue
                  name={k}
                  count={value}
                  selectedValues={selectedValues}
                  setSelectedValues={setSelectedValues}
                  clearOtherValues={() => setSelectedHiddenValues({})}
                  key={k}
                />
              ),
            )}
        </ul>
      </div>
      <div
        data-testid="cat-bin-modal-hidden-values"
        className="border-base-lightest border-solid border-1 mt-2"
      >
        <div className="flex justify-between bg-base-lightest p-2">
          <h3 className="font-bold my-auto">Hidden Values</h3>
          <FunctionButton
            data-testid="button-custom-bins-show-values"
            disabled={Object.keys(selectedHiddenValues).length === 0}
            onClick={() => {
              setEditField(undefined);
              setValues({ ...values, ...selectedHiddenValues });
              setHiddenValues(
                pickBy(
                  hiddenValues,
                  (_, k) => selectedHiddenValues?.[k] === undefined,
                ),
              );
              setSelectedHiddenValues({});
            }}
            leftSection={<ShowIcon aria-hidden="true" />}
          >
            Show
          </FunctionButton>
        </div>
        <ul className="min-h-[100px] p-2">
          {Object.entries(hiddenValues)
            .sort((a, b) => b[1] - a[1])
            .map(([k, v]) => (
              <ListValue
                name={k}
                count={v}
                selectedValues={selectedHiddenValues}
                setSelectedValues={setSelectedHiddenValues}
                clearOtherValues={() => setSelectedValues({})}
                key={k}
              />
            ))}
        </ul>
      </div>
      <div className="mt-2 flex gap-2 justify-end">
        {errorMessage && (
          <Group className="grow" gap={8} justify="center">
            <AlertIcon color="red" />
            <Text c="red">{errorMessage}</Text>
          </Group>
        )}
        <Group gap={8}>
          <Button
            data-testid="button-custom-bins-cancel"
            onClick={() => setModalOpen(false)}
            variant="outline"
            color="primary.5"
          >
            Cancel
          </Button>
          <Button
            data-testid="button-custom-bins-save"
            className="bg-primary-darkest"
            onClick={() => {
              setEditField(undefined);
              if (!isEqual(values, results)) {
                updateBins(values);
              } else {
                updateBins([]);
              }
              setModalOpen(false);
            }}
          >
            Save Bins
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

interface ListValueProps {
  readonly name: string;
  readonly count: number;
  readonly selectedValues: Record<string, number>;
  readonly setSelectedValues: (selectedValues: Record<string, number>) => void;
  readonly clearOtherValues: () => void;
}

const ListValue: React.FC<ListValueProps> = ({
  name,
  count,
  selectedValues,
  setSelectedValues,
  clearOtherValues,
}: ListValueProps) => {
  const updateSelectedValues = (name: string, count: number) => {
    if (Object.keys(selectedValues).includes(name)) {
      setSelectedValues(pickBy(selectedValues, (_, k) => k !== name));
    } else {
      setSelectedValues({ ...selectedValues, [name]: count });
    }
  };

  return (
    <li
      className={`${
        selectedValues?.[name] ? "bg-accent-warm-light" : ""
      } cursor-pointer list-inside font-content`}
    >
      <div
        onClick={() => {
          updateSelectedValues(name, count);
          clearOtherValues();
        }}
        onKeyDown={createKeyboardAccessibleFunction(() => {
          updateSelectedValues(name, count);
          clearOtherValues();
        })}
        tabIndex={0}
        role="button"
        className="inline"
      >
        {name} ({count.toLocaleString()})
      </div>
    </li>
  );
};

interface GroupInputProps {
  readonly groupName: string;
  readonly groupValues: Record<string, number>;
  readonly otherGroups: string[];
  readonly updateGroupName: (oldName: string, newName: string) => void;
  readonly selectedValues: Record<string, number>;
  readonly setSelectedValues: (selectedValues: Record<string, number>) => void;
  readonly clearOtherValues: () => void;
  readonly editing: boolean;
  readonly setEditField: (field?: string) => void;
}

const GroupInput: React.FC<GroupInputProps> = ({
  groupName,
  groupValues,
  otherGroups,
  updateGroupName,
  selectedValues,
  setSelectedValues,
  clearOtherValues,
  editing,
  setEditField,
}: GroupInputProps) => {
  const form = useForm({
    validateInputOnChange: true,
    initialValues: { group: groupName },
    validate: {
      group: (value) =>
        value === ""
          ? "Required field"
          : Object.keys(groupValues).includes(value)
          ? "The group name cannot be the same as the name of a value"
          : otherGroups.includes(value.trim())
          ? `"${value}" already exists`
          : null,
    },
  });

  const closeInput = () => {
    if (Object.keys(form.errors).length === 0) {
      updateGroupName(groupName, form.values.group.trim());
      setEditField(undefined);
    }
  };

  const ref = useClickOutside(() => {
    closeInput();
  });

  const updateSelectedValues = () => {
    clearOtherValues();

    if (Object.keys(groupValues).every((k) => selectedValues?.[k])) {
      setSelectedValues(
        pickBy(selectedValues, (_, k) => !Object.keys(groupValues).includes(k)),
      );
    } else {
      setSelectedValues({ ...selectedValues, ...groupValues });
    }
  };

  useEffect(() => {
    if (!editing) {
      form.clearErrors();
      form.reset();
    }
    // Adding form objects to dep array causes infinite rerenders

  }, [editing]);

  return (
    <li className="font-content">
      {editing ? (
        <TextInput
          data-testid="textbox-custom-bin-name"
          ref={ref}
          className={"w-1/2"}
          onKeyDown={createKeyboardAccessibleFunction(closeInput)}
          {...form.getInputProps("group")}
          maxLength={100}
        />
      ) : (
        <div
          onClick={updateSelectedValues}
          onKeyDown={createKeyboardAccessibleFunction(updateSelectedValues)}
          tabIndex={0}
          role="button"
          className={`${
            Object.keys(groupValues).every((k) => selectedValues?.[k])
              ? "bg-accent-warm-light"
              : ""
          } cursor-pointer flex items-center`}
        >
          {groupName}{" "}
          <PencilIcon
            data-testid="button-custom-bins-edit-group-name"
            className="ml-2 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setEditField(groupName);
            }}
            aria-label="edit group name"
          />
        </div>
      )}
      <ul className="list-disc">
        {Object.entries(groupValues)
          .sort((a, b) => b[1] - a[1])
          .map(([k, v]) => (
            <ListValue
              name={k}
              count={v}
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              clearOtherValues={clearOtherValues}
              key={k}
            />
          ))}
      </ul>
    </li>
  );
};

export default CategoricalBinningModal;
