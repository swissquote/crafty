module.exports = {
  resolver: require.resolve("jest-pnp-resolver"),
  testPathIgnorePatterns: ["/node_modules/", "/fixtures/"],
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**"
  ],
  testEnvironment: "node",
  verbose: true
};
