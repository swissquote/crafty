import stylelint from "../../shims/stylelint.js";

import selectorParser from "../../packages/postcss-selector-parser.js";
import resolveNestedSelector from "../../packages/postcss-resolve-nested-selector.js";

import cssRuleHasSelectorEndingWithColon from "../utils/cssRuleHasSelectorEndingWithColon.js";

const ruleName = "swissquote/no-utility-reassignment";
const messages = {
  rejected: "You cannot reassign a utility"
};

const isUtility = /^u-/;

const rule = function(/*mainOption, moreOptions*/) {
  return (root, result) => {
    root.walkRules(rule => {
      if (cssRuleHasSelectorEndingWithColon(rule)) {
        return;
      }

      // Resolve nested selectors
      resolveNestedSelector(rule.selector, rule).forEach(selector => {
        selectorParser(selectorAST => {
          selectorAST.walk(selectorNode => {
            // If the selector is a utility class and it has more than
            // one element in the selector, it's considered a reassignment
            if (
              selectorNode.type === "class" &&
              isUtility.test(selectorNode.value) &&
              selectorNode.parent.nodes.length > 1
            ) {
              stylelint.utils.report({
                message: messages.rejected,
                node: rule,
                index: selectorNode.sourceIndex,
                ruleName,
                result
              });
            }
          });
        }).process(selector);
      });
    });
  };
};

rule.ruleName = ruleName;
rule.messages = messages;
export default rule;
