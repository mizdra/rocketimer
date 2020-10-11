// @ts-check

/** @type import('@jest/types').Config.InitialOptions */
module.exports = {
  displayName: 'e2e',
  preset: 'jest-playwright-preset',
  testMatch: ['<rootDir>/e2e/**/*.test.ts?(x)'],
};
