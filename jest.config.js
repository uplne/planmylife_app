module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  clearMocks: true,
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/test/jest/__mocks__/styleMock.js",
  },
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/(?!@crypto-es)/"],
};
