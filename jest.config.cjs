/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/tests/setupAfterEnv.js'],
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/tests/contract/test_*.js',
    '<rootDir>/tests/integration/test_*.js',
  ],
  testPathIgnorePatterns: ['/node_modules/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  collectCoverageFrom: ['src/**/*.js', '!src/index.js', '!src/config/**'],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 35,
      statements: 35,
    },
  },
  verbose: true,
};
