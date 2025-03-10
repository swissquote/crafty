const path = require("path");

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
    options.transform["\\.(js|jsx)$"] = [
      require.resolve("@swissquote/crafty-commons-swc/packages/swc-jest.js"),
      {
        jsc: { parser: { jsx: true } }
      }
    ];
    options.moduleFileExtensions.push("jsx");
  },
  bundleCreator(crafty) {
    const configurators = { js: {} };

    if (
      crafty.loadedPresets.some(
        preset => preset.presetName === "@swissquote/crafty-runner-gulp"
      )
    ) {
      configurators.js["gulp/swc"] = (_crafty, bundle, gulp, StreamHandler) => {
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

    const {
      hasSwcHelpersDependency,
      getConfigurationWebpack
    } = require("@swissquote/crafty-commons-swc/src/configuration.js");

    const hasHelperDependency = hasSwcHelpersDependency();

    if (hasHelperDependency) {
      chain.externals(chain.get("externals").concat(/@swc\/helpers/));
    }

    // Make sure this module is resolved from the right path
    chain.resolve.alias.set(
      "@swc/helpers",
      path.dirname(require.resolve("@swc/helpers/package.json"))
    );

    // EcmaScript 2015+
    chain.module
      .rule("swc")
      .test(/\.jsx?$/)
      .exclude.add(/(node_modules|bower_components)/)
      .end()
      .use("swc")
      .loader(
        require.resolve("@swissquote/crafty-commons-swc/packages/swc-loader.js")
      )
      .options(getConfigurationWebpack(crafty, bundle, hasHelperDependency));
  }
};
