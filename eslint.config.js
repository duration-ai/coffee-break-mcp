import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import unicorn from 'eslint-plugin-unicorn';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  { ignores: ['node_modules/**', 'drizzle/**'] },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      unicorn,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...unicorn.configs['flat/recommended'].rules,
      'unicorn/filename-case': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  eslintConfigPrettier,
];
