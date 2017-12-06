const selectorParser = require("postcss-selector-parser");
const resolveNestedSelector = require("postcss-resolve-nested-selector");
const report = require("stylelint/lib/utils/report");

const cssRuleHasSelectorEndingWithColon = require("../utils/cssRuleHasSelectorEndingWithColon");

const ruleName = "swissquote/no-state-without-component";
const messages = {
  rejected: "A state must be linked to a component"
};

const containsState = /^(?:i|ha)s-/;
const isComponent = /^(?:[a-z$][a-zA-Z0-9]+-)?[A-Z][a-zA-Z0-9]*(__[a-z][a-zA-Z0-9]+)*(--[a-z][a-zA-Z0-9]+)*$/;

function getGroup(selectorNode) {
  const group = [];

  // Get all elements after the current one till the next separator
  let take = false;
  const length = selectorNode.parent.nodes.length;
  for (let i = 0; i < length; i++) {
    if (take && selectorNode.parent.nodes[i].type === "combinator") {
      break;
    }

    if (take) {
      group.push(selectorNode.parent.nodes[i]);
    }

    // When at the current element, start to take
    if (selectorNode.parent.nodes[i] === selectorNode) {
      take = true;
    }
  }

  take = false;
  for (let i = length - 1; i >= 0; i--) {
    if (take && selectorNode.parent.nodes[i].type === "combinator") {
      break;
    }

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

function isOrphanState(selectorNode) {
  let group;
  if (selectorNode.parent.parent.type === "pseudo") {
    group = getGroup(selectorNode.parent.parent);
  } else {
    group = getGroup(selectorNode);
  }

  // If there is at least one component in the group, we're good
  return !group.some(
    element => element.type === "class" && element.value.match(isComponent)
  );
}

module.exports = function() {
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
              !selectorNode.value.match(containsState)
            ) {
              return;
            }

            if (isOrphanState(selectorNode)) {
              report({
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

module.exports.ruleName = ruleName;
module.exports.messages = messages;
