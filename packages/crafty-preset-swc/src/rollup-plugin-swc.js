const { transform } = require("@swc/core");

module.exports = function swcPlugin(options = {}) {
  const hasHelperDependency = options.hasHelperDependency;
  delete options.hasHelperDependency;

  return {
    name: "swc",
    transform(code, filename) {
      options.filename = filename;
      return transform(code, options);
    },
    resolveId(importee, importer) {
      if (importee === "@swc/helpers") {
        if (hasHelperDependency) {
          return {
            id: importee,
            external: true
          };
        }

        return require.resolve("@swc/helpers/src/index.js");
      }

      return null;
    }
  };
};
