module.exports = {
  vitest(crafty, options) {
    options.plugins = [
      {
        name: "local-non-serializable-plugin",
        transform(code) {
          return code;
        }
      }
    ];
  }
};