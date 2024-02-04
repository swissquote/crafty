import stylelint from "../../shims/stylelint.js";

import selectorParser from "../../packages/postcss-selector-parser.js";
import resolveNestedSelector from "../../packages/postcss-resolve-nested-selector.js";

import cssRuleHasSelectorEndingWithColon from "../utils/cssRuleHasSelectorEndingWithColon.js";

const ruleName = "swissquote/no-block-inside-block";
const messages = {
  rejected: "A block should not depend on another block directly"
};

const isBlock = /^[A-Z][a-zA-Z0-9]*$/;

function getGroup(selectorNode) {
  const group = [];

  // Get all elements after the current one till the next separator
  let take = false;
  const length = selectorNode.parent.nodes.length;
  for (let i = 0; i < length; i++) {
    if (take) {
      group.push(selectorNode.parent.nodes[i]);
    }

    // When at the current element, start to take
    if (selectorNode.parent.nodes[i] === selectorNode) {
      take = true;
    }
  }

  return group;
}

function isInsideBlock(selectorNode) {
  let group;
  if (selectorNode.parent.parent.type === "pseudo") {
    group = getGroup(selectorNode.parent.parent);
  } else {
    group = getGroup(selectorNode);
  }

  // If there is at least one component in the group, we're good
  return group.some(
    element => element.type === "class" && isBlock.test(element.value)
  );
}

const rule = function() {
  return (root, result) => {
    root.walkRules(rule => {
      if (cssRuleHasSelectorEndingWithColon(rule)) {
        return;
      }
      resolveNestedSelector(rule.selector, rule).forEach(selector => {
        selectorParser(selectorAST => {
          selectorAST.walk(selectorNode => {
            // No need to check if the current element isn't a Block
            if (
              selectorNode.type !== "class" ||
              !isBlock.test(selectorNode.value)
            ) {
              return;
            }

            if (isInsideBlock(selectorNode)) {
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
