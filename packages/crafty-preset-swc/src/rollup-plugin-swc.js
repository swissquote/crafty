const { transform } = require("@swc/core");

const HELPERS_INDEX = require.resolve("@swc/helpers/src/index.mjs");
const isHelper = /\/node_modules\/@swc\/helpers\//;

module.exports = function swcPlugin(options = {}) {
  const hasHelperDependency = options.hasHelperDependency;
  delete options.hasHelperDependency;

  return {
    name: "swc",
    async transform(code, filename) {
      // This optimization is not mandatory but also doesn't hurt
      if (isHelper.test(filename)) {
        return {};
      }

      options.filename = filename;
      return transform(code, options);
    },
    resolveId(importee /*, importer*/) {
      if (importee === "@swc/helpers" || importee === HELPERS_INDEX) {
        if (hasHelperDependency) {
          return {
            id: importee,
            external: true
          };
        }

        return HELPERS_INDEX;
      }

      return null;
    }
  };
};
