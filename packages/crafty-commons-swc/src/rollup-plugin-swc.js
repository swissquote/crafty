const { transform } = require("@swc/core");

const regExpCharactersRegExp = /[\\^$.*+?()[\]{}|]/g;
const escapeRegExpCharacters = str =>
  str.replace(regExpCharactersRegExp, "\\$&");

function stripQuery(id) {
  // strip query params from import
  const [bareId, query] = id.split("?");
  const suffix = `${query ? `?${query}` : ""}`;
  return {
    bareId,
    query,
    suffix
  };
}

const DEFAULT_EXTENSION = ["js", "cjs", "mjs", "jsx"];

const isHelper = /\/node_modules\/@swc\/helpers\//;

module.exports = function swcPlugin({
  extensions = DEFAULT_EXTENSION,
  hasHelperDependency,
  ...options
} = {}) {
  const extensionRegExp = new RegExp(
    `(${extensions.map(escapeRegExpCharacters).join("|")})$`
  );

  const filter = id => extensionRegExp.test(stripQuery(id).bareId);

  return {
    name: "swc",
    async transform(code, filename) {
      if (!filter(filename)) {
        return null;
      }

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
