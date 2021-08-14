// @ts-check

/** @type import('@jest/types').Config.InitialOptions */
module.exports = {
  displayName: 'benchmark',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/benchmark/render-time.tsx'],
  moduleNameMapper: {
    '\\.mp3$': '<rootDir>/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    // konva はトランスパイルが必要なので明示的にトランスパイル対象に含めてやる
    // ref: https://jestjs.io/docs/26.x/tutorial-react-native#transformignorepatterns-customization
    '/node_modules/(?!(konva|react-performance-testing)/)',
    '\\.pnp\\.[^\\/]+$',
  ],
};
