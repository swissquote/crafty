module.exports = {
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**"
  ],
  testEnvironment: "node",
  verbose: true,
  coveragePathIgnorePatterns: [
    "node_modules",
    "coverage",
    "dist/compiled",
    "jest.config.js"
  ]
};
