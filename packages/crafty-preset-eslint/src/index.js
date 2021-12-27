const path = require("path");
const { copy } = require("@swissquote/crafty/packages/copy-anything");
const { merge } = require("@swissquote/crafty/packages/merge-anything");

const {
  configurationBuilder,
  stringifyConfiguration,
  toTempFile
} = require("./eslintConfigurator");

const debug = require("@swissquote/crafty-commons/packages/debug")(
  "crafty:preset-eslint"
);

const MODULES = path.join(__dirname, "..", "node_modules");

module.exports = {
  presets: [require.resolve("@swissquote/crafty-preset-prettier")],
  defaultConfig(/* config */) {
    return {
      // ESLint Override Rules
      eslint: {
        extends: ["plugin:@swissquote/swissquote/recommended"],
        plugins: ["@swissquote/swissquote"]
      }
    };
  },
  config(config) {
    // Add eslint react version
    const eslintConfig = { ...config.eslint };

    let extendedEslintConfig = {
      config: eslintConfig,
      extensions: ["js", "jsx"]
    };

    // Apply overrides to clean up configuration
    config.loadedPresets
      .filter(preset => preset.eslint)
      .forEach(preset => {
        debug(`${preset.presetName}.eslint(config, eslint)`);
        if (typeof preset.eslint === "function") {
          extendedEslintConfig = preset.eslint(config, extendedEslintConfig);
        } else {
          extendedEslintConfig.config = copy(
            merge(extendedEslintConfig.config, preset.eslint)
          );
        }
      });

    config.eslintExtensions = extendedEslintConfig.extensions;
    config.eslint = extendedEslintConfig.config;

    return config;
  },
  ide(crafty) {
    global.craftyConfig = crafty.config;

    return {
      ".eslintrc.js": {
        content: configurationBuilder(process.argv).configuration,
        serializer: stringifyConfiguration
      }
    };
  },
  commands() {
    return {
      jsLint: {
        //eslint-disable-next-line no-unused-vars
        command(crafty, input, cli) {
          global.craftyConfig = crafty.config;
          require("./commands/jsLint");
        },
        description: "Lint JavaScript for errors"
      }
    };
  },
  rollup(crafty, bundle, rollupConfig) {
    // Add Eslint configuration
    rollupConfig.input.plugins.eslint = {
      plugin: require("@swissquote/rollup-plugin-eslint"),
      weight: -20,
      options: {
        overrideConfigFile: toTempFile(crafty.config.eslint),
        throwOnError: crafty.getEnvironment() === "production",
        exclude: [/node_modules/],
        include: crafty.config.eslintExtensions.map(
          extension => new RegExp(`\\.${extension}$`)
        )
      }
    };
  },
  webpack(crafty, bundle, chain) {
    chain.resolve.extensions.add(".jsx");
    chain.resolve.modules.add(MODULES);
    chain.resolveLoader.modules.add(MODULES);

    // JavaScript linting
    chain
      .plugin("lint-js")
      .use(require.resolve("../packages/eslint-webpack-plugin.js"), [
        {
          extensions: crafty.config.eslintExtensions,
          overrideConfigFile: toTempFile(crafty.config.eslint)
        }
      ]);
  }
};
