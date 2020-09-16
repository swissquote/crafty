const selectorParser = require("postcss-selector-parser");
const resolveNestedSelector = require("postcss-resolve-nested-selector");
const report = require("stylelint/lib/utils/report");

const cssRuleHasSelectorEndingWithColon = require("../utils/cssRuleHasSelectorEndingWithColon");

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
    element => element.type === "class" && element.value.match(isBlock)
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
            // No need to check if the current element isn't a Block
            if (
              selectorNode.type !== "class" ||
              !selectorNode.value.match(isBlock)
            ) {
              return;
            }

            if (isInsideBlock(selectorNode)) {
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
