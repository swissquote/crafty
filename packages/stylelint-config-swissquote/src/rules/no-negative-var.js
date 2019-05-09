const declarationValueIndex = require("stylelint/lib/utils/declarationValueIndex");
const isStandardSyntaxFunction = require("stylelint/lib/utils/isStandardSyntaxFunction");
const postcss = require("postcss");
const report = require("stylelint/lib/utils/report");
const valueParser = require("postcss-value-parser");

const ruleName = "swissquote/no-negative-var";

const messages = {
  rejected: `Using "-" in front of "var()" doesn't work, use "calc(var(...) * -1)".`
};

const negativeVar = "-var";

const rule = function() {
  return (root, result) => {
    root.walkDecls(decl => {
      const value = decl.value;

      valueParser(value).walk(function(node) {
        if (node.type !== "function") {
          return;
        }

        if (!isStandardSyntaxFunction(node)) {
          return;
        }

        if (
          postcss.vendor.unprefixed(node.value) !== negativeVar
        ) {
          return;
        }

        report({
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

rule.ruleName = ruleName;
rule.messages = messages;
module.exports = rule;