import { createTheme, mergeThemeOverrides, Anchor } from '@mantine/core';
import { GEN3_COMMONS_NAME } from '@gen3/core';
import { TenStringArray, createMantineTheme } from '@gen3/frontend';
import themeExtensionClasses from './styles/mantineThemeExtensions.module.css';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const themeColors: Record<string, TenStringArray> = require(
  `../config/${GEN3_COMMONS_NAME}/themeColors.json`,
);

const gen3Theme = createMantineTheme(
  {
    fontFamily: "Montserrat, Noto Sans, sans-serif",
    heading: ['Montserrat, Noto Sans, sans-serif'],
    content: ['Montserrat, Noto Sans, sans-serif'],
  },
  themeColors,
);
const localTheme = createTheme({
  components: {
    Anchor: Anchor.extend({ classNames: themeExtensionClasses }),
    Tooltip: {
      defaultProps: {
        arrowSize: 10,
        classNames: {
          tooltip:
            'bg-base-min bg-opacity-90 text-base-max shadow-lg font-content font-medium text-sm',
          arrow: 'bg-base-min bg-opacity-90',
        },
        events: {
          focused: true,
        },
        withinPortal: true,
        position: 'top',
      },
    },
    Notification: {
      styles: {
        root: {
          padding: '0.5rem 1rem',
          zIndex: 1200,
        },
      }
    }
  },
});

export default mergeThemeOverrides(gen3Theme, localTheme);
