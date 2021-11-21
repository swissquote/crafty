module.exports = {
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**"
  ],
  testEnvironment: "node",
  verbose: true,
  coveragePathIgnorePatterns: ["node_modules", "coverage", "dist/compiled", "jest.config.js"],
  moduleNameMapper: {
    "eslint/use-at-your-own-risk": "eslint/lib/unsupported-api.js"
  }
};
