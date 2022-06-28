const { transform } = require("@swc/core");

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
      if (
        (importee === "@swc/helpers" ||
          importee.indexOf("@swc/helpers/") > -1) &&
        hasHelperDependency
      ) {
        return {
          id: importee,
          external: true
        };
      }

      return null;
    }
  };
};
