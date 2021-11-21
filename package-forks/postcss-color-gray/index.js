const { parse } = require("postcss-values-parser");
const { colord, extend } = require("colord");
const labPlugin = require("colord/plugins/lab");
const Numeric = require("postcss-values-parser/lib/nodes/Numeric");
const Punctuation = require("postcss-values-parser/lib/nodes/Punctuation");

extend([labPlugin]);

// return whether a string contains a gray() function
const hasGrayFunctionRegExp = /(^|[^\w-])gray\(/i;
const hasGrayFunction = decl => hasGrayFunctionRegExp.test(Object(decl).value);

// return whether a node matches a specific type
const isNumber = node => Object(node).type === "numeric";
const isOperator = node => Object(node).type === "operator";
const isFunction = node => Object(node).type === "func";
const isFunctionCalc = node => isFunction(node) && node.name === "calc";
const isNumberPercentage = node => isNumber(node) && node.unit === "%";
const isNumberUnitless = node => isNumber(node) && node.unit === "";
const isOperatorSlash = node => isOperator(node) && node.value === "/";

// return valid values from a node, otherwise undefined
const getNumberUnitless = node =>
  isNumberUnitless(node) ? Number(node.value) : undefined;
const getOperatorSlash = node => (isOperatorSlash(node) ? null : undefined);

function getAlpha(node) {
  if (isFunctionCalc(node)) {
    return String(node);
  }

  if (isNumberUnitless(node)) {
    return Number(node.value);
  }

  if (isNumberPercentage(node)) {
    return Number(node.value) / 100;
  }

  return undefined;
}

// return valid arguments from a gray() function
const functionalGrayArgs = [getNumberUnitless, getOperatorSlash, getAlpha];
const getFunctionGrayArgs = node => {
  if (node.name !== "gray" || !node.nodes || !node.nodes.length) {
    // otherwise, return an empty array
    return [];
  }

  // if the node is a gray() function with arguments

  // validate each argument
  const validArgs = node.nodes
    .map((value, index) => {
      return typeof functionalGrayArgs[index] === "function"
        ? functionalGrayArgs[index](value)
        : undefined;
    })
    .filter(item => item !== null);

  if (validArgs.some(value => value === undefined)) {
    return [];
  }

  // return the valid arguments array
  return validArgs;
};

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
        ast.walkFuncs(node => {
          const [lightness, alpha] = getFunctionGrayArgs(node);

          if (lightness !== undefined) {
            // rename the gray() function to rgb()
            node.name = "rgb";

            // convert the lab gray lightness into rgb
            const { r, g, b } = colord({ l: lightness, a: 0, b: 0 }).toRgb();

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
              value: modifiedValue
            });
          } else {
            // otherwise, overwrite the declaration value with the fallback
            decl.value = modifiedValue;
          }
        }
      }
    }
  };
};

module.exports.postcss = true;
