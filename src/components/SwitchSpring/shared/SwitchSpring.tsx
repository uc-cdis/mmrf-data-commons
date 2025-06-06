import React, { ReactNode } from 'react';
import { Tooltip, Switch } from '@mantine/core';

interface SwitchSpringProps {
  isActive: boolean;
  icon: ReactNode;
  selected: string | Record<string, any>;
  disabled?: boolean;
  handleSwitch: any;
  tooltip: string;
  margin?: string;
  survivalProps?: {
    plot: string;
  };
}

const SwitchSpring: React.FC<SwitchSpringProps> = ({
  isActive,
  icon,
  selected,
  disabled = false,
  handleSwitch,
  tooltip = '', // Changed from undefined to empty string to get build to work
  margin,
  survivalProps,
}: SwitchSpringProps) => {
  const { plot } = survivalProps ?? { plot: '' };

  const toggleSwitch = () => {
    // todo: if used for > 2 icons refactor to use switch(icon) statement
    /*
Commenting this out for now to get build to work
if (icon) {
      handleSwitch(selected[`symbol`], selected[`name`], plot);
    } else { */
    handleSwitch(selected);
    //}
  };

  return (
    <Tooltip
      label={tooltip}
      disabled={!tooltip}
      data-testid="tooltipSwitchSpring"
    >
      {/* span is needed for tooltip since a disabled element won't emit a mouse event */}
      <span>
        <Switch
          data-testid="button-switchspring"
          classNames={{
            thumb: `border-2 rounded w-5 h-5 ${
              disabled ? 'border-gray-300' : 'border-activeColor'
            } ${margin} ${isActive ? 'left-auto right-0' : 'left-0'}`,
            input: '',
            track: `rounded box-content overflow-visible border border-base-lightest ${
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            } ${isActive ? 'bg-activeColor' : 'bg-gray-300'}`,
            root: disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          }}
          aria-label={tooltip}
          checked={isActive}
          onChange={toggleSwitch}
          disabled={disabled}
          thumbIcon={icon}
        />
      </span>
    </Tooltip>
  );
};

export default SwitchSpring;
