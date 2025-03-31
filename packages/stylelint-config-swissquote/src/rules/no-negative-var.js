import stylelint from "../../packages/stylelint.js";

import { declarationValueIndex } from "../../dist/stylelint/utils-nodeFieldIndices.js";
import isStandardSyntaxFunction from "../../dist/stylelint/utils-isStandardSyntaxFunction.js";
import valueParser from "../../packages/postcss-value-parser.js";

export const ruleName = "swissquote/no-negative-var";

export const messages = {
  rejected: `Using "-" in front of "var()" doesn't work, use "calc(var(...) * -1)".`
};

const negativeVar = "-var";

export default function noNegativeVar() {
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

        const baseIndex = declarationValueIndex(decl);

        stylelint.utils.report({
          message: messages.rejected,
          node: decl,
          index: baseIndex + node.sourceIndex,
          endIndex: baseIndex + node.sourceIndex + node.value.length,
          result,
          ruleName
        });
      });
    });
  };
}

noNegativeVar.ruleName = ruleName;
noNegativeVar.messages = messages;
