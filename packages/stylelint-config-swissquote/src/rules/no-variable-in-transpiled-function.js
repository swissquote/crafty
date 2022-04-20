const stylelint = require("../../shims/stylelint");
const browserslist = require("@swissquote/crafty-commons/packages/browserslist");

const valueParser = require("../../packages/postcss-value-parser");
const declarationValueIndex = require("../../dist/stylelint-utils/stylelint-declarationValueIndex");
const isStandardSyntaxFunction = require("../../dist/stylelint-utils/stylelint-isStandardSyntaxFunction");

const w3cColorFunction = /^(srgb|srgb-linear|display-p3|a98-rgb|prophoto-rgb|rec2020|xyz|xyz-d50|xyz-d65)$/;

const optionsSchema = {
  browsers: value => typeof value === "string"
};

const ruleName = "swissquote/no-variable-in-transpiled-function";

const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: name => `Unexpected var() in transpiled function "${name}"`
});

// Lazy load caniuse's data
let caniuseFeature;
let caniuseFeatures;

// To better bundle the dependencies, we don't need the full caniuse-api
// we inline this function instead : https://github.com/Nyalab/caniuse-api/blob/master/src/index.js#L34-L50
function isSupported(feature, browsers) {
  // Load only when it's needed for the first time
  if (!caniuseFeatures) {
    const { features, feature: featureUnpack } = require("caniuse-lite");
    caniuseFeatures = features;
    caniuseFeature = featureUnpack;
  }

  let data;
  try {
    data = caniuseFeature(caniuseFeatures[feature]);
  } catch (e) {
    throw new ReferenceError(
      `Please provide a proper feature name. Cannot find ${feature}`
    );
  }

  return browsers
    .map(browser => browser.split(" "))
    .every(
      browser =>
        data.stats[browser[0]] && data.stats[browser[0]][browser[1]] === "y"
    );
}

function isVar(node) {
  return node && node.type === "function" && node.value === "var";
}

function isUsingVar(node) {
  return node.nodes.some(
    innerNode => isVar(innerNode) || (innerNode.nodes && isUsingVar(innerNode))
  );
}

function isUsingCommaSeparators(node) {
  return node.nodes.some(innerNode => {
    return innerNode.type === "div" && innerNode.value === ",";
  });
}

const resolvedBrowsers = [];

function isUnsupportedFeature(feature, browsers) {
  if (!(browsers in resolvedBrowsers)) {
    resolvedBrowsers[browsers] = browserslist(browsers, {
      ignoreUnknownVersions: true
    });
  }

  return !isSupported(feature, resolvedBrowsers[browsers]);
}

/**
 * An unsupported function is a function that *some* target browsers don't support
 * Which means that some transpiling needs to happen.
 *
 * If the function is transpiled AND is using a custom property, it won't be possible
 * to customize this custom property after transpilation anymore.
 */
function isUnsupportedFunction(node, browsers) {
  const functionName = node.value.toLowerCase();

  if (["rgb", "rgba"].includes(functionName)) {
    // CSS Level 3 colors are using commas as separators
    if (isUsingCommaSeparators(node)) {
      // CSS3 colors are supported by all browsers
      // that support custom properties, no need to check further
      return false;
    }

    // CSS Level 4 colors are using spaces and slashes as separators
    return true;
  }

  if (["lab", "lch"].includes(functionName)) {
    return isUnsupportedFeature("css-lch-lab", browsers);
  }

  // image-set()
  if (["image-set"].includes(functionName)) {
    return isUnsupportedFeature("css-image-set", browsers);
  }

  // postcss-assets, unsupported
  if (["inline", "width", "height", "resolve", "size"].includes(functionName)) {
    return true;
  }

  // postcss-gray, unsupported
  if (functionName === "gray") {
    return true;
  }

  // CSS Colors Level 4
  if (["oklab", "oklch", "hwb"].includes(functionName)) {
    // TODO there is no caniuse data for these functions
    return true;
  }

  // color() -> css-color-function
  // color() / color-mod()
  if (["color", "color-mod"].includes(functionName)) {
    // w3c color() functions have a chance of being supported
    if (
      functionName === "color" &&
      w3cColorFunction.test(node.nodes[0].value)
    ) {
      return isUnsupportedFeature("css-color-function", browsers);
    }

    return true;
  }

  return false;
}

module.exports = (on, options) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: options,
      possible: optionsSchema,
      optional: false
    });

    if (!validOptions) {
      //If the options are invalid, don't lint
      return;
    }

    const browsers = options.browsers;

    // skip rule if css variables aren't supported; everything is transpiled anyway
    if (isUnsupportedFeature("css-variables", browsers)) {
      return;
    }

    root.walkDecls(decl => {
      const { value } = decl;

      valueParser(value).walk(node => {
        if (node.type !== "function") {
          return;
        }

        if (!isStandardSyntaxFunction(node)) {
          return;
        }

        if (!isUsingVar(node)) {
          return;
        }

        if (!isUnsupportedFunction(node, browsers)) {
          return;
        }

        stylelint.utils.report({
          message: messages.rejected(node.value),
          node: decl,
          index: declarationValueIndex(decl) + node.sourceIndex,
          result,
          ruleName
        });
      });
    });
  };
};

module.exports.ruleName = ruleName;
module.exports.messages = messages;
