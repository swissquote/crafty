module.exports = {
  vitest(crafty, options, context) {
    context.moduleDirectories.push("test_modules");

    options.test.setupFiles = options.test.setupFiles || [];
    options.test.setupFiles.push(require.resolve("./setup.js"));
  }
};