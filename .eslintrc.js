module.exports = {
  root: true,
  extends: ['@mizdra/mizdra', '@mizdra/mizdra/+typescript', '@mizdra/mizdra/+react', '@mizdra/mizdra/+prettier'],
  parserOptions: {
    project: ['./tsconfig.frontend.json', './tsconfig.test.json', './tsconfig.benchmark.json'],
  },
  env: {
    es6: true,
    browser: true,
    node: true, // for jest
    jest: true, // for jest
  },
  rules: {
    'react-hooks/exhaustive-deps': [
      1,
      {
        additionalHooks: 'useRecoilCallback',
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
      },
    },
  ],
};
