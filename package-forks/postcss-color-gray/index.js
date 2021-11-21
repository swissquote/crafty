const { parse } = require("postcss-values-parser");
const { colord, extend } = require("colord");
const labPlugin = require("colord/plugins/lab");
const Numeric = require("postcss-values-parser/lib/nodes/Numeric");
const Punctuation = require("postcss-values-parser/lib/nodes/Punctuation");

extend([labPlugin]);

/**
 * @param {{preserve?: boolean}} opts
 * @returns {import('postcss').Plugin}
 */
module.exports = function creator(opts) {
  const preserve = Boolean(Object(opts).preserve);

  return {
    postcssPlugin: "postcss-color-gray",
    // walk all declarations likely containing a gray() function
    Declaration(decl) {
      if (hasGrayFunction(decl)) {
        const { value: originalValue } = decl;

        // parse the declaration value
        const ast = parse(originalValue);

        // walk every node in the value that contains a gray() function
        ast.walkFuncs((node) => {
          const [lightness, alpha] = getFunctionGrayArgs(node);

          if (lightness !== undefined) {
            // rename the gray() function to rgb()
            node.name = "rgb";

            // convert the lab gray lightness into rgb
            const  { r, g, b } = colord({l: lightness, a:0,b:0}).toRgb();

            node
              .removeAll()
              // replace the contents of rgb with `r,g,b`
              .append(new Numeric({ value: r }))
              .append(new Punctuation({ value: "," }))
              .append(new Numeric({ value: g }))
              .append(new Punctuation({ value: "," }))
              .append(new Numeric({ value: b }));

            // if an alpha channel was defined
            if (alpha < 1) {
              // rename the rgb() function to rgba()
              node.name += "a";

              node
                // append the contents of rgba with `,a`
                .append(new Punctuation({ value: "," }))
                .append(new Numeric({ value: alpha }));
            }
          }
        });

        const modifiedValue = ast.toString();

        // if the modified value has changed from the original value
        if (originalValue !== modifiedValue) {
          // if the original gray() color is to be preserved
          if (preserve) {
            // insert the declaration value with the fallback before the current declaration
            decl.cloneBefore({
              value: modifiedValue,
            });
          } else {
            // otherwise, overwrite the declaration value with the fallback
            decl.value = modifiedValue;
          }
        }
      }
    },
  };
};

module.exports.postcss = true;

// return whether a string contains a gray() function
const hasGrayFunctionRegExp = /(^|[^\w-])gray\(/i;
const hasGrayFunction = (decl) =>
  hasGrayFunctionRegExp.test(Object(decl).value);

// return whether a node matches a specific type
const isNumber = (node) => Object(node).type === "numeric";
const isOperator = (node) => Object(node).type === "operator";
const isFunction = (node) => Object(node).type === "func";
const isFunctionCalc = (node) => isFunction(node) && node.name === "calc";
const isNumberPercentage = (node) => isNumber(node) && node.unit === "%";
const isNumberUnitless = (node) => isNumber(node) && node.unit === "";
const isOperatorSlash = (node) => isOperator(node) && node.value === "/";

// return valid values from a node, otherwise undefined
const getNumberUnitless = (node) =>
  isNumberUnitless(node) ? Number(node.value) : undefined;
const getOperatorSlash = (node) => (isOperatorSlash(node) ? null : undefined);
const getAlpha = (node) =>
  isFunctionCalc(node)
    ? String(node)
    : isNumberUnitless(node)
    ? Number(node.value)
    : isNumberPercentage(node)
    ? Number(node.value) / 100
    : undefined;

// return valid arguments from a gray() function
const functionalGrayArgs = [getNumberUnitless, getOperatorSlash, getAlpha];
const getFunctionGrayArgs = (node) => {
  const validArgs = [];

  // if the node is a gray() function with arguments
  if (node.name === "gray" && node.nodes && node.nodes.length) {
    // get all the gray() function arguments between `(` and `)`
    const nodes = node.nodes;

    // validate each argument
    for (const index in nodes) {
      const arg =
        typeof functionalGrayArgs[index] === "function"
          ? functionalGrayArgs[index](nodes[index])
          : undefined;

      // if the argument was validated
      if (arg !== undefined) {
        // push any non-null argument to the valid arguments array
        if (arg !== null) {
          validArgs.push(arg);
        }
      } else {
        // otherwise, return an empty array
        return [];
      }
    }

    // return the valid arguments array
    return validArgs;
  } else {
    // otherwise, return an empty array
    return [];
  }
};
