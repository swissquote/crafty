const path = require("node:path");

const { toESLintConfig } = require("./eslintConfigurator.js");
const {
  ideConfiguration,
  toolConfiguration,
  toTempFile
} = require("./templates.js");
require("./patch-for-eslintignore.js");
const { createFormatter } = require("./formatter.js");

const debug = require("@swissquote/crafty-commons/packages/debug")(
  "crafty:preset-eslint"
);

const MODULES = path.join(__dirname, "..", "node_modules");

module.exports = {
  toESLintConfig,
  // Declares that this preset provides the "eslint" linter. Crafty resolves the
  // active linter from this (see Crafty#getActiveLinter); when another linter
  // (e.g. oxlint) is the active one, ESLint's build linting and IDE config stand
  // down to avoid double linting and conflicting configs.
  provides: { linter: "eslint" },
  presets: [require.resolve("@swissquote/crafty-preset-prettier")],
  ide(crafty) {
    if (!crafty.isActiveLinter("eslint")) {
      return {};
    }

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

    if (!crafty.isWatching() && crafty.isActiveLinter("eslint")) {
      // JavaScript linting
      chain
        .plugin("lint-js")
        .use(require.resolve("../packages/eslint-webpack-plugin.js"), [
          {
            configType: "flat",
            eslintPath: require.resolve("eslint"),
            extensions,
            overrideConfigFile: toTempFile(toolConfiguration(crafty)),
            formatter: createFormatter(bundle.taskName)
          }
        ]);
    }
  },
  rspack(crafty, bundle, chain) {
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

    if (!crafty.isWatching() && crafty.isActiveLinter("eslint")) {
      // JavaScript linting
      chain
        .plugin("lint-js")
        .use(require.resolve("../packages/eslint-rspack-plugin.js"), [
          {
            configType: "flat",
            eslintPath: require.resolve("eslint"),
            extensions,
            overrideConfigFile: toTempFile(toolConfiguration(crafty)),
            formatter: createFormatter(bundle.taskName)
          }
        ]);
    }
  }
};
