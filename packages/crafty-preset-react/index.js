const path = require("path");

const MODULES = path.join(__dirname, "node_modules");

function enableHotLoader(crafty, bundle) {
  return (
    crafty.getEnvironment() === "development" &&
    crafty.isWatching() &&
    bundle.hot &&
    bundle.react &&
    bundle.react.refreshMode === "hot"
  );
}

function enableFastRefresh(crafty, bundle) {
  return (
    crafty.getEnvironment() === "development" &&
    crafty.isWatching() &&
    bundle.hot &&
    bundle.react &&
    bundle.react.refreshMode === "fast"
  );
}

module.exports = {
  normalizeBundle(crafty, bundle) {
    if (!bundle.react) {
      return;
    }

    // Initially "react" was a boolean configuration
    // since we are moving from "hot reload" to "fast refresh"
    // the goal is to make it clear what option we're choosing
    // but still allow to pick a single boolean value to simplify
    // the configuration
    if (bundle.react && typeof bundle.react === "boolean") {
      bundle.react = {
        refreshMode: "hot" // fast-refresh is opt-in for now, default to hot
      };
    }
  },
  jest(crafty, options) {
    options.moduleDirectories.push(MODULES);

    options.setupFilesAfterEnv = options.setupFilesAfterEnv || [];
    options.setupFilesAfterEnv.push(require.resolve("./testSetup.js"));
  },
  babel(crafty, bundle, babelConfig) {
    // Add hot module replacement for bundles with React
    if (enableHotLoader(crafty, bundle)) {
      console.log("Enabled hot loader");
      babelConfig.plugins.push(require.resolve("react-hot-loader/babel"));
    }

    // Add fast refresh for bundles with React
    if (enableFastRefresh(crafty, bundle)) {
      console.log("Enabled fast refresh");
      babelConfig.plugins.push(require.resolve("react-refresh/babel"));
    }
  },
  swc(crafty, bundle, swcOptions) {
    if (enableFastRefresh(crafty, bundle)) {
      if (!swcOptions.jsc.transform) {
        swcOptions.jsc.transform = {};
      }

      if (!swcOptions.jsc.transform.react) {
        swcOptions.jsc.transform.react = {};
      }

      swcOptions.jsc.transform.react.development = true;
      swcOptions.jsc.transform.react.refresh = true;
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

    if (enableFastRefresh(crafty, bundle)) {
      // If somebody still includes react-hot-loader,
      // make sure they know they should remove it
      // but doesn't impact production
      chain.resolve.alias.set(
        "react-hot-loader",
        path.dirname(require.resolve("./react-hot-loader"))
      );

      // https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/main/docs/API.md#reactrefreshpluginoptions
      const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

      chain.plugin("react-refresh").use(ReactRefreshWebpackPlugin, [
        {
          overlay: {
            sockIntegration: "wps" // webpack-plugin-serve
          }
        }
      ]);
    }
  }
};
