const getCustomPropertiesFromRoot = require("./lib/get-custom-properties-from-root");
const getCustomPropertiesFromImports = require("./lib/get-custom-properties-from-imports");
const transformProperties = require("./lib/transform-properties");
const writeCustomPropertiesToExports = require("./lib/write-custom-properties-to-exports");

const creator = opts => {
  // whether to preserve custom selectors and rules using them
  const preserve = "preserve" in Object(opts) ? Boolean(opts.preserve) : true;

  // sources to import custom selectors from
  const importFrom = [].concat(Object(opts).importFrom || []);

  // destinations to export custom selectors to
  const exportTo = [].concat(Object(opts).exportTo || []);

  // promise any custom selectors are imported
  const customPropertiesPromise = getCustomPropertiesFromImports(importFrom);

  // synchronous transform
  const syncTransform = root => {
    const customProperties = getCustomPropertiesFromRoot(root, { preserve });

    transformProperties(root, customProperties, { preserve });
  };

  // asynchronous transform
  const asyncTransform = async root => {
    const customProperties = Object.assign(
      {},
      getCustomPropertiesFromRoot(root, { preserve }),
      await customPropertiesPromise
    );

    await writeCustomPropertiesToExports(customProperties, exportTo);

    transformProperties(root, customProperties, { preserve });
  };

  // whether to return synchronous function if no asynchronous operations are requested
  const canReturnSyncFunction =
    importFrom.length === 0 && exportTo.length === 0;

  return {
    postcssPlugin: "postcss-custom-properties",
    Once: canReturnSyncFunction ? syncTransform : asyncTransform
  };
};

creator.postcss = true;

module.exports = creator;
