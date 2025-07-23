import { Checkbox, CheckboxProps, Tooltip } from "@mantine/core";
import React from "react";

interface ToggleProps {
  isActive: boolean;
  icon: JSX.Element;
  selected: string | Record<string, string>;
  disabled?: boolean;
  handleSwitch: any;
  tooltip: string;
  margin: string;
  survivalProps?: {
    plot: string;
  };
  ariaText: string;
}

const ToggledCheck: React.FC<ToggleProps> = ({
  isActive,
  icon,
  selected,
  disabled = false,
  handleSwitch,
  tooltip = undefined,
  margin,
  survivalProps,
  ariaText,
}: ToggleProps) => {
  const { plot } = survivalProps ?? { plot: "" };

  const CheckboxIcon: CheckboxProps["icon"] = ({ className }) => {
    return React.cloneElement(icon, { className: className });
  };
  if(disabled)
  console.log('disabled',disabled)
  return (
    <Tooltip
      label={`${tooltip}`}
      disabled={!tooltip || tooltip.length == 0}
      transitionProps={{ duration: 200, transition: "fade" }}
      multiline
    >
      <Checkbox
        radius="xs"
        checked={isActive}
        indeterminate
        icon={CheckboxIcon}
        aria-disabled={disabled}
        aria-label={ariaText}
        variant="outline"
        // color={isActive ? "white" : "black"}
        onChange={() => {
          if (!disabled)
            if (icon) {
              // todo: if used for > 2 icons refactor to use switch(icon) statement
              handleSwitch(selected[`symbol`], selected[`label`], plot);
            } else {
              handleSwitch(selected);
            }
        }}
        className="gene-panel-table-survival"
        classNames={{
          root: `${margin} bg-transparent gene-panel-table-survival`,
          input: ` cursor-pointer peer  hover:bg-mmrf-blush checked:bg-mmrf-rust`,
          icon: "peer-hover:!text-white",
        }}
      />
    </Tooltip>
  );
};

export default ToggledCheck;
