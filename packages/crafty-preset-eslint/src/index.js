const path = require("path");

const { toESLintConfig } = require("./eslintConfigurator.js");
const {
  ideConfiguration,
  toolConfiguration,
  toTempFile
} = require("./templates.js");

const debug = require("@swissquote/crafty-commons/packages/debug")(
  "crafty:preset-eslint"
);

const MODULES = path.join(__dirname, "..", "node_modules");

module.exports = {
  toESLintConfig,
  presets: [require.resolve("@swissquote/crafty-preset-prettier")],
  ide(crafty) {
    return {
      "eslint.config.mjs": {
        shouldIgnore: false,
        alternativeFiles: [".eslintrc.js"],
        content: ideConfiguration(crafty)
      }
    };
  },
  commands() {
    return {
      eslint: {
        command(crafty, input, cli) {
          require("./commands/jsLint.js")(crafty);
        },
        description: "Lint JavaScript for errors"
      },
      jsLint: {
        command(crafty, input, cli) {
          require("./commands/jsLint.js")(crafty);
        },
        description: "Lint JavaScript for errors"
      }
    };
  },
  eslintExtensions() {
    return ["js", "jsx"];
  },
  webpack(crafty, bundle, chain) {
    chain.resolve.extensions.add(".jsx");
    chain.resolve.modules.add(MODULES);
    chain.resolveLoader.modules.add(MODULES);

    const extensions = [];
    crafty.loadedPresets
      .filter(preset => preset.implements("eslintExtensions"))
      .forEach(preset => {
        debug(`${preset.presetName}.eslintExtensions()`);
        extensions.push(...preset.get("eslintExtensions")());
      });

    if (!crafty.isWatching()) {
      // JavaScript linting
      chain
        .plugin("lint-js")
        .use(require.resolve("../packages/eslint-webpack-plugin.js"), [
          {
            configType: "flat",
            eslintPath: require.resolve("eslint/use-at-your-own-risk"),
            extensions,
            overrideConfigFile: toTempFile(toolConfiguration(crafty))
          }
        ]);
    }
  }
};
