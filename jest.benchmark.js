// @ts-check

/** @type import('@jest/types').Config.InitialOptions */
module.exports = {
  displayName: 'benchmark',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/benchmark/render-time.tsx'],
  moduleNameMapper: {
    '\\.mp3$': '<rootDir>/__mocks__/fileMock.js',
  },
};
