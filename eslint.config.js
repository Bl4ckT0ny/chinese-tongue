import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'tests/e2e/**/*.ts', 'playwright.config.ts'],
    languageOptions: {
      ecmaVersion: 2022
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  },
  {
    ignores: ['dist/**']
  }
);

