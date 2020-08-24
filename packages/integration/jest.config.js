module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/fixtures/"],
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**",
  ],
  testEnvironment: "node",
  verbose: true,
};
