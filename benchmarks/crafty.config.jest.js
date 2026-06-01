const path = require("node:path");

module.exports = {
  presets: [
    "@swissquote/crafty-preset-babel",
    "@swissquote/crafty-preset-jest",
  ],
  jest(crafty, options) {
    // setupFilesAfterEnv runs after the test framework is installed,
    // so `beforeEach` is available in the setup file.
    options.setupFilesAfterEnv = [
      require.resolve("./test-src/setup.js"),
    ];
    // Restrict jest to only discover tests under test-src/
    options.roots = [path.join(process.cwd(), "test-src")];
  },
};
