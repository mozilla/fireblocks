module.exports = {
  testMatch: ["**/test/*.test.js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testEnvironment: 'jsdom',
  setupFiles: ['jest-webextension-mock'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverage: true,
  collectCoverageFrom: ["fireblocks/**/*.js"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/browserAction/", "/pageAction/"],
  coverageReporters: ["lcov", "text"],
  coverageThreshold: {
    global: {
      statements: 5,
      branches: 5,
      functions: 5,
      lines: 5,
    },
  },
};
