// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import react from 'eslint-plugin-react';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import jsLint from '@eslint/js';
import tsLint from 'typescript-eslint';
import next from '@next/eslint-plugin-next';
import globals from 'globals';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactHooks from 'eslint-plugin-react-hooks';


export default [
  reactRecommended,
  jsLint.configs.recommended,
  ...tsLint.configs.recommended,
  next.flatConfig.recommended,
  {
    ignores: [
      '.nx/**/*',
      '**/build/*',
      '**/*.css',
      'setupTests.ts',
      'node_modules/*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js'],

    ...react.configs.flat.recommended,
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,

      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.serviceworker,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      react: react,
      next: next,
      'react-hooks': reactHooks,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/prop-types': 'warn',
    },
  },
  ...storybook.configs["flat/recommended"]
];
