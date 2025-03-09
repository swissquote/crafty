const path = require("path");
const { copy } = require("@swissquote/crafty/packages/copy-anything");

const {
  toESLintConfig,
  ideConfiguration,
  toolConfiguration,
  toTempFile
} = require("./eslintConfigurator.js");

const debug = require("@swissquote/crafty-commons/packages/debug")(
  "crafty:preset-eslint"
);

const MODULES = path.join(__dirname, "..", "node_modules");

module.exports = {
  toESLintConfig,
  presets: [require.resolve("@swissquote/crafty-preset-prettier")],
  defaultConfig(/* config */) {
    // TODO :: default config disappears once a custom config is defined, this is probably not what we want
    return {
      // ESLint Override Rules
      eslint: [
        ...require("@swissquote/eslint-plugin-swissquote").configs.recommended
      ]
    };
  },
  config(config) {
    let extendedEslintConfig = {
      config: [],
      extensions: ["js", "jsx"]
    };

    // Apply overrides to clean up configuration
    config.loadedPresets
      .filter(preset => preset.implements("eslint"))
      .forEach(preset => {
        debug(`${preset.presetName}.eslint(config, eslintConfig)`);

        const value = preset.get("eslint");
        if (typeof value === "function") {
          extendedEslintConfig = value(config, extendedEslintConfig);
        } else {
          extendedEslintConfig.config.push(copy(value));
        }
      });

    config.eslintExtensions = extendedEslintConfig.extensions;
    config.eslint = extendedEslintConfig.config;

    return config;
  },
  ide(crafty) {
    return {
      "eslint.config.js": {
        shouldIgnore: false,
        alternativeFiles: [".eslintrc.js"],
        content: ideConfiguration(crafty)
      }
    };
  },
  commands() {
    return {
      jsLint: {
        //eslint-disable-next-line no-unused-vars
        command(crafty, input, cli) {
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
        // TODO :: return to a compiled version
        //.use(require.resolve("../packages/eslint-webpack-plugin.js"), [
        .use(require.resolve("eslint-webpack-plugin"), [
          {
            configType: "flat",
            eslintPath: require.resolve("eslint/use-at-your-own-risk"),
            extensions: crafty.config.eslintExtensions,
            overrideConfigFile: toTempFile(toolConfiguration(crafty))
          }
        ]);
    }
  }
};
