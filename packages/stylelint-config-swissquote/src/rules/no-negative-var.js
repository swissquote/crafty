const stylelint = require("../../shims/stylelint");

const declarationValueIndex = require("../../dist/stylelint-utils/stylelint-declarationValueIndex");
const isStandardSyntaxFunction = require("../../dist/stylelint-utils/stylelint-isStandardSyntaxFunction");
const valueParser = require("../../packages/postcss-value-parser");

const ruleName = "swissquote/no-negative-var";

const messages = {
  rejected: `Using "-" in front of "var()" doesn't work, use "calc(var(...) * -1)".`
};

const negativeVar = "-var";

module.exports = function() {
  return (root, result) => {
    root.walkDecls(decl => {
      const value = decl.value;

      valueParser(value).walk(node => {
        if (node.type !== "function") {
          return;
        }

        if (!isStandardSyntaxFunction(node)) {
          return;
        }

        // Remove prefixes and check if it's a negativeVar
        if (node.value.replace(/^-\w+-/, "") !== negativeVar) {
          return;
        }

        stylelint.utils.report({
          message: messages.rejected,
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
