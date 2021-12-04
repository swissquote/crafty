const debug = require("@swissquote/crafty-commons/packages/debug");
const findUp = require("@swissquote/crafty-commons/packages/find-up");

function hasSwcHelpersDependency() {
  const packageJsonPath = findUp.sync("package.json", { cwd: process.cwd() });
  if (!packageJsonPath) {
    // If we can't find a package.json, we won't be able to know which version of the @swc/helpers we have
    return false;
  }

  const packageJson = require(packageJsonPath);
  return (
    packageJson.hasOwnProperty("dependencies") &&
    packageJson.dependencies.hasOwnProperty("@swc/helpers")
  );
}

function getConfiguration(crafty, bundle, hasHelperDependency) {
  const swcOptions = {
    jsc: {
      parser: {
        jsx: true
      },
      target: "es5"
    },
    env: {
      targets: crafty.config.browsers,
      mode: "entry",
      coreJs: 3
    },
    sourceMaps: true
  };

  if (hasHelperDependency) {
    swcOptions.jsc.externalHelpers = true;
  }

  // Apply preset configuration
  crafty.getImplementations("swc").forEach(preset => {
    debug(`${preset.presetName}.swc(Crafty, bundle, swcOptions)`);
    preset.swc(crafty, bundle, swcOptions);
    debug("preset executed");
  });

  debug("SWC configuration", swcOptions);

  return swcOptions;
}

function getConfigurationWebpack(crafty, bundle, hasHelperDependency) {
  const options = getConfiguration(crafty, bundle, hasHelperDependency);

  // Always enabled
  options.jsc.externalHelpers = true;

  // We force compilation for Chrome 71 since it's the last version of Chrome that did NOT support
  // public class fields (https://caniuse.com/mdn-javascript_classes_public_class_fields)
  // The reason is that Webpack doesn't support this syntax, so passing it to webpack will break it.
  // This makes sure it doesn't happen
  options.env.targets += ", chrome 71";

  // Force ES6 exports even if a module has a specific module syntax in a `.swcrc`
  options.module = { type: "es6" };

  return options;
}

function getConfigurationRollup(crafty, bundle) {
  const hasHelperDependency = hasSwcHelpersDependency();

  const options = getConfiguration(crafty, bundle, hasHelperDependency);

  // Pass that information to the rollup plugin
  options.hasHelperDependency = hasHelperDependency;

  // Always enabled
  options.jsc.externalHelpers = true;

  // Force ES6 exports even if a module has a specific module syntax in a `.swcrc`
  options.module = { type: "es6" };

  return options;
}

function getConfigurationGulp(crafty, bundle) {
  return getConfiguration(crafty, bundle, hasSwcHelpersDependency());
}

module.exports = {
  hasSwcHelpersDependency,
  getConfiguration,
  getConfigurationWebpack,
  getConfigurationRollup,
  getConfigurationGulp
};
