import { Checkbox, CheckboxProps, Tooltip } from "@mantine/core";
import React from "react";

interface ToggleProps {
  isActive: boolean;
  icon: JSX.Element;
  selected: string | Record<string, string>;
  disabled?: boolean;
  handleSwitch: any;
  tooltip: string | undefined;
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
  return (
    <Tooltip
      label={`${tooltip}`}
      disabled={!tooltip || tooltip.length == 0}
      transitionProps={{ duration: 200, transition: "fade" }}
      multiline
    >
      <Checkbox
        classNames={{
          inner: "hover:bg-accent",
        }}
        radius="xs"
        checked={isActive}
        indeterminate
        icon={CheckboxIcon}
        aria-disabled={disabled}
        aria-label={ariaText}
        variant={isActive ? "filled" : "outline"}
        color={"primary.4"}
        onChange={() => {
          if (!disabled)
            if (icon && typeof selected === 'object') {
              // todo: if used for > 2 icons refactor to use switch(icon) statement
              handleSwitch(selected[`symbol`], selected[`label`], plot);
            } else {
              handleSwitch(selected);
            }
        }}
      />
    </Tooltip>
  );
};

export default ToggledCheck;
