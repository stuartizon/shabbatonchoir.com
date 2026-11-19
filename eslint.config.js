import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist/', '.astro/'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  // Accessibility rules for the markup in .astro files (eslint-plugin-jsx-a11y-x).
  ...astro.configs['jsx-a11y-recommended'],
  {
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ['**/*.cjs'],
    languageOptions: { sourceType: 'commonjs' },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
  {
    // Known failure, tracked in #18. Make this an error again when it's fixed.
    rules: { 'astro/jsx-a11y/html-has-lang': 'warn' },
  },
];
