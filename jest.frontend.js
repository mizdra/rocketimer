// @ts-check

/** @type import('@jest/types').Config.InitialOptions */
module.exports = {
  displayName: 'test',
  testMatch: ['<rootDir>/src/**/*.test.ts?(x)'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx,js,jsx}', '!**/*.d.ts'],
  moduleNameMapper: {
    '\\.mp3$': '<rootDir>/__mocks__/fileMock.js',
  },
};
