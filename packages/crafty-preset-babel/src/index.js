const path = require("node:path");
const babelConfigurator = require("@swissquote/babel-preset-swissquote/configurator");

const MODULES = path.join(__dirname, "..", "node_modules");

module.exports = {
  presets: [
    require.resolve("@swissquote/crafty-preset-eslint"),
    require.resolve("@swissquote/crafty-preset-terser")
  ],
  defaultConfig(/* config */) {
    return {
      bundleTypes: { js: "js" }
    };
  },
  jest(crafty, options) {
    options.moduleDirectories.push(MODULES);
    options.transform["\\.(js|jsx)$"] = require.resolve("./jest-transformer");
    options.moduleFileExtensions.push("jsx");

    options.globals.BABEL_OPTIONS = babelConfigurator(
      crafty,
      {},
      {
        environment: "test",
        presetReact: { runtime: "automatic" }
      }
    );
  },
  vitest(crafty, options, context) {
    context.moduleDirectories.push(MODULES);
    context.moduleFileExtensions.push("jsx");
    context.runtimePlugins.push({
      pluginPath: require.resolve("./vitest-plugin"),
      options: babelConfigurator(
        crafty,
        {},
        {
          environment: "test",
          presetReact: { runtime: "automatic" }
        }
      )
    });
  },
  bundleCreator(crafty) {
    const configurators = { js: {} };

    if (
      crafty.loadedPresets.some(
        preset => preset.presetName === "@swissquote/crafty-runner-gulp"
      )
    ) {
      configurators.js["gulp/babel"] = (
        _crafty,
        bundle,
        gulp,
        StreamHandler
      ) => {
        const createTask = require("./gulp");
        gulp.task(bundle.taskName, createTask(_crafty, bundle, StreamHandler));
        _crafty.watcher.add(bundle.watch || bundle.source, bundle.taskName);
      };
    }

    return configurators;
  },
  webpack(crafty, bundle, chain) {
    chain.resolve.extensions.add(".jsx");
    chain.resolve.modules.add(MODULES);
    chain.resolveLoader.modules.add(MODULES);

    const babelWebpackConfigurator = require("@swissquote/babel-preset-swissquote/configurator-webpack");
    const options = babelWebpackConfigurator(crafty, bundle);

    // EcmaScript 2015+
    chain.module
      .rule("babel")
      .test(/\.jsx?$/)
      .exclude.add(/(node_modules|bower_components)/)
      .end()
      .use("babel")
      .loader(require.resolve("../packages/babel-loader"))
      .options(options);
  }
};
