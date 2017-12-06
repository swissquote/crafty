const path = require("path");

const MODULES = path.join(__dirname, "node_modules");

module.exports = {
  jest(crafty, options) {
    // We use unshift instead of push because the version of `parse5`
    // provided in crafty-preset-jest is 1.5 while the version needed in crafty-preset-react is 3.*
    // This shouldn't change anything in normal usage, only in crafty's development
    options.moduleDirectories.unshift(MODULES);

    // TODO :: ensure we can still use `setupTestFrameworkScriptFile` and this at the same time
    options.setupTestFrameworkScriptFile = require.resolve("./testSetup.js");
  },
  webpack(crafty, bundle, chain) {
    chain.resolve.modules.add(MODULES);
    chain.resolveLoader.modules.add(MODULES);


    if (crafty.getEnvironment() !== "production" && crafty.isWatching() && bundle.hot && bundle.react) {

      // Only TypeScript needs this loader, babel uses a plugin
      if (chain.module.rule("ts")) {
        chain.module.rule("ts").use("hot").loader("react-hot-loader/webpack");
      }

      // According to react-hot-loader's documentation, this should be the very first entry.
      chain.entry("default").prepend(require.resolve("react-hot-loader/patch"));
    }

  },
  babel(crafty, bundle, babelConfig) {

    // Add hot module replacement for bundles with React
    if (crafty.getEnvironment() === "development" && crafty.isWatching() && bundle.hot && bundle.react) {
      babelConfig.plugins.push(require.resolve("react-hot-loader/babel"));
    }
  }
};
