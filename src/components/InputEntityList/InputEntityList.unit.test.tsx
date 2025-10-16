import React from 'react';
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputEntityList from "./InputEntityList";
import { render } from "test-utils";

const renderInputEntityList = () => {
  return render(
    <InputEntityList
      inputInstructions="do stuff to have stuff happen"
      identifierToolTip="ids"
      textInputPlaceholder="ex. TCGA"
      entityType="ssms"
      entityLabel="mutation"
      hooks={{
        updateFilters: jest.fn(),
        getExistingFilters: jest.fn(),
      }}
    />
  );
};

describe("<InputEntityList />", () => {
  it("Clear button should be disabled initially", () => {
    const { getByRole } = renderInputEntityList();
    const clearButton = getByRole("button", { name: "Clear" });
    expect(clearButton).toBeDisabled();
  });

  it("should reset state when Clear button is clicked", async () => {
    const { queryByText, getByPlaceholderText, getByRole } =
      renderInputEntityList();
    const inputTextarea = getByPlaceholderText("ex. TCGA");

    await userEvent.type(inputTextarea, "7890-123");
    const saveButton = getByRole("button", { name: "Save Set" });
    const clearButton = getByRole("button", { name: "Clear" });

    await waitFor(() => expect(clearButton).toBeEnabled());
    await waitFor(() => expect(saveButton).toBeEnabled());
    await userEvent.click(clearButton);
    expect(inputTextarea).toHaveValue("");

    await waitFor(() => expect(queryByText("Summary Table")).toBeNull());
    await waitFor(() => expect(saveButton).toBeDisabled());
  });
});
