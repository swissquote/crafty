const path = require("path");

const MODULES = path.join(__dirname, "node_modules");

function enableHotLoader(crafty, bundle) {
  return (
    crafty.getEnvironment() === "development" &&
    crafty.isWatching() &&
    bundle.hot &&
    bundle.react
  );
}

module.exports = {
  jest(crafty, options) {
    options.moduleDirectories.push(MODULES);

    options.setupFilesAfterEnv = options.setupFilesAfterEnv || [];
    options.setupFilesAfterEnv.push(require.resolve("./testSetup.js"));
  },
  babel(crafty, bundle, babelConfig) {
    // Add hot module replacement for bundles with React
    if (enableHotLoader(crafty, bundle)) {
      babelConfig.plugins.push(require.resolve("react-hot-loader/babel"));
    }
  },
  webpack(crafty, bundle, chain) {
    // Resolve this module for Yarn PNP
    chain.resolve.alias.set(
      "react-hot-loader",
      path.dirname(require.resolve("react-hot-loader"))
    );

    if (enableHotLoader(crafty, bundle)) {
      // Patch react-dom
      chain.module
        .rule("react-hot-loader")
        .test(/\.jsx?$/)
        .include.add(/react-dom/)
        .end()
        .use("react-hot-loader")
        .loader(require.resolve("react-hot-loader/webpack"));
    }
  }
};
