/* global global */
const path = require("path");

const resolveFrom = require("resolve-from");

require("./patchModuleResolver");

module.exports = function configurationBuilder(args) {
  let configuration = {
    plugins: ["@swissquote/swissquote"],
    extends: ["plugin:@swissquote/swissquote/format"],
    rules: {},
    settings: {}
  };

  function mergeConfiguration(newConfiguration) {
    if (
      newConfiguration.useEslintrc === false &&
      args.indexOf("--no-eslintrc") === -1
    ) {
      args.push("--no-eslintrc");
    }

    if (newConfiguration.extends) {
      if (typeof newConfiguration.extends === "string") {
        configuration.extends.push(newConfiguration.extends);
      } else {
        newConfiguration.extends.forEach(item =>
          configuration.extends.push(item)
        );
      }
    }

    Object.assign(configuration.rules, newConfiguration.rules || {});

    if (newConfiguration.baseConfig && newConfiguration.baseConfig.settings) {
      Object.assign(
        configuration.settings,
        newConfiguration.baseConfig.settings
      );
    }

    if (newConfiguration.settings) {
      Object.assign(configuration.settings, newConfiguration.settings);
    }

    if (newConfiguration.configFile) {
      mergeConfiguration(require(newConfiguration.configFile));
    }
  }

  // Override from default config if it exists
  if (global.craftyConfig) {
    mergeConfiguration(global.craftyConfig.eslint);
  }

  // Merge configuration that can be passed in cli arguments
  let idx;
  if ((idx = args.indexOf("--config")) > -1) {
    const configFile = args[idx + 1];
    args.splice(idx, 2);

    mergeConfiguration(
      require(resolveFrom.silent(process.cwd(), configFile) ||
        path.join(process.cwd(), configFile))
    );
  }

  if (args.indexOf("--preset") > -1) {
    configuration.extends = [];

    while ((idx = args.indexOf("--preset")) > -1) {
      configuration.extends.push(
        "plugin:@swissquote/swissquote/" + args[idx + 1]
      );
      args.splice(idx, 2);
    }
  }

  // Disable `no-var` as this linter can also be run
  // on es5 code, if used with --fix, the result
  // would be broken code or false positives.
  configuration.rules["no-var"] = 0;

  return {
    configuration: configuration,
    args: args
  };
};
