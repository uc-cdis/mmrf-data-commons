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
    heading: ['Poppins', 'sans-serif'],
    content: ['Poppins', 'sans-serif'],
    fontFamily: 'Poppins',
  },
  themeColors,
);
const localTheme = createTheme({
  components: {
    Anchor: Anchor.extend({ classNames: themeExtensionClasses }),
    /*     Anchor: {
      styles: () => ({
        root: {
          textDecoration: 'none', // Default style
          color: 'blue', // Default color
        },
      }),
      variants: {
        custom: {
          root: {
            color: 'white', // Custom color
            '&:hover': {
              textDecoration: 'underline', // Underline on hover
            },
          },
        },
      },
    }, */
  },
});

export default mergeThemeOverrides(gen3Theme, localTheme);
