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
    // We use unshift instead of push because the version of `parse5`
    // provided in crafty-preset-jest is 1.5 while the version needed in crafty-preset-react is 3.*
    // This shouldn't change anything in normal usage, only in crafty's development environment
    options.moduleDirectories.unshift(MODULES);
    try {
      const resolved = require.resolve(
        "cheerio/node_modules/parse5/package.json"
      );
      options.moduleDirectories.unshift(path.dirname(path.dirname(resolved)));
    } catch (e) {
      try {
        const resolved = require.resolve("parse5/package.json");
        options.moduleDirectories.unshift(path.dirname(path.dirname(resolved)));
      } catch (e2) {
        console.log(
          "Could not find 'parse5', you might encounter an error similar to 'TypeError: Cannot read property 'htmlparser2' of undefined'."
        );
      }
    }

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
      require.resolve("react-hot-loader")
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
