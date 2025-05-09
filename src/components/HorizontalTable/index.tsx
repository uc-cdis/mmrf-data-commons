import React, { forwardRef, useState } from 'react';

export interface CollapsableTableItemsProps {
  readonly expandBtnText: string;
  readonly keyId: string;
  readonly values: ReadonlyArray<string>;
}
export const CollapsableTableItems = (
  props: CollapsableTableItemsProps,
): JSX.Element => {
  const [toggle, setToggle] = useState(true);

  return (
    <>
      <button
        className="text-primary-content px-4"
        onClick={() => setToggle(!toggle)}
        aria-expanded={!toggle}
      >
        {`${toggle ? '▸' : '▴'} ${props.values.length} ${props.expandBtnText}`}
      </button>
      <ul hidden={toggle} className="w-fit list-disc list-inside">
        {props.values.map((listItem, listIndex: number): JSX.Element => {
          return <li key={`${props.keyId}-${listIndex}`}>{listItem}</li>;
        })}
      </ul>
    </>
  );
};

/**
 * Table that displays headers in left column and data flowing to the right
 */
export interface HorizontalTableProps {
  readonly tableData: {
    readonly headerName: string;
    readonly values: ReadonlyArray<
      string | ReadonlyArray<string> | boolean | number | JSX.Element
    >;
  }[];
  customContainerStyles?: string;
  slideImageDetails?: boolean;
  customDataTestID?: string;
  enableSync?: boolean;
}

export const HorizontalTable = forwardRef<
  HTMLTableElement,
  HorizontalTableProps
>(
  (
    {
      tableData,
      customContainerStyles,
      slideImageDetails = false,
      customDataTestID,
      enableSync = false,
    },
    ref,
  ) => {
    const containerClassName =
      'w-full text-left text-base-contrast-lightest font-content font-medium drop-shadow-sm border-1 border-base-lighter text-sm';
    const updatedContainerClassName = customContainerStyles
      ? containerClassName + ` ${customContainerStyles}`
      : containerClassName;

    return (
      <table
        data-testid={customDataTestID}
        className={updatedContainerClassName}
        ref={enableSync ? ref : undefined}
      >
        <tbody>
          {tableData.map((obj, rowIndex: number): JSX.Element => {
            return (
              <tr
                key={`row-${obj.headerName}`}
                data-testid={`horizontal-table-row-${rowIndex}`}
                className={rowIndex % 2 ? 'transparent' : 'bg-base-lightest'}
              >
                <th
                  className={`w-2/5 align-top px-2 ${
                    !slideImageDetails && 'py-2.5'
                  } border-gen3-smoke border-1 whitespace-normal font-semibold font-heading`}
                  key={`head-${obj.headerName}`}
                  scope="row"
                >
                  {obj.headerName}
                </th>
                <td className="w-3/5 border-1 border-gen3-smoke px-2 font-content-noto font-normal">
                  <div className="flex flex-wrap gap-2">
                    {obj.values.map((value, index) =>
                      renderValue(value, obj.headerName, index),
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  },
);
HorizontalTable.displayName = 'HorizontalTable';
const renderValue = (
  value: string | ReadonlyArray<string> | boolean | number | JSX.Element | undefined,
  headerName: string,
  index: number,
): JSX.Element => {
  if (value === undefined) {
    return <span key={`${headerName}-${index}`}></span>;
  }

  if (Array.isArray(value) && value.length > 1) {
    return (
      <CollapsableTableItems
        key={`${headerName}-${index}`}
        expandBtnText={`${headerName}s`}
        keyId={`${headerName}-${index}`}
        values={value}
      />
    );
  }

  if (React.isValidElement(value)) {
    return (
      <React.Fragment key={`${headerName}-${index}`}>{value}</React.Fragment>
    );
  }

  return <span key={`${headerName}-${index}`}>{String(value)}</span>;
};
