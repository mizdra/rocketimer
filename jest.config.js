// @ts-check

/** @type import('@jest/types').Config.InitialOptions */
const SHARED_CONFIG = {
  moduleNameMapper: {
    '\\.mp3$': '<rootDir>/__mocks__/fileMock.js',
  },
};

/** @type import('@jest/types').Config.InitialOptions */
module.exports = {
  projects: [
    {
      ...SHARED_CONFIG,
      displayName: 'test',
      testMatch: ['<rootDir>/src/**/*.test.ts?(x)'],
      collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx,js,jsx}', '!**/*.d.ts'],
    },
    {
      ...SHARED_CONFIG,
      displayName: 'benchmark',
      testMatch: ['<rootDir>/benchmark/render-time.tsx'],
    },
  ],
};
