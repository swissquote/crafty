import stylelint from "../../packages/stylelint.js";

import selectorParser from "../../packages/postcss-selector-parser.js";
import resolveNestedSelector from "../../packages/postcss-resolve-nested-selector.js";

import cssRuleHasSelectorEndingWithColon from "../utils/cssRuleHasSelectorEndingWithColon.js";

export const ruleName = "swissquote/no-hack-reassignment";
export const messages = {
  rejected: "You cannot reassign a hack"
};

const isHack = /^_/;

export default function noHackReassignment(/*mainOption, moreOptions*/) {
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
              isHack.test(selectorNode.value) &&
              selectorNode.parent.nodes.length > 1
            ) {
              stylelint.utils.report({
                message: messages.rejected,
                node: rule,
                index: selectorNode.sourceIndex,
                endIndex: selectorNode.sourceIndex + selectorNode.value.length,
                ruleName,
                result
              });
            }
          });
        }).process(selector);
      });
    });
  };
}

noHackReassignment.ruleName = ruleName;
noHackReassignment.messages = messages;
