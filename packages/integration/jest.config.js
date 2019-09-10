module.exports = {
  runner: "jest-serial-runner",
  testPathIgnorePatterns: ["/node_modules/", "/fixtures/"],
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**"
  ],
  testEnvironment: "node",
  verbose: true
};
