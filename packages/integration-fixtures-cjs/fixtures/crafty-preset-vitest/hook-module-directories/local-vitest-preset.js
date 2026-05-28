module.exports = {
  vitest(crafty, options, context) {
    context.moduleDirectories.push("test_modules");
  }
};