module.exports = {
  root: true,
  extends: ['@mizdra/mizdra', '@mizdra/mizdra/+typescript', '@mizdra/mizdra/+react', '@mizdra/mizdra/+prettier'],
  parserOptions: {
    project: ['./tsconfig.frontend.json', './tsconfig.benchmark.json', './tsconfig.e2e.json'],
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
      files: ['e2e/**/*'],
      globals: {
        page: 'readonly',
      },
    },
  ],
};
