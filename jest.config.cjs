/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  modulePathIgnorePatterns: ["actions-runner"],
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/test/jest/__mocks__/styleMock.js',
  }
};