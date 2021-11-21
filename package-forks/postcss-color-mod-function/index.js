const getCustomProperties = require("./lib/get-custom-properties");
const importCustomPropertiesFromSources = require("./lib/import-from");
const { parse } = require("postcss-values-parser");
const transformAST = require("./lib/transform");

const colorModFunctionMatch = /(^|[^\w-])color(?:-mod)?\(/i;

module.exports = (opts = {}) => {
  // how unresolved functions and arguments should be handled (default: "throw")
  const unresolvedOpt = String(
    Object(opts).unresolved || "throw"
  ).toLowerCase();

  // how transformed colors will be produced in CSS
  const stringifierOpt =
    Object(opts).stringifier || (color => color.toLegacy());

  // sources to import custom selectors from
  const importFrom = [].concat(Object(opts).importFrom || []);

  // whether var() within color-mod() should use Custom Properties or var() fallback
  const transformVarsOpt =
    "transformVars" in Object(opts) ? opts.transformVars : true;

  // promise any custom selectors are imported
  const customPropertiesPromise = importCustomPropertiesFromSources(importFrom);

  return {
    postcssPlugin: "postcss-color-mod-function",
    async Once(root, { result }) {
      const customProperties = Object.assign(
        await customPropertiesPromise,
        getCustomProperties(root, { preserve: true })
      );

      root.walkDecls(decl => {
        const originalValue = decl.value;

        if (colorModFunctionMatch.test(originalValue)) {
          const ast = parse(originalValue, { loose: true });

          transformAST(ast, {
            unresolved: unresolvedOpt,
            stringifier: stringifierOpt,
            transformVars: transformVarsOpt,
            decl,
            result,
            customProperties
          });

          const modifiedValue = ast.toString();

          if (originalValue !== modifiedValue) {
            decl.value = modifiedValue;
          }
        }
      });
    }
  };
};

module.exports.postcss = true;
