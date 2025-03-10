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
  config(config, loadedPresets) {
    // Add eslint react version
    const eslintConfig = { ...config.eslint };

    let extendedEslintConfig = {
      config: eslintConfig,
      extensions: ["js", "jsx"]
    };

    // Apply overrides to clean up configuration
    loadedPresets
      .filter(preset => preset.implements("eslint"))
      .forEach(preset => {
        debug(`${preset.presetName}.eslint(config, eslint)`);

        const value = preset.get("eslint");
        if (typeof value === "function") {
          extendedEslintConfig = value(config, extendedEslintConfig);
        } else {
          extendedEslintConfig.config = copy(
            merge(extendedEslintConfig.config, value)
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
        content: stringifyConfiguration(
          configurationBuilder(process.argv).configuration
        )
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
  webpack(crafty, bundle, chain) {
    chain.resolve.extensions.add(".jsx");
    chain.resolve.modules.add(MODULES);
    chain.resolveLoader.modules.add(MODULES);

    if (!crafty.isWatching()) {
      // JavaScript linting
      chain
        .plugin("lint-js")
        .use(require.resolve("../packages/eslint-webpack-plugin.js"), [
          {
            extensions: crafty.config.eslintExtensions,
            overrideConfigFile: toTempFile(crafty.config.eslint),
            configType: "eslintrc"
          }
        ]);
    }
  }
};
