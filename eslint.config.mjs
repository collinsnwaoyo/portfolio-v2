import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextTypescript,
  {
    ignores: ['out/**', '.next/**', 'playwright-report/**', 'test-results/**'],
  },
];

export default eslintConfig;
