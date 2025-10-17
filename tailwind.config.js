/** @type {import('tailwindcss').Config} */
/* eslint-disable @typescript-eslint/no-var-requires */

const plugin = require('tailwindcss/plugin');
/* eslint-disable @typescript-eslint/no-var-requires */
const GEN3_COMMONS_NAME = process.env.GEN3_COMMONS_NAME || 'gen3';
// const { GEN3_COMMONS_NAME } = require('@gen3/core');
const themeColors = require(`./config/${GEN3_COMMONS_NAME}/themeColors.json`);
const themeFonts = require(`./config/${GEN3_COMMONS_NAME}/themeFonts.json`);

// got these from v1 (portal-ui)
// https://github.com/NCI-GDC/portal-ui/blob/develop/src/packages/%40ncigdc/theme/versions/active.ts#L88
const vep = {
  high: "rgb(185, 36, 36)",
  moderate: "#634d0c",
  modifier: "#634d0c",
  low: "#015c0a",
};

const sift = {
  deleterious: "rgb(185, 36, 36)",
  deleterious_low_confidence: "#634d0c",
  tolerated: "#634d0c",
  tolerated_low_confidence: "#015c0a",
};

const polyphen = {
  benign: "#015c0a",
  possibly_damaging: "#634d0c",
  probably_damaging: "rgb(185, 36, 36)",
  unknown: "rgb(107,98,98)",
};

const impact = {
  vep,
  sift,
  polyphen,
};

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/features/**/*.{js,ts,jsx,tsx}',
    './node_modules/@gen3/frontend/dist/index/esm/*.js'
  ],
  theme: {
    extend: {
      colors: {
        "gdc-survival": {
          0: "#8d3859",
          1: "#FCA88D",
          2: "#20313B",
          3: "#D62728",
          4: "#B94BB9",
          5: "#8C564B",
          6: "#D42BA1",
          7: "#757575",
          8: "#7A7A15",
          9: "#10828E",
        },
        gen3: {
          secondary: '#3283C8',
          primary: '#05B8EE',
          lime: '#7EC500',
          iris: '#AD91FF',
          rose: '#E74C3C',
          bee: '#F4B940',
          pink: '#FF7ABC',
          highlight_orange: '#EF8523',
          highlight_orange_light: '#FF9635',
          mint: '#26D9B1',
          coal: '#4A4A4A',
          cloud: '#F5F5F5',
          gray: '#606060',
          lightgray: '#9B9B9B',
          smoke: '#D1D1D1',
          silver: '#E7E7E7',
          black: '#000000',
          white: '#FFFFFF',
          titanium: '#707070',
          obsidian: '#757575',
        },
        impact: impact,
        ...themeColors,
      },
      fontFamily: {
        heading: themeFonts.heading,
        content: themeFonts.content,
      },
      fontSize: {
        tiny: '0.625rem',
      },
      borderWidth: {
        DEFAULT: '1px',
        0: '0',
        1: '1px',
        2: '2px',
        3: '3px',
        4: '4px',
        6: '6px',
        8: '8px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    plugin(function ({ addVariant }) {
      // add mantine.dev variants
      addVariant('api-checked', '&[api-checked]');
      addVariant('api-active', '&[api-active]');
      addVariant('api-selected', '&[api-selected]');
      addVariant('api-hovered', '&[api-hovered]');
      addVariant('api-disabled', '&[api-disabled]');
      addVariant('api-in-range', '&[api-in-range]');
      addVariant('api-first-in-range', '&[api-first-in-range]');
      addVariant('api-last-in-range', '&[api-last-in-range]');
      addVariant('data-checked', '&[data-checked]');
      addVariant('data-active', '&[data-active]');
      addVariant('data-selected', '&[data-selected]');
      addVariant('data-hovered', '&[data-hovered]');
      addVariant('data-disabled', '&[data-disabled]');
      addVariant('data-in-range', '&[data-in-range]');
      addVariant('data-first-in-range', '&[data-first-in-range]');
      addVariant('data-last-in-range', '&[data-last-in-range]');
      addVariant('data-with-icon', '&[data-with-icon]');
    }),
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        '.nextImageFillFix': {
          width: 'auto !important',
          right: 'auto !important',
          'min-width': '0 !important',
        },
      };
      addUtilities(newUtilities);
    }),
    plugin(function ({ addComponents }) {
      // TODO remove these
      addComponents({
        '.heal-btn': {
          display: 'inline-block',
          textAlign: 'center',
          padding: '0.375rem 1rem',
          fontSize: '1rem',
          lineHeight: '1.5',
          fontWeight: '600',
          textTransform: 'uppercase',
          color: '#ffffff',
          border: '4px solid transparent',
          borderRadius: '7px',
          backgroundColor: '#982568',
          '&:hover, &:focus': {
            backgroundColor: '#ffffff',
            borderColor: '#982568',
            color: '#982568',
          },
        },
        '.heal-btn-purple': {
          backgroundColor: '#532565',
          '&:hover, &:focus': {
            color: '#532565',
            borderColor: '#532565',
            backgroundColor: '#ffffff',
          },
        },
        '.heal-btn-rev': {
          color: '#982568',
          borderColor: '#982568',
          backgroundColor: '#ffffff',
          '&:hover, &:focus': {
            backgroundColor: '#982568',
            borderColor: 'transparent',
            color: '#ffffff',
          },
        },
        '.heal-link-footer': {
          color: '#FFFFFF',
          '&:hover, &:focus': {
            color: '#c0b3c5',
          },
        },
      });
    }),
  ],
  safelist: [
    'accent-warm',
    'text-tiny',
    'text-xxs',
    'text-xxxs',
    'mmrf-plum',
    'mmrf-sand',
    'mmrf-platinum',
    'mmrf-purple',
    'mmrf-blush',
    'mmrf-gunmetal',
    'mmrf-lightgray',
    'mmrf-seashell',
    'mmrf-rust',
    'mmrf-apricot',
    'h-20',
    'text-tiny',
    'text-xxs',
    'text-xxxs',
    'mt-10',
    'mb-10',
    'focus-visible:outline-none',
    'focus-visible:ring-offset-2',
    'focus:ring-offset-white',
    'focus-visible:ring-inset',
    'focus-visible:ring-2',
    'focus-visible:ring-focusColor',
    // survival plot colors
    "bg-gdc-survival-0",
    "bg-gdc-survival-1",
    "bg-gdc-survival-2",
    "bg-gdc-survival-3",
    "bg-gdc-survival-4",
    "bg-gdc-survival-5",
    "bg-gdc-survival-6",
    "bg-gdc-survival-7",
    "bg-gdc-survival-8",
    "bg-gdc-survival-9",
    "text-gdc-survival-0",
    "text-gdc-survival-1",
    "text-gdc-survival-2",
    "text-gdc-survival-3",
    "text-gdc-survival-4",
    "text-gdc-survival-5",
    "text-gdc-survival-6",
    "text-gdc-survival-7",
    "text-gdc-survival-8",
    "text-gdc-survival-9",
    {
      pattern:
        /bg-(primary|secondary|accent|accent-warm|accent-cool|base)-(min|lightest|lighter|light|dark|darker|darkest|max)/,
    },
    {
      pattern:
        /text-(primary|secondary|accent|accent-warm|accent-cool|base)-(min|lightest|lighter|light|dark|darker|darkest|max)/,
    },
    {
      pattern:
        /text-(primary|secondary|accent|accent-warm|accent-cool|base)-contrast-(min|lightest|lighter|light|dark|darker|darkest|max)/,
    },
    {
      pattern:
        /border-(primary|secondary|accent|accent-warm|accent-cool|base)-(min|lightest|lighter|light|dark|darker|darkest|max)/,
    },
    {
      pattern: /bg-(primary|secondary|accent|accent-warm|accent-cool|base)/,
    },
    {
      pattern: /text-(primary|secondary|accent|accent-warm|accent-cool|base)/,
    },
    {
      pattern: /border-(primary|secondary|accent|accent-warm|accent-cool|base)/,
    },
  ],
};
