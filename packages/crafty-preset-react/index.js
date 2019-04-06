const path = require("path");

const MODULES = path.join(__dirname, "node_modules");

module.exports = {
  jest(crafty, options) {
    // We use unshift instead of push because the version of `parse5`
    // provided in crafty-preset-jest is 1.5 while the version needed in crafty-preset-react is 3.*
    // This shouldn't change anything in normal usage, only in crafty's development environment
    options.moduleDirectories.unshift(MODULES);
    try {
      const resolved = require.resolve("cheerio/node_modules/parse5/package.json");
      options.moduleDirectories.unshift(path.dirname(path.dirname(resolved)));
    } catch (e) {
      try {
        const resolved = require.resolve("parse5/package.json");
        options.moduleDirectories.unshift(path.dirname(path.dirname(resolved)));
      } catch (e2) {
        console.log("Could not find 'parse5', you might encounter an error similar to 'TypeError: Cannot read property 'htmlparser2' of undefined'.");
      }
    }

    options.setupFilesAfterEnv = options.setupFilesAfterEnv || [];
    options.setupFilesAfterEnv.push(require.resolve("./testSetup.js"));
  },
  babel(crafty, bundle, babelConfig) {

    // Add hot module replacement for bundles with React
    if (crafty.getEnvironment() === "development" && crafty.isWatching() && bundle.hot && bundle.react) {
      babelConfig.plugins.push(require.resolve("react-hot-loader/babel"));
    }
  }
};
