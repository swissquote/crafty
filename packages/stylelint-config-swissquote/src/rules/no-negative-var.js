import stylelint from "stylelint";

import declarationValueIndex from "stylelint/lib/utils/declarationValueIndex.mjs";
import isStandardSyntaxFunction from "stylelint/lib/utils/isStandardSyntaxFunction.mjs";
import valueParser from "postcss-value-parser";

const ruleName = "swissquote/no-negative-var";

const messages = {
  rejected: `Using "-" in front of "var()" doesn't work, use "calc(var(...) * -1)".`
};

const negativeVar = "-var";

const rule = function() {
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

rule.ruleName = ruleName;
rule.messages = messages;
export default rule;
