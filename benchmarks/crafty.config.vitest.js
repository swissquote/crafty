module.exports = {
  presets: ["@swissquote/crafty-preset-vitest"],
  vitest(crafty, options) {
    options.test.setupFiles = options.test.setupFiles || [];
    options.test.setupFiles.push(require.resolve("./test-src/setup.js"));
  },
};
