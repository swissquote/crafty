const path = require("path");

const MODULES = path.join(__dirname, "..", "node_modules");

module.exports = {
  presets: [
    require.resolve("@swissquote/crafty-preset-eslint"),
    require.resolve("@swissquote/crafty-preset-terser")
  ],
  defaultConfig(config) {
    return {
      bundleTypes: { js: "js" }
    };
  },
  jest(crafty, options) {
    options.moduleDirectories.push(MODULES);
    options.transform["\\.(js|jsx)$"] = require.resolve("./jest-transformer");
    options.moduleFileExtensions.push("jsx");

    const babelConfigurator = require("@swissquote/babel-preset-swissquote/configurator");
    options.globals.BABEL_OPTIONS = babelConfigurator(
      crafty,
      {},
      { environment: "test" }
    );
  },
  bundleCreator(crafty) {
    const configurators = { js: {} };

    if (
      crafty.config.loadedPresets.some(
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
  rollup(crafty, bundle, rollupConfig) {
    const babelConfigurator = require("@swissquote/babel-preset-swissquote/configurator-rollup");
    const { hasRuntime, options } = babelConfigurator(crafty, bundle);

    if (hasRuntime) {
      rollupConfig.input.external.push(/@babel\/runtime/);
    }

    rollupConfig.input.plugins.babel = {
      plugin: require("@rollup/plugin-babel"),
      weight: 20,
      options
    };
  },
  webpack(crafty, bundle, chain) {
    chain.resolve.extensions.add(".jsx");
    chain.resolve.modules.add(MODULES);
    chain.resolveLoader.modules.add(MODULES);

    const babelConfigurator = require("@swissquote/babel-preset-swissquote/configurator-webpack");
    const options = babelConfigurator(crafty, bundle);

    // EcmaScript 2015+
    chain.module
      .rule("babel")
      .test(/\.jsx?$/)
      .exclude.add(/(node_modules|bower_components)/)
      .end()
      .use("babel")
      .loader(require.resolve("babel-loader"))
      .options(options);
  }
};
