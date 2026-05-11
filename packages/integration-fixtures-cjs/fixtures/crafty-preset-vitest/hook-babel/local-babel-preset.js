module.exports = {
  babel(crafty, bundle, babelConfig) {
    babelConfig.plugins.push(require.resolve("./magic-plugin.js"));
  }
};