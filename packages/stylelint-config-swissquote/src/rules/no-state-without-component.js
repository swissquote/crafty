import stylelint from "../../packages/stylelint.js";

import selectorParser from "../../packages/postcss-selector-parser.js";
import resolveNestedSelector from "../../packages/postcss-resolve-nested-selector.js";

import cssRuleHasSelectorEndingWithColon from "../utils/cssRuleHasSelectorEndingWithColon.js";

export const ruleName = "swissquote/no-state-without-component";
export const messages = {
  rejected: "A state must be linked to a component"
};

const containsState = /^(?:i|ha)s-/;
const isComponent = /^(?:[a-z$][a-zA-Z0-9]+-)?[A-Z][a-zA-Z0-9]*(__[a-z][a-zA-Z0-9]+)*(--[a-z][a-zA-Z0-9]+)*$/;

function getGroup(selectorNode) {
  const group = [];

  let take = false;

  const takeNeededElements = node => {
    if (take && node.type === "combinator") {
      return false;
    }

    if (take) {
      group.push(node);
    }

    // When at the current element, start to take
    if (node === selectorNode) {
      take = true;
    }

    return true;
  };

  // Get all elements after the current one till the next separator
  const length = selectorNode.parent.nodes.length;
  for (let i = 0; i < length; i++) {
    if (!takeNeededElements(selectorNode.parent.nodes[i])) {
      break;
    }
  }

  // Get all elements before the current one till the next separator
  take = false;
  for (let i = length - 1; i >= 0; i--) {
    if (!takeNeededElements(selectorNode.parent.nodes[i])) {
      break;
    }
  }

  return group;
}

function isOrphanState(selectorNode) {
  let group;
  if (selectorNode.parent.parent.type === "pseudo") {
    group = getGroup(selectorNode.parent.parent);
  } else {
    group = getGroup(selectorNode);
  }

  // If there is at least one component in the group, we're good
  return !group.some(
    element => element.type === "class" && isComponent.test(element.value)
  );
}

export default function noStateWithoutComponent() {
  return (root, result) => {
    root.walkRules(rule => {
      if (cssRuleHasSelectorEndingWithColon(rule)) {
        return;
      }

      resolveNestedSelector(rule.selector, rule).forEach(selector => {
        selectorParser(selectorAST => {
          selectorAST.walk(selectorNode => {
            // No need to check if the current element isn't a state
            if (
              selectorNode.type !== "class" ||
              !containsState.test(selectorNode.value)
            ) {
              return;
            }

            if (isOrphanState(selectorNode)) {
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

noStateWithoutComponent.ruleName = ruleName;
noStateWithoutComponent.messages = messages;
